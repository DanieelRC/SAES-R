# c:\Users\rodri\ProyectosPython\agenteSAES_phi\main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from xai_sdk import Client
from xai_sdk.chat import user, system
from utils_rag import ReglamentoRAG
from db_utils import obtener_datos_usuario, obtener_datos_profesor
from question_classifier import QuestionClassifier, DirectAnswerBuilder
from concurrent.futures import ThreadPoolExecutor
from functools import lru_cache
from cachetools import TTLCache
from threading import Lock, RLock
from typing import Dict, Any, Tuple, Optional
import re
import logging
import unicodedata
import time
import asyncio
import hashlib
import os
import uuid
from dataclasses import dataclass

# Configuración de Logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# ============================================================================ 
# CONFIGURACIÓN Y CACHÉ
# ============================================================================ 
executor = ThreadPoolExecutor(max_workers=8)

# Caché con tiempo de vida (TTL)
cache_usuarios = TTLCache(maxsize=1000, ttl=300)   # 5 minutos
cache_respuestas = TTLCache(maxsize=500, ttl=600)  # 10 minutos

# Locks para acceso seguro a recursos compartidos
llm_lock = Lock()
rag_lock = Lock()
cache_usuarios_lock = RLock()
cache_respuestas_lock = RLock()

# Configuración de la API de Grok (xAI)
XAI_API_KEY = os.getenv("XAI_API_KEY") # ¡Asegúrate de tener esta variable de entorno!
GROK_MODEL = "grok-3-mini" # Modelo optimizado para velocidad y costo

# ============================================================================ 
# SISTEMA DE COLA DE MENSAJES
# ============================================================================ 
@dataclass
class QueueRequest:
    """Estructura para peticiones en la cola."""
    request_id: str
    pregunta: 'Pregunta'
    future: asyncio.Future
    timestamp: float

# Cola de mensajes para procesar peticiones secuencialmente
message_queue: asyncio.Queue = None
queue_stats = {
    "total_processed": 0,
    "total_errors": 0,
    "current_queue_size": 0,
    "processing": False,
}
queue_stats_lock = Lock()

# ============================================================================ 
# GESTIÓN DE MODELOS (CLIENTE API Y RAG)
# ============================================================================ 

llm_client = None
rag = None

def garantizar_carga_modelos():
    """
    Función que verifica si el cliente API y RAG están listos.
    Si no lo están, los inicializa (Lazy Loading).
    """
    global llm_client, rag
    
    # 1. Carga de RAG (Base de conocimientos)
    if rag is None:
        with rag_lock: 
            if rag is None:
                try:
                    logging.info("⏳ Iniciando carga diferida de RAG...")
                    # Asegúrate de que estos archivos existan en tu carpeta
                    rag = ReglamentoRAG(index_path="reglamentos_ipn.index", json_path="reglamentos_ipn.json")
                    logging.info("✅ RAG cargado correctamente.")
                except Exception as e:
                    logging.error(f"❌ Error cargando RAG: {e}")

    # 2. Inicialización del Cliente Grok
    if llm_client is None:
        with llm_lock:
            if llm_client is None:
                try:
                    if not XAI_API_KEY:
                        logging.warning("⚠️ ADVERTENCIA: No se encontró la variable XAI_API_KEY.")
                    
                    logging.info(f"⏳ Conectando con API de Grok (Modelo: {GROK_MODEL})...")
                    llm_client = Client(
                        api_key=XAI_API_KEY,
                    )
                    logging.info("✅ Cliente Grok inicializado correctamente.")
                except Exception as e:
                    logging.error(f"❌ Error inicializando cliente Grok: {e}", exc_info=True)

# ============================================================================ 
# ESQUEMAS
# ============================================================================ 
class Pregunta(BaseModel):
    query: str
    id_usuario: str
    tipo_usuario: str  # "alumno" o "profesor"
    razonamiento: int = 0  # 0 = usar clasificador, 1 = forzar LLM


class CacheStats(BaseModel):
    cache_usuarios_size: int
    cache_respuestas_size: int


# ============================================================================ 
# PROMPT Y FUNCIONES AUXILIARES
# ============================================================================ 
PROMPT_SISTEMA_BASE = (
    "Eres un asistente académico del IPN (Instituto Politécnico Nacional de México). Usuario: **{tipo_usuario_upper}**.\n\n"
    "CONTEXTO: Estás respondiendo preguntas sobre educación, reglamentos académicos, trámites escolares del IPN y situaciones académicas. "
    "Todas las preguntas son en contexto educativo. Términos como 'ETS' se refieren a 'Evaluación a Título de Suficiencia'.\n\n"
    "REGLA FUNDAMENTAL: Solo puedes responder usando la información que aparece en los CONTEXTOS de abajo. "
    "NO uses tu conocimiento general. Si la respuesta NO está en los contextos, di: 'No tengo esa información en mi base de datos actual. Por favor contacta con gestión escolar.'\n\n"
    "FORMATO DE HORARIOS: Los horarios están en formato 'Día HH:MM-HH:MM'. Ejemplo: 'Lunes 7:00-8:30'.\n\n"
    "EJEMPLO DE CÓMO RESPONDER:\n"
    "Pregunta: ¿Qué es un crédito?\n"
    "Contexto: 'Crédito: A la unidad de reconocimiento académico...'\n"
    "Respuesta CORRECTA: Un crédito es la unidad de reconocimiento académico que mide las actividades de aprendizaje.\n\n"
    "CONTEXTOS DISPONIBLES:\n\n"
    "=== DATOS DEL USUARIO ===\n"
    "{contexto_academico}\n\n"
    "=== REGLAMENTO IPN ===\n"
    "{contexto_rag}\n\n"
    "INSTRUCCIONES:\n"
    "1. Lee la pregunta del usuario\n"
    "2. Busca la respuesta SOLO en los contextos de arriba\n"
    "3. Si la encuentras: responde en 2-3 oraciones, conciso.\n"
    "4. Si NO la encuentras: di que no tienes esa información\n"
    "5. RESPONDE SIEMPRE EN ESPAÑOL\n\n"
)


def _construir_contexto_alumno(datos: Dict[str, Any]) -> str:
    """Construye el texto de contexto académico para el alumno."""
    if not datos or not datos.get("boleta"):
        return "No se pudo obtener información académica del alumno."
    contexto = [
        f"Boleta: {datos.get('boleta', 'N/A')}",
        f"Nombre: {datos.get('nombre', 'N/A')}",
        f"Carrera: {datos.get('carrera', 'N/A')}",
        f"Promedio general: {datos.get('promedio', 0.0):.2f}",
        f"Créditos disponibles: {datos.get('creditos_disponibles', 0)}",
        f"Estado académico: {datos.get('estado_academico', 'N/A')}",
        f"Situación en Kardex: {datos.get('situacion_kardex', 'N/A')}",
        f"Semestre Actual: {datos.get('semestre_actual', 'N/A')}",
        f"Reinscripción Activa: {'Sí' if datos.get('reinscripcion_activa') else 'No'} (Caduca: {datos.get('inscripcion_caduca', 'N/A')})",
        "\n--- Materias Inscritas ---\n" + (datos.get("materias_inscritas_texto", "Ninguna")),
        "\n--- Historial Académico (Aprobadas) ---\n" + (datos.get("materias_aprobadas_texto", "Sin materias aprobadas.")),
        "\n--- Historial Académico (Reprobadas) ---\n" + (datos.get("materias_reprobadas_texto", "Sin materias reprobadas.")),
        "\n--- Fechas Relevantes ---\n"
        + "\n".join(
            [f"- {k}: {v}" for k, v in datos.get("fechas_semestre", {}).items()
             if k in ["inicio_semestre", "fin_semestre", "registro_primer_parcial"]]
        ),
    ]
    return "\n".join(contexto)


def _construir_contexto_profesor(datos: Dict[str, Any]) -> str:
    """Construye el texto de contexto académico para el profesor."""
    if not datos or not datos.get("id_profesor"):
        return "No se pudo obtener información académica del profesor."
    contexto = [
        f"ID Profesor: {datos.get('id_profesor', 'N/A')}",
        f"Nombre: {datos.get('nombre', 'N/A')}",
        f"Grado: {datos.get('grado', 'N/A')}",
        f"Calificación promedio: {datos.get('calificacion_promedio', 0.0):.1f} ({datos.get('total_resenas', 0)} reseñas)",
        "\n--- Grupos Impartidos ---\n" + (datos.get("grupos_texto", "Sin grupos asignados.")),
        "\n--- Últimos Comentarios ---\n" + (datos.get("ultimos_comentarios", "Sin comentarios recientes.")),
        "\n--- Fechas Relevantes ---\n"
        + "\n".join(
            [f"- {k}: {v}" for k, v in datos.get("fechas_semestre", {}).items()
             if k in ["evalu_profe", "registro_primer_parcial", "fin_registro_primer_parcial"]]
        ),
    ]
    return "\n".join(contexto)


def _limpiar_respuesta(respuesta: str) -> str:
    """Post-procesa la respuesta para asegurar formato conciso."""
    if not respuesta:
        return respuesta
    
    # Limpiezas regex básicas
    respuesta = re.sub(r'^\s*\d+[\.\)]\s*', '', respuesta, flags=re.MULTILINE)
    respuesta = re.sub(r'^\s*[-\*•]\s*', '', respuesta, flags=re.MULTILINE)
    respuesta = re.sub(r'\n\s*\n', ' ', respuesta)
    respuesta = re.sub(r'\n', ' ', respuesta)
    respuesta = re.sub(r'\s+', ' ', respuesta)
    
    # Eliminar frases de relleno
    frases_relleno = [
        r'Como asistente académico,?\s*',
        r'En resumen,?\s*',
        r'Para concluir,?\s*',
        r'Espero que esto ayude\.?\s*',
        r'Si tienes más preguntas\.?\s*',
        r'Basado en el contexto proporcionado,?\s*'
    ]
    for frase in frases_relleno:
        respuesta = re.sub(frase, '', respuesta, flags=re.IGNORECASE)
    
    respuesta = respuesta.strip()
    if respuesta and respuesta[-1] not in '.!?]':
        respuesta += '.'
    
    return respuesta


def _validar_respuesta(respuesta: str) -> bool:
    """Valida la calidad básica de la respuesta."""
    if not respuesta or len(respuesta) < 20:
        return False
    if len(respuesta) > 800: # Permitimos un poco más para RAG
        return False
    return True

def _generar_respuesta_sync(prompt_sistema: str, texto_usuario: str) -> Tuple[str, float]:
    """
    Genera la respuesta usando la API de Grok (xAI).
    Sustituye la llamada local a Llama.
    """
    if not llm_client:
        return "Error interno: El cliente Grok no está inicializado. Verifica tu API Key.", 0.0

    inicio = time.time()
    try:
        # Llamada a la API de Grok usando xai-sdk
        chat = llm_client.chat.create(model=GROK_MODEL)
        chat.append(system(prompt_sistema))
        chat.append(user(texto_usuario))

        response = chat.sample()
        
        respuesta = response.content.strip()
        tiempo_ms = round((time.time() - inicio) * 1000, 2)
        return respuesta, tiempo_ms

    except Exception as e:
        logging.error(f"Error en API Grok: {e}")
        return f"Lo siento, hubo un error al consultar mi cerebro digital: {e}", 0.0


@lru_cache(maxsize=100)
def _buscar_contexto_cached(query: str, tipo_usuario: str, top_k: int = 3) -> str:
    """Busca contexto en el RAG con caché LRU."""
    if not rag:
        return "El sistema RAG no está inicializado."

    expanded_query = query
    if tipo_usuario and tipo_usuario.lower() == "profesor":
        expanded_query = f"{query} docente enseñanza responsabilidades"
    elif tipo_usuario and tipo_usuario.lower() == "alumno":
        expanded_query = f"{query} estudiante requisitos académicos"
    
    logging.info(f"Query RAG expandida para {tipo_usuario}: {expanded_query}")
    contexto = rag.buscar_contexto(expanded_query, top_merge=top_k)
    return _dedup_sentences(contexto)


def _dedup_sentences(text: str) -> str:
    """Limpia y elimina duplicados del texto recuperado."""
    if not text:
        return ""
    fragments = text.split("\n\n")
    unique_fragments = set()
    cleaned_fragments = []
    for fragment in fragments:
        cleaned = re.sub(r"\s+", " ", fragment).strip()
        norm = unicodedata.normalize("NFKD", cleaned).encode("ascii", "ignore").decode("ascii").lower()
        if cleaned and len(cleaned.split()) > 10 and norm not in unique_fragments:
            unique_fragments.add(norm)
            cleaned_fragments.append(cleaned)
    return "\n---\n".join(cleaned_fragments)


async def _process_single_request(pregunta: Pregunta) -> Dict[str, Any]:
    """Procesa una única petición."""
    
    # Aseguramos que Grok y RAG estén listos
    garantizar_carga_modelos()

    texto_usuario = pregunta.query
    id_usuario = pregunta.id_usuario
    tipo_usuario = pregunta.tipo_usuario.lower()
    razonamiento = pregunta.razonamiento
    
    logging.info(f"Procesando: {tipo_usuario} {id_usuario} -> {texto_usuario}")

    # 1. Clasificación
    if razonamiento == 1:
        tipo_pregunta = "complex"
        subtipo = None
    else:
        tipo_pregunta, subtipo = QuestionClassifier.classify(texto_usuario)

    # 2. Verificar Caché de Respuestas
    cache_key = hashlib.sha256(f"{tipo_usuario}:{id_usuario}:{texto_usuario}".encode("utf-8")).hexdigest()
    with cache_respuestas_lock:
        if cache_key in cache_respuestas:
            logging.info("Respuesta obtenida de caché.")
            return {
                "response": cache_respuestas[cache_key],
                "tiempo_ms": 0,
                "tipo_respuesta": "cached",
                "from_cache": True,
            }

    # 3. Obtener datos de usuario
    datos_usuario = _obtener_datos_usuario_cached(id_usuario, tipo_usuario)
    datos_encontrados = bool(datos_usuario and (datos_usuario.get("boleta") or datos_usuario.get("id_profesor")))

    # 4. Generación de Respuesta
    respuesta_final = None
    tiempo_ms = 0
    tipo_respuesta = "llm"

    # -- Intento de Respuesta Directa --
    if tipo_pregunta == "direct" and subtipo:
        if subtipo.startswith("definicion_"):
            inicio = time.time()
            respuesta_final = DirectAnswerBuilder.build_answer(subtipo, datos_usuario or {})
            tiempo_ms = round((time.time() - inicio) * 1000, 2)
            tipo_respuesta = "direct"
        elif datos_encontrados:
            inicio = time.time()
            respuesta_directa = DirectAnswerBuilder.build_answer(subtipo, datos_usuario)
            tiempo_ms = round((time.time() - inicio) * 1000, 2)
            
            # Validar si la respuesta directa es útil
            negaciones = ["No tienes", "Sin comentarios", "No se pudo", "No cuentas"]
            if any(n in respuesta_directa for n in negaciones):
                tipo_pregunta = "complex" # Fallback a LLM
            else:
                respuesta_final = respuesta_directa
                tipo_respuesta = "direct"
        else:
            tipo_pregunta = "complex"

    # -- Uso de Grok (LLM) --
    if tipo_pregunta == "complex" or respuesta_final is None:
        # Construcción de Contextos
        if tipo_usuario == "profesor":
            contexto_academico = _construir_contexto_profesor(datos_usuario or {})
        else:
            contexto_academico = _construir_contexto_alumno(datos_usuario or {})
        
        contexto_rag = _buscar_contexto_cached(texto_usuario, tipo_usuario)
        
        prompt_sistema = PROMPT_SISTEMA_BASE.format(
            tipo_usuario_upper=tipo_usuario.upper(),
            contexto_academico=contexto_academico,
            contexto_rag=contexto_rag,
        )

        logging.info("Consultando a Grok...")
        # Llamada a la función sync que usa la API
        respuesta_llm, tiempo_ms = await asyncio.get_event_loop().run_in_executor(
            executor, _generar_respuesta_sync, prompt_sistema, texto_usuario
        )

        if not respuesta_llm:
            respuesta_final = "Hubo un problema de conexión con el asistente."
        else:
            respuesta_limpia = _limpiar_respuesta(respuesta_llm)
            respuesta_final = respuesta_limpia if _validar_respuesta(respuesta_limpia) else respuesta_llm
            tipo_respuesta = "llm"

    # 5. Guardar en Caché (si aplica)
    if respuesta_final and tipo_respuesta == "direct":
        with cache_respuestas_lock:
            cache_respuestas[cache_key] = respuesta_final

    return {
        "response": respuesta_final,
        "tiempo_ms": tiempo_ms,
        "tipo_respuesta": tipo_respuesta,
        "from_cache": False,
    }


async def queue_worker():
    """Worker que procesa peticiones de la cola secuencialmente."""
    logging.info("Queue worker iniciado")
    while True:
        request: QueueRequest = await message_queue.get()
        
        with queue_stats_lock:
            queue_stats["processing"] = True
            queue_stats["current_queue_size"] = message_queue.qsize()
        
        try:
            # Timeout interno por seguridad
            resultado = await asyncio.wait_for(_process_single_request(request.pregunta), timeout=60.0)
            request.future.set_result(resultado)
            with queue_stats_lock:
                queue_stats["total_processed"] += 1
            
        except Exception as e:
            logging.error(f"Error worker request {request.request_id}: {e}")
            request.future.set_exception(e)
            with queue_stats_lock:
                queue_stats["total_errors"] += 1
        
        finally:
            message_queue.task_done()
            with queue_stats_lock:
                queue_stats["processing"] = False
                queue_stats["current_queue_size"] = message_queue.qsize()


@lru_cache(maxsize=100)
def _obtener_datos_usuario_cached(id_usuario: str, tipo_usuario: str) -> Optional[Dict]:
    """Obtiene datos de usuario con caché."""
    with cache_usuarios_lock:
        cache_key = f"{tipo_usuario}:{id_usuario}"
        if cache_key in cache_usuarios:
            return cache_usuarios[cache_key]
        
        if tipo_usuario.lower() == "alumno":
            datos = obtener_datos_usuario(id_usuario)
        elif tipo_usuario.lower() == "profesor":
            datos = obtener_datos_profesor(id_usuario)
        else:
            datos = None
            
        if datos:
            cache_usuarios[cache_key] = datos
            return datos
        return None


# ============================================================================ 
# FASTAPI APP Y ENDPOINTS
# ============================================================================ 
app = FastAPI(title="Agente SAES-R (Grok Edition)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    global message_queue
    message_queue = asyncio.Queue()
    asyncio.create_task(queue_worker())
    logging.info("🚀 Sistema iniciado (Modo: API Grok)")


@app.on_event("shutdown")
async def shutdown_event():
    logging.info("🛑 Cerrando sistema")


@app.post("/generate/")
async def responder(pregunta: Pregunta):
    """Endpoint principal."""
    request_id = str(uuid.uuid4())
    
    # Quick Cache Check antes de encolar
    texto_usuario = pregunta.query
    id_usuario = pregunta.id_usuario
    tipo_usuario = pregunta.tipo_usuario.lower()
    
    cache_key = hashlib.sha256(f"{tipo_usuario}:{id_usuario}:{texto_usuario}".encode("utf-8")).hexdigest()
    with cache_respuestas_lock:
        if cache_key in cache_respuestas:
            return {
                "response": cache_respuestas[cache_key],
                "tiempo_ms": 0,
                "tipo_respuesta": "cached",
                "from_cache": True,
                "request_id": request_id,
            }

    # Encolar
    future = asyncio.Future()
    queue_request = QueueRequest(
        request_id=request_id,
        pregunta=pregunta,
        future=future,
        timestamp=time.time()
    )
    
    await message_queue.put(queue_request)
    
    # Esperar resultado
    try:
        resultado = await asyncio.wait_for(future, timeout=120.0)
        resultado["request_id"] = request_id
        return resultado
    except asyncio.TimeoutError:
        return {"response": "Tiempo de espera agotado.", "error": "timeout", "request_id": request_id}
    except Exception as e:
        return {"response": "Error interno.", "error": str(e), "request_id": request_id}


@app.get("/queue/status")
async def get_queue_status():
    with queue_stats_lock:
        return {
            "queue_size": message_queue.qsize() if message_queue else 0,
            "processing": queue_stats["processing"],
            "total_processed": queue_stats["total_processed"],
            "total_errors": queue_stats["total_errors"],
        }

@app.post("/cache/clear")
async def clear_cache():
    with cache_usuarios_lock:
        cache_usuarios.clear()
    with cache_respuestas_lock:
        cache_respuestas.clear()
    _obtener_datos_usuario_cached.cache_clear()
    _buscar_contexto_cached.cache_clear()
    return {"message": "Cachés limpiados."}
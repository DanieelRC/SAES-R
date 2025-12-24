# Guía de Ejecución con Docker (Versión Grok API)

Este proyecto ha sido optimizado para ejecutarse en Docker utilizando la API de Grok (xAI), eliminando la necesidad de compilación pesada de modelos locales.

## Prerrequisitos

* Docker y Docker Compose (opcional) instalados.
* Una API Key de Grok (xAI).
* Acceso a la base de datos MySQL (local o remota).

## Construcción de la Imagen

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker build -t agente-saes-grok .
```

## Ejecución del Contenedor

Para ejecutar el contenedor, necesitas pasar las variables de entorno necesarias, especialmente `XAI_API_KEY` y las credenciales de la base de datos.

### Opción 1: Ejecución Directa

Si tu base de datos está en tu máquina local (host), usa `host.docker.internal` como `DB_HOST` (en Windows/Mac). En Linux, usa la IP de tu interfaz `docker0` o `--network="host"`.

```bash
docker run -d \
  -p 8000:8000 \
  -e XAI_API_KEY="tu_api_key_aqui" \
  -e DB_HOST="host.docker.internal" \
  -e DB_USER="root" \
  -e DB_PASSWORD="tu_password" \
  -e DB_NAME="SAES" \
  --name agente-saes \
  agente-saes-grok
```

### Opción 2: Usando un archivo .env

Puedes crear un archivo `.env.docker` con tus variables y pasarlo:

```bash
docker run -d --env-file .env.docker -p 8000:8000 --name agente-saes agente-saes-grok
```

## Notas Importantes

1. **Dependencias**: Se eliminó `llama-cpp-python` ya que el procesamiento pesado ahora se hace vía API.
2. **Base de Datos**: Asegúrate de que el contenedor pueda ver tu base de datos. `localhost` dentro del contenedor NO es tu máquina local.
3. **Volúmenes**: Si necesitas persistir logs o actualizar los archivos de reglamento (JSON/Index) sin reconstruir, considera montar el directorio:
   `-v $(pwd):/app`

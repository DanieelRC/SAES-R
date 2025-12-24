import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RegistrarAlumnos.css";
import { AdminSidebar } from "./AdminSidebar";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";


export function RegistrarAlumnos() {
    const navigate = useNavigate();
    
    const [id, setId] = useState("");
    const [nombre, setNombre] = useState("")
    const [apellido_p, setApellido_p] = useState("")
    const [apellido_m, setApellido_m] = useState("")
    const [fecha_nacimiento, setFecha_nacimiento] = useState("")
    const [tipo_sangre, setTipo_sangre] = useState("")
    const [CURP, setCURP] = useState("")
    const [nacionalidad, setNacionalidad] = useState("")
    const [calle, setCalle] = useState("")
    const [numero_ex, setNumero_ex] = useState("")
    const [numero_in, setNumero_in] = useState("")
    const [codigo_postal, setCodigo_postal] = useState("")
    const [colonia, setColonia] = useState("")
    const [delegacion, setDelegacion] = useState("")
    const [ciudad, setCiudad] = useState("")
    const [telefono, setTelefono] = useState("")
    const [correo, setCorreo] = useState("")
    const [creditos_disponibles, setCreditos_disponibles] = useState(0)
    const [foto, setFoto] = useState(null);
    const [error2, setError2] = useState(false);
    const [carreras, setCarreras] = useState([]);
    const [carreraSeleccionada, setCarreraSeleccionada] = useState("");
    const [estado, setEstado] = useState("Activo");

    // Hook para alertas modales
    const { alertState, showAlert, hideAlert } = useAlert();

    useEffect(() => {
        fetch("/api1/ObtenerCarreras", { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                setCarreras(data.carreras || []);
            })
            .catch((err) => console.error("Error al obtener las carreras:", err));
    }, []);

   

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            nombre === "" || apellido_p === "" || apellido_m === "" || fecha_nacimiento === "" ||
            tipo_sangre === "" || CURP === "" || nacionalidad === "" || calle === "" ||
            numero_ex === "" || codigo_postal === "" || colonia === "" || delegacion === "" ||
            ciudad === "" || telefono === "" || correo === "" || carreraSeleccionada === ""
        ) {
            showAlert("Por favor, complete todos los campos obligatorios.", "warning");
            return;
        }

        const res = await fetch("/api1/RegistrarAlumno", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id, nombre, apellido_p, apellido_m, fecha_nacimiento, tipo_sangre,
                CURP, nacionalidad, calle, numero_ex, numero_in, codigo_postal,
                colonia, delegacion, ciudad, telefono, correo, carreraSeleccionada,
                fotoBase64: foto || null
            }),
        });

        const text = await res.text();
        try {
            const data = JSON.parse(text);
            if (data.success) {
                showAlert("Alumno registrado correctamente", "success");

                navigate(`../administrador/gestionarAlumnos`)         
               } else {
                setError2(true);
            }
        } catch (error) {
            console.error("Respuesta no válida: ", error);
        }
    };

    return (
        <div className="admin-container">
            <AdminSidebar />
            
            <main className="main-content">
                
                <section className="gestion-alumnos">
                    
                    <div className="header-section">
                        <h1>Gestión de Alumnos</h1>
                        <div className="search-container">
                            <input 
                                type="text" 
                                placeholder="Buscar alumnos..." 
                                className="search-input"
                            />
                        </div>
                    </div>

                    

                    {/* Formulario principal */}
                    <div className="form-container">
                        <h2>Registrar Nuevo Alumno</h2>
                        <p className="form-subtitle">
                            Ingrese los detalles del alumno en el formulario.
                        </p>

                        <form className="formulario" onSubmit={handleSubmit}>
                            <div className="form-grid">
                                
                                <div className="form-section">
                                    <h3>Información Personal</h3>
                                    <div className="form-group">
                                        <label>Nombre completo *</label>
                                        <input 
                                            type="text" 
                                            value={nombre} 
                                            onChange={(e) => setNombre(e.target.value)}
                                            placeholder="Ej: Ana García López"
                                        />
                                    </div>
                                    
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Apellido Paterno *</label>
                                            <input 
                                                type="text" 
                                                value={apellido_p} 
                                                onChange={(e) => setApellido_p(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Apellido Materno *</label>
                                            <input 
                                                type="text" 
                                                value={apellido_m} 
                                                onChange={(e) => setApellido_m(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Fecha de Nacimiento *</label>
                                            <input 
                                                type="date" 
                                                value={fecha_nacimiento} 
                                                onChange={(e) => setFecha_nacimiento(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Tipo de Sangre *</label>
                                            <input 
                                                type="text" 
                                                value={tipo_sangre} 
                                                onChange={(e) => setTipo_sangre(e.target.value)}
                                                placeholder="Ej: O+"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>CURP *</label>
                                            <input 
                                                type="text" 
                                                value={CURP} 
                                                onChange={(e) => setCURP(e.target.value)}
                                                placeholder="Ej: GALA010101MDFRZN00"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Nacionalidad *</label>
                                            <input 
                                                type="text" 
                                                value={nacionalidad} 
                                                onChange={(e) => setNacionalidad(e.target.value)}
                                                placeholder="Ej: Mexicana"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Foto (opcional)</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files && e.target.files[0];
                                                if (!file) { setFoto(null); return; }
                                                const reader = new FileReader();
                                                reader.onload = () => {
                                                    setFoto(typeof reader.result === 'string' ? reader.result : null);
                                                };
                                                reader.readAsDataURL(file);
                                            }}
                                        />
                                        {foto && (
                                            <div style={{ marginTop: 8 }}>
                                                <img src={foto} alt="Previsualización" style={{ maxWidth: 180, borderRadius: 6, border: '1px solid #ddd' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Dirección */}
                                <div className="form-section">
                                    <h3>Dirección</h3>
                                    <div className="form-group">
                                        <label>Calle *</label>
                                        <input 
                                            type="text" 
                                            value={calle} 
                                            onChange={(e) => setCalle(e.target.value)}
                                        />
                                    </div>
                                    
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Número Exterior *</label>
                                            <input 
                                                type="text" 
                                                value={numero_ex} 
                                                onChange={(e) => setNumero_ex(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Número Interior</label>
                                            <input 
                                                type="text" 
                                                value={numero_in} 
                                                onChange={(e) => setNumero_in(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Código Postal *</label>
                                            <input 
                                                type="text" 
                                                value={codigo_postal} 
                                                onChange={(e) => setCodigo_postal(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Colonia *</label>
                                            <input 
                                                type="text" 
                                                value={colonia} 
                                                onChange={(e) => setColonia(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Delegación *</label>
                                            <input 
                                                type="text" 
                                                value={delegacion} 
                                                onChange={(e) => setDelegacion(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Ciudad *</label>
                                            <input 
                                                type="text" 
                                                value={ciudad} 
                                                onChange={(e) => setCiudad(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Información Académica */}
                                <div className="form-section">
                                    <h3>Información Académica</h3>
                                    <div className="form-group">
                                        <label>Carrera *</label>
                                        <select
                                            value={carreraSeleccionada}
                                            onChange={(e) => setCarreraSeleccionada(e.target.value)}
                                            className="carrera-select"
                                        >
                                            <option value="">Seleccione una carrera</option>
                                            {Array.isArray(carreras) &&
                                                carreras.map((c) => (
                                                    <option key={c.id || c.nombre} value={c.nombre}>
                                                        {c.nombre}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Boleta</label>
                                        <input 
                                            type="number" 
                                            value={id} 
                                            onChange={(e) => setId(parseInt(e.target.value) || 0)}
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Teléfono *</label>
                                        <input 
                                            type="text" 
                                            value={telefono} 
                                            onChange={(e) => setTelefono(e.target.value)}
                                            placeholder="Ej: +52 55 1234 5678"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Correo Electrónico *</label>
                                        <input 
                                            type="email" 
                                            value={correo} 
                                            onChange={(e) => setCorreo(e.target.value)}
                                            placeholder="correo@dominio.com"
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="form-actions">
                                <button type ="button" onClick ={() => navigate("../administrador/gestionarAlumnos")} className="btn-secondary">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn azul">
                                    Registrar Alumno
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </main>
            {/* Modal de alertas */}
            <AlertModal
                isOpen={alertState.isOpen}
                onClose={hideAlert}
                message={alertState.message}
                type={alertState.type}
            />
        </div>
    );
}
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegistrarProfesores.css";
import { AdminSidebar } from "./AdminSidebar";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";


export function RegistrarProfesores() {
    const navigate = useNavigate();

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
    const [foto, setFoto] = useState(null)
    const [RFC, setRFC] = useState("")
    const [grado, setGrado] = useState("")
    const [error2, setError2] = useState(false)

    // Hook para alertas modales
    const { alertState, showAlert, hideAlert } = useAlert();

    const handleClickAlu = () => navigate("../administrador/gestionarAlumnos");
    const handleClickProf = () => navigate("../administrador/gestionarProfesores");
    const handleClickCursos = () => navigate("../administrador/gestionarCursos");
    const handleLogout = () => {navigate(`/`);};

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (nombre === "" || apellido_p === "" || apellido_m === "" || fecha_nacimiento === "" || tipo_sangre === "" || CURP === "" || nacionalidad === "" || calle === "" || numero_ex === "" || numero_in === "" || codigo_postal === "" || colonia === "" || delegacion === "" || ciudad === "" || telefono === "" || correo === "" || RFC === "" || grado === "") {
            showAlert("Por favor, complete todos los campos.", "warning");
            return;
        }

        const res = await fetch("/api1/RegistrarProfesor", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                nombre, 
                apellido_p, 
                apellido_m, 
                fecha_nacimiento, 
                tipo_sangre, 
                CURP, 
                nacionalidad, 
                calle, 
                numero_ex, 
                numero_in, 
                codigo_postal, 
                colonia, 
                delegacion, 
                ciudad, 
                telefono, 
                correo, 
                RFC, 
                grado,
                fotoBase64: foto || null
            }),
        });
         if (res.ok) {
            showAlert("Profesor registrado correctamente", "success");
            navigate(`../administrador/gestionarProfesores`)
        } else {
            const error = await res.text();
            showAlert("Error: " + error, "error");
    }
}

    return (
        <div className="admin-container">
            <AdminSidebar />
            {/* Contenido principal */}
            <main className="main-content">
                <section className="gestion-profesores">
                    {/* Header con título y búsqueda */}
                    <div className="header-section">
                        <h1>Gestión de Profesores</h1>
                        <div className="search-container">
                            <input 
                                type="text" 
                                placeholder="Buscar profesores..." 
                                className="search-input"
                            />
                        </div>
                    </div>

                    

                    {/* Formulario principal */}
                    <div className="form-container">
                        <h2>Registrar Nuevo Profesor</h2>
                        <p className="form-subtitle">
                            Ingrese los detalles del profesor y la contraseña inicial para la cuenta.
                        </p>

                        <form className="formulario" onSubmit={handleSubmit}>
                            <div className="form-grid">
                                {/* Información Personal */}
                                <div className="form-section">
                                    <h3>Información Personal</h3>
                                    <div className="form-group">
                                        <label>Nombre completo *</label>
                                        <input 
                                            type="text" 
                                            value={nombre} 
                                            onChange={(e) => setNombre(e.target.value)}
                                            placeholder="Ej: Dr. Alfonso Reyes"
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
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Nacionalidad *</label>
                                            <input 
                                                type="text" 
                                                value={nacionalidad} 
                                                onChange={(e) => setNacionalidad(e.target.value)}
                                            />
                                        </div>
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
                                            <label>Número Interior *</label>
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

                                {/* Información Profesional */}
                                <div className="form-section">
                                    <h3>Información Profesional</h3>
                                    <div className="form-group">
                                        <label>RFC *</label>
                                        <input 
                                            type="text" 
                                            value={RFC} 
                                            onChange={(e) => setRFC(e.target.value)}
                                            placeholder="Ej: REYA870101ABC"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Grado académico *</label>
                                        <input 
                                            type="text" 
                                            value={grado} 
                                            onChange={(e) => setGrado(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Teléfono (opcional)</label>
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
                                        />
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
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn azul">
                                    Registrar Profesor
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
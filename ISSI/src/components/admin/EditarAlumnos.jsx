import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditarAlumnos.css";
import { AdminSidebar } from "./AdminSidebar";
import { AlertModal } from "../shared/AlertModal";
import { useAlert } from "../../hooks/useAlert";


export function EditarAlumnos() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Hook para alertas modales
    const { alertState, showAlert, hideAlert } = useAlert();

    const [alumno, setAlumno] = useState({
        nombre: "",
        ape_paterno: "",
        ape_materno: "",
        fecha_nacimiento: "",
        tipo_sangre: "",
        CURP: "",
        nacionalidad: "",
        calle: "",
        num_exterior: "",
        num_interior: "",
        codigo_postal: "",
        colonia: "",
        delegacion: "",
        ciudad: "",
        telefono: "",
        email: "",
        carrera: ""
    });

    const [carreras, setCarreras] = useState([]);
    const [fotoBase64, setFotoBase64] = useState(null);

    useEffect(() => {
        fetch(`/api1/ObtenerAlumno/${id}`, { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                if (data.alumno) setAlumno(data.alumno);
            })
            .catch(err => console.error("Error al obtener el alumno:", err));
    }, [id]);

    useEffect(() => {
        fetch("/api1/ObtenerCarreras")
            .then(res => res.json())
            .then(data => setCarreras(data.carreras || []))
            .catch(err => console.error("Error al obtener las carreras:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAlumno(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { ...alumno };
        if (fotoBase64) payload.fotoBase64 = fotoBase64;

        fetch(`/api1/EditarAlumno/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    showAlert("Alumno editado con éxito", "success");
                    setTimeout(() => {
                        navigate("/administrador/gestionarAlumnos");
                    }, 3000);
                } else {
                    showAlert("Error al editar el alumno", "error");
                }
            })
            .catch(err => console.error("Error al editar el alumno:", err));
    };

    const handleFotoChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;
            setFotoBase64(typeof result === "string" ? result : null);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="admin-container">
            <AdminSidebar />
             <main className="main-content">
        <header className="chat-header">
          <div className="encabezado-section">
            <h1>Editar alumnO</h1>
          </div>
          <img src="/escom.png" alt="Logo SCOM" className="header-logo" />
        </header>
        <section className="ea-wrap">
            

            <form className="formulario ea-card" onSubmit={handleSubmit}>
                <label>Nombre:</label>
                <input type="text" name="nombre" value={alumno.nombre} onChange={handleChange} />

                <label>Apellido Paterno:</label>
                <input type="text" name="ape_paterno" value={alumno.ape_paterno} onChange={handleChange} />

                <label>Apellido Materno:</label>
                <input type="text" name="ape_materno" value={alumno.ape_materno} onChange={handleChange} />

                <label>Fecha de Nacimiento:</label>
                <input type="date" name="fecha_nacimiento" value={alumno.fecha_nacimiento} onChange={handleChange} />

                <label>Tipo de Sangre:</label>
                <input type="text" name="tipo_sangre" value={alumno.tipo_sangre} onChange={handleChange} />

                <label>CURP:</label>
                <input type="text" name="CURP" value={alumno.CURP} onChange={handleChange} />

                <label>Nacionalidad:</label>
                <input type="text" name="nacionalidad" value={alumno.nacionalidad} onChange={handleChange} />

                <label>Calle:</label>
                <input type="text" name="calle" value={alumno.calle} onChange={handleChange} />

                <label>Número Exterior:</label>
                <input type="text" name="num_exterior" value={alumno.num_exterior} onChange={handleChange} />

                <label>Número Interior:</label>
                <input type="text" name="num_interior" value={alumno.num_interior} onChange={handleChange} />

                <label>Código Postal:</label>
                <input type="text" name="codigo_postal" value={alumno.codigo_postal} onChange={handleChange} />

                <label>Colonia:</label>
                <input type="text" name="colonia" value={alumno.colonia} onChange={handleChange} />

                <label>Delegación:</label>
                <input type="text" name="delegacion" value={alumno.delegacion} onChange={handleChange} />

                <label>Ciudad:</label>
                <input type="text" name="ciudad" value={alumno.ciudad} onChange={handleChange} />

                <label>Teléfono:</label>
                <input type="text" name="telefono" value={alumno.telefono} onChange={handleChange} />

                <label>Correo Electrónico:</label>
                <input type="email" name="email" value={alumno.email} onChange={handleChange} />

                <label>Carrera:</label>
                <select name="carrera" value={alumno.carrera || ""} onChange={handleChange}>
                    <option value="">Seleccione una carrera</option>
                    {carreras.map((c) => (
                        <option key={c.nombre} value={c.nombre}>
                            {c.nombre}
                        </option>
                    ))}
                </select>

                <label>Foto (opcional):</label>
                <input type="file" accept="image/*" onChange={handleFotoChange} />

                {fotoBase64 && (
                    <div className="ea-photo-preview">
                        <img src={fotoBase64} alt="Previsualización" />
                    </div>
                )}
                <div>   
                <button className="btn azul" type="submit">
                    Guardar cambios
                </button>
                </div>
            </form>
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

import "./Formulario.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function Formulario() {
    const [id, setId] = useState(""); // Cambiado de 'usuario' a 'id'
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // Para mensajes de error del backend
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (id === "" || contrasena === "") {
            setError(true);
            setErrorMessage("Todos los campos son obligatorios");
            return;
        }

        setError(false);
        setErrorMessage("");

        const result = await login(id, contrasena, true);

        if (result.success) {
            // Navegar según el tipo de usuario
            const tip = result.user.tipo_usuario;
            const userId = result.user.id;
            
            if (tip === "alumno") {
                navigate(`/alumno/${userId}`);
            } else if (tip === "profesor") {
                navigate(`/profesor/${userId}`);
            } else if (tip === "administrador") {
                navigate("/administrador");
            }
        } else {
            setErrorMessage(result.message || "Usuario o contraseña incorrectos");
        }
    };

    return (
        <div className="login-layout">
            <aside className="brand-left">
                <img src="/ipn.png" alt="IPN" />
            </aside>

            <main className="login-card">
                <header className="center">
                    <h1>Iniciar sesión</h1>
                    <p className="muted">Accede con tu usuario y contraseña</p>
                </header>

                <form className="form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="id">Usuario</label> {/* Cambiado de 'usuario' a 'id' */}
                        <input
                            id="id"
                            type="text"
                            placeholder="Escribe tu ID"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contrasena">Contraseña</label>
                        <input
                            id="contrasena"
                            type="password"
                            placeholder="••••••••"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            autoComplete="current-password"
                        />
                    </div>

                    {(error || errorMessage) && (
                        <p className="alert alert-error">{errorMessage}</p>
                    )}

                    <button type="submit" className="btn">
                        Entrar
                    </button>

                    <div className="recover-link">
                        <Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
                    </div>
                </form>
            </main>

            <aside className="brand-right">
                <img src="/escom.png" alt="ESCOM" />
            </aside>
        </div>
    );
}
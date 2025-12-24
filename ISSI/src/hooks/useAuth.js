import { useState, useEffect, createContext, useContext } from 'react';

// Crear contexto de autenticación
const AuthContext = createContext(null);

/**
 * Proveedor de autenticación para la aplicación
 * Envuelve la aplicación y proporciona estado de autenticación global
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    const API = '/api1';

    /**
     * Verificar el estado de la sesión actual
     */
    const checkSession = async () => {
        try {
            const res = await fetch(`${API}/session/check`, {
                credentials: 'include',
            });

            if (res.ok) {
                const data = await res.json();
                if (data.authenticated) {
                    setUser(data.user);
                    setAuthenticated(true);
                } else {
                    setUser(null);
                    setAuthenticated(false);
                }
            } else {
                setUser(null);
                setAuthenticated(false);
            }
        } catch (error) {
            console.error('Error al verificar sesión:', error);
            setUser(null);
            setAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Iniciar sesión de usuario
     */
    const login = async (id, contrasena, remember = true) => {
        try {
            const res = await fetch(`${API}/IniciarSesion`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, contrasena, remember }),
            });

            const data = await res.json();

            if (data.success) {
                setUser({
                    id: data.id,
                    tipo_usuario: data.tipo_usuario,
                });
                setAuthenticated(true);
                return { success: true, user: data };
            } else {
                return { success: false, message: data.message || 'Error al iniciar sesión' };
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            return { success: false, message: 'Error al conectar con el servidor' };
        }
    };

    /**
     * Cerrar sesión del usuario
     */
    const logout = async () => {
        try {
            await fetch(`${API}/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        } finally {
            setUser(null);
            setAuthenticated(false);
        }
    };

    // Verificar sesión al montar el componente
    useEffect(() => {
        checkSession();
    }, []);

    // Verificar sesión periódicamente (cada 5 minutos)
    useEffect(() => {
        if (authenticated) {
            const interval = setInterval(() => {
                checkSession();
            }, 5 * 60 * 1000); // 5 minutos

            return () => clearInterval(interval);
        }
    }, [authenticated]);

    const value = {
        user,
        authenticated,
        loading,
        login,
        logout,
        checkSession,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar el contexto de autenticación
 */
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
}

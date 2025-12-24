import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props - Props del componente
 * @param {React.ReactNode} props.children - Contenido a renderizar si está autenticado
 * @param {Array<string>} props.allowedRoles - Roles permitidos para acceder a esta ruta
 * @param {string} props.redirectTo - Ruta a la que redirigir si no está autenticado
 */
export function ProtectedRoute({ children, allowedRoles = [], redirectTo = '/' }) {
  const { user, authenticated, loading } = useAuth();

  // Mostrar un loader mientras se verifica la sesión
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Verificando sesión...
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!authenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si se especificaron roles permitidos, verificar que el usuario tenga uno de ellos
  if (allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.tipo_usuario)) {
      // Usuario autenticado pero sin el rol correcto
      return <Navigate to="/error" replace />;
    }
  }

  // Usuario autenticado y con el rol correcto
  return children;
}

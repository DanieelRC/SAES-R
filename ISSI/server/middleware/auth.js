/**
 * Middleware de autenticación centralizado
 * Proporciona funciones para proteger rutas y verificar roles de usuario
 */

/**
 * Middleware para verificar que el usuario esté autenticado
 * @param {Object} req - Request de Express
 * @param {Object} res - Response de Express
 * @param {Function} next - Next middleware
 */
function requireAuth(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({
        error: "No autenticado",
        message: "Debes iniciar sesión para acceder a este recurso"
    });
}

/**
 * Middleware para verificar que el usuario tenga uno de los roles permitidos
 * @param {Array<string>} roles - Array de roles permitidos (ej: ['alumno', 'profesor'])
 * @returns {Function} Middleware de Express
 */
function requireRole(roles) {
    return (req, res, next) => {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            return res.status(401).json({
                error: "No autenticado",
                message: "Debes iniciar sesión para acceder a este recurso"
            });
        }

        const userRole = req.user.tipo_usuario;

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                error: "Acceso denegado",
                message: `No tienes permisos para acceder a este recurso. Rol requerido: ${roles.join(' o ')}`
            });
        }

        return next();
    };
}

/**
 * Middleware para verificar que el usuario solo acceda a sus propios datos
 * @param {string} paramName - Nombre del parámetro en la ruta (ej: 'id')
 * @returns {Function} Middleware de Express
 */
function requireSelf(paramName = 'id') {
    return (req, res, next) => {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            return res.status(401).json({
                error: "No autenticado",
                message: "Debes iniciar sesión para acceder a este recurso"
            });
        }

        const requestedId = req.params[paramName];
        const userId = req.user.id;

        // Permitir acceso si es el mismo usuario o si es administrador
        if (requestedId === userId || req.user.tipo_usuario === 'administrador') {
            return next();
        }

        return res.status(403).json({
            error: "Acceso denegado",
            message: "No tienes permisos para acceder a los datos de otro usuario"
        });
    };
}

/**
 * Middleware combinado: requiere autenticación y rol específico
 * Útil para rutas que necesitan ambas verificaciones
 * @param {Array<string>} roles - Array de roles permitidos
 * @returns {Array<Function>} Array de middlewares
 */
function requireAuthAndRole(roles) {
    return [requireAuth, requireRole(roles)];
}

module.exports = {
    requireAuth,
    requireRole,
    requireSelf,
    requireAuthAndRole
};

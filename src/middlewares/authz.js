class AuthzMiddleware {
    authorize(reqRoles) {
        return (req, res, next) => {
            if (!req.session || !req.session.user) {
                console.log('User not authenticated');
                req.flash('error', 'Por favor, inicia sesión primero.');
                return res.redirect('/login');
            }

            if (reqRoles.length === 0) {
                return next();
            }

            const userRoles = req.session.user.roles.map(role => role.name);
            console.log('User roles:', userRoles);
            console.log('Required roles:', reqRoles);

            const hasRequiredRole = reqRoles.some(reqRole => userRoles.includes(reqRole));
            if (hasRequiredRole) {
                console.log('Authorization successful');
                return next();
            } else {
                console.log('Access denied for roles:', reqRoles);
                req.flash('error', 'Acceso denegado');
                return res.redirect('/');
            }
        };
    }

    getRouter(roles, routeName) {
        return [this.authorize(roles), (req, res, next) => {
            console.log(`Accessing ${routeName} route`);
            next();
        }];
    }

    // Otros métodos para otras rutas...
}
export default AuthzMiddleware;

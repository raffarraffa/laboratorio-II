import express from "express";
//import AutzController from "../controllers/autz.js";
import { Utils } from "../utils/utils.js";

class AuthzMiddleware {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
        Utils.debug(this.class);
    }
    initRoute() {



    }
    authorize(reqRoles, ruta) {
        return (req, res, next) => {
            let existe = false;
            if (!req.session || !req.session.user) {
                console.log('User not authenticated');
                req.flash('error', 'Por favor, inicia sesión primero.');
                return res.redirect('/login');
            }

            if (reqRoles.length === 0) {
                console.log('No specific roles required. Allowing access.');
                return next(); // Permitir acceso si no hay roles específicos requeridos
            }

            // Obtener los nombres de los roles del usuario
            const userRoles = req.session.user.roles.map(role => role.name);
            console.log(reqRoles);
            console.log('+++++++++++++*****+++++++++++++++++++++++');
            console.log(ruta);
            console.log('++++++++++++++++++++++++++++++++++++');
            reqRoles.forEach(element => {
                console.log('++++++++++++++++++++++++++++++++++++');
                console.log(element);
                console.log(userRoles.includes(element));
                if (userRoles.includes(element)) {
                    existe = true;
                }
            });
            console.log('*************************************************');
            console.log(existe);

            if (existe) {
                console.log('User has required role. Allowing access.');
                return next(); // Continuar si el usuario tiene el rol requerido
            } else {
                console.log('Access denied for roles:', reqRoles);
                req.flash('error', 'Acceso denegadoccc');
                return res.redirect('/'); // Redirigir si el usuario no tiene el rol requerido
            }
        };
    }


    authorize3(reqRoles) {
        return (req, res, next) => {
            if (!req.session || !req.session.user) {
                // Redirigir si el usuario no está autenticado
                console.log('User not authenticated');
                req.flash('error', 'Por favor, inicia sesión primero.');
                return res.redirect('/login');
            }

            if (reqRoles.length === 0) {
                // Permitir acceso si no hay roles específicos requeridos
                return next();
            }
            const userRoles = req.session.user.roles.map(role => role.name);
            const hasReqRole = reqRoles.some(role => userRoles.includes(role));


            console.log('*********************************************');
            console.log(userRoles);
            console.log(reqRoles);
            console.log(hasReqRole);

            //    const hasRequiredRole = reqRoles.some(reqRole => userRoles.some(userRole => userRole.name == reqRole));
            if (hasReqRole) {
                return next();
            } else {
                console.log('Access denied for roles:', reqRoles);
                req.flash('error', 'Acceso denegado');
                return res.redirect('/'); // Asegúrate de usar 'return' para evitar ejecutar código después del redireccionamiento
            }
        };
    }



    authorize2(reqRoles) {
        return (req, res, next) => {
            if (reqRoles.length === 0) {
                // Si no se especifican roles permitidos, permitir acceso a todos
                return next();
            }
            const userRoles = req.session.user.roles;
            const existReqRole = reqRoles.some(role => userRoles.some(userRole => userRole.name === role));
            if (existReqRole) {
                return next();
            } else {
                req.flash('error', 'Acceso denegado');
                return res.redirect('/');
            }

        };
    }
    getRouter(reqRoles, ruta) {
        console.log('*********************************************');
        console.log('*********************************************');
        console.log('*********************************************');
        console.log('*********************************************');
        console.log(ruta);
        console.log('*********************************************');
        console.log('*********************************************');

        this.router.use(this.authorize(reqRoles, ruta));
        return this.router;
    }
}

export default AuthzMiddleware;
/*
req.session.user = {
                            userId: user.id,
                            roles: user.profiles,
                            firstName: user.first_name,
                            lastname: user.last_name
                        };
*/
/*
 getRouter(allowedRoles = []) {
        return (req, res, next) => {
            if (allowedRoles.length === 0) {
                // Si no se especifican roles permitidos, permitir acceso a todos
                return next();
            }

            const userRole = req.user.role; // Suponiendo que el rol del usuario esté disponible en req.user.role

            if (allowedRoles.includes(userRole)) {
                next();
            } else {
                res.status(403).send('Acceso denegado.');
            }
        };
    }
*/

/*
 authorize(allowedRoles) {
        return (req, res, next) => {
            const userRole = req.user.role; // Asumiendo que el rol del usuario está en req.user.role
            if (allowedRoles.includes(userRole)) {
                next();
            } else {
                res.status(403).json({ message: "Forbidden" });
            }
        };
    }

    getRouter(allowedRoles) {
        const router = express.Router();
        router.use(this.authorize(allowedRoles));
        return router;
    }
*/
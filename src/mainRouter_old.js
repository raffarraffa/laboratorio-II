import express from "express";
import UserRoute from "./routes/user.js";
import PatientRoute from "./routes/patient.js";
// ... otros imports ...

class MainRouter {
    constructor(dataBase) {
        this.router = express.Router();
        this.initFlash();
        this.initRouter();
    }

    initFlash() {
        this.router.use((req, res, next) => {
            res.locals.success = req.flash('success');
            res.locals.error = req.flash('error');
            res.locals.tempData = req.flash('tempData');
            delete req.flash('tempData');
            delete req.flash('success');
            delete req.flash('error');
            next();
        });
    }

    authorize(roles) {
        return (req, res, next) => {
            if (!req.session || !req.session.user) {
                console.log('User not authenticated');
                req.flash('error', 'Por favor, inicia sesión primero.');
                return res.redirect('/login');
            }

            const userRoles = req.session.user.roles.map(role => role.name);
            const hasRequiredRole = roles.some(role => userRoles.includes(role));

            if (hasRequiredRole) {
                next();
            } else {
                console.log('Access denied for roles:', roles);
                req.flash('error', 'Acceso denegado');
                return res.redirect('/');
            }
        };
    }

    initRouter() {
        // Instancias de routers
        const userRoute = new UserRoute();
        const patientRoute = new PatientRoute();
        // ... otras instancias de routers ...

        // Ruta logout
        this.router.get('/logout', (req, res) => {
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).send('No se pudo salir.');
                }
                res.clearCookie('sistema_lis', { path: '/' });
                res.clearCookie('authToken', { path: '/' });
                res.redirect('/');
            });
        });

        // Rutas públicas
        this.router.use(express.static('public'));
        this.router.get('/login', (req, res) => { res.render('login.pug'); });

        // Middleware de autenticación
        this.router.use('*', (req, res, next) => {
            if (req.session && req.session.user) {
                next();
            } else {
                res.redirect('/login');
            }
        });

        // Aplicar la función de autorización en las rutas
        this.router.use('/user', this.authorize(['SuperAdmin', 'Bioquimico']), userRoute.getRouter());
        this.router.use('/profile', this.authorize(['SuperAdmin', 'Bioquimico']), profileRoute.getRouter());
        this.router.use('/patient', this.authorize(['SuperAdmin', 'Bioquimico']), patientRoute.getRouter());
        this.router.use('/order', this.authorize(['SuperAdmin', 'Bioquimico']), orderRoute.getRouter());
        this.router.use('/doctor', this.authorize(['SuperAdmin', 'Bioquimico']), doctorRoute.getRouter());
        this.router.use('/diagnosis', this.authorize(['SuperAdmin', 'Bioquimico']), diagnosisRoute.getRouter());
        this.router.use('/sampleType', this.authorize(['SuperAdmin', 'Bioquimico']), sampleTypeRoute.getRouter());
        this.router.use('/sample', this.authorize(['SuperAdmin', 'Bioquimico']), sampleRoute.getRouter());
        this.router.use('/exam', this.authorize(['SuperAdmin', 'Bioquimico']), examRoute.getRouter());
        this.router.use('/studie', this.authorize(['SuperAdmin', 'Bioquimico']), studieRoute.getRouter());
        this.router.use('/determination', this.authorize(['SuperAdmin', 'Bioquimico']), determinationRoute.getRouter());
        this.router.use('/result', this.authorize(['SuperAdmin', 'Bioquimico']), resultRoute.getRouter());
        this.router.use('/referenceValue', this.authorize(['SuperAdmin', 'Bioquimico']), referenceValueRoute.getRouter());
        this.router.use('/unit', this.authorize(['SuperAdmin', 'Bioquimico']), unitRoute.getRouter());
        this.router.use('/city', this.authorize(['SuperAdmin', 'Bioquimico']), cityRoute.getRouter());
    }

    getRouter() {
        return this.router;
    }
}

export default MainRouter;

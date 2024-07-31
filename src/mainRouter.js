//mainRouter.js
import express from "express";
import UserRoute from "./routes/user.js";
import PatientRoute from "./routes/patient.js";
import OrderRoute from "./routes/order.js";
import DoctorRoute from "./routes/doctor.js";
import DiagnosisRoute from "./routes/diagnosis.js";
import SampleTypeRoute from "./routes/sampleType.js";
import SampleRoute from "./routes/sample.js";
import ExamRoute from "./routes/exam.js";
import StudieRoute from "./routes/studie.js";
import DeterminationRoute from "./routes/determination.js";
import ResultRoute from "./routes/result.js";
import ReferenceValueRoute from "./routes/referenceValue.js";
import ProfileRoute from "./routes/profile.js";
import AdminRoute from "./routes/admin.js";
import UnitRoute from "./routes/unit.js";
import CityRoute from "./routes/city.js";
/* MIDDLEWARES:  */
import AuthMiddleware from "./middlewares/auth.js";
import AuthzMiddleware from "./middlewares/authz.js";


import { Utils } from './utils/utils.js';



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
            // res.locals.error = 'prueba linea 38 mainRoute-js';
            // res.locals.success = 'prueba linea 39 mainRoute-js';
            delete req.flash('tempData');
            delete req.flash('success');
            delete req.flash('error');
            next();
        });
    }
    /**
     * Inicializa las rutas de la aplicación.
     *
     * Esta función configura las rutas públicas y protegidas de la aplicación.
     * Establece el servicio de archivos estáticos y la ruta de la página de inicio.
     * Además, configura las rutas para las rutas de usuario, perfil, paciente,
     * orden, médico, diagnóstico, tipo de muestra, muestra, examen, estudio,
     * determinación, resultado y valor de referencia.
     *
     * @return {void} Esta función no devuelve nada.
     */
    initRouter() {
        // instancia de milddlewares
        const authMiddleware = new AuthMiddleware();
        const authzMiddleware = new AuthzMiddleware();

        // instacias routers
        const userRoute = new UserRoute();
        const patientRoute = new PatientRoute();
        const cityRoute = new CityRoute();
        const profileRoute = new ProfileRoute();
        const doctorRoute = new DoctorRoute();
        const orderRoute = new OrderRoute();
        const sampleTypeRoute = new SampleTypeRoute();
        const diagnosisRoute = new DiagnosisRoute();
        const sampleRoute = new SampleRoute();
        const examRoute = new ExamRoute();
        const determinationRoute = new DeterminationRoute();
        const resultRoute = new ResultRoute();
        const studieRoute = new StudieRoute();
        const referenceValueRoute = new ReferenceValueRoute();
        const adminRoute = new AdminRoute();
        const unitRoute = new UnitRoute();

        /***  Inicializar las rutas aquí  ***/
        // ruta logout 
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

        //ruta publicas
        this.router.use(express.static('public'));
        this.router.get('/login', (req, res) => { res.render('login.pug'); });

        // middleware de autenticacion
        this.router.use('*', (req, res, next) => {
            console.log('Cookies:', req.cookies); // Muestra todas las cookies
            console.log('Signed Cookies:', req.signedCookies); // Muestra cookies firmadas
            next();
        })

        this.router.use('*', authMiddleware.getRouter());
        //    this.router.use('/logout', authMiddleware.getRouter());

        /* Rutas protegidas con autenticación y autorización */
        this.router.use("/", patientRoute.getRouter());


        this.router.use('/admin', authzMiddleware.getRouter(['SuperAdmin']), adminRoute.getRouter());

        this.router.use('/user', authzMiddleware.getRouter(['SuperAdmin', 'Bioquimico']), userRoute.getRouter());

        this.router.use('/profile', authzMiddleware.getRouter(['SuperAdmin', 'Bioquimico']), profileRoute.getRouter());

        this.router.use('/patient', authzMiddleware.getRouter(['SuperAdmin', 'Bioquimico']), patientRoute.getRouter());

        this.router.use('/order', authzMiddleware.getRouter(['SuperAdmin', 'Bioquimico']), orderRoute.getRouter());

        this.router.use('/doctor', authzMiddleware.getRouter(['SuperAdmin', 'Bioquimico']), doctorRoute.getRouter());

        this.router.use('/diagnosis', authzMiddleware.getRouter(['SuperAdmin', 'Bioquimico']), diagnosisRoute.getRouter());

        this.router.use('/sampleType', authzMiddleware.getRouter(['SuperAdmin', 'Bioquimico']), sampleTypeRoute.getRouter());

        this.router.use('/sample', authzMiddleware.getRouter(['SuperAdmin', 'Bioquimico']), sampleRoute.getRouter());

        this.router.use('/exam', authzMiddleware.getRouter(['SuperAdmin', 'Bioquimico']), examRoute.getRouter());

        this.router.use('/studie', authzMiddleware.getRouter(['SuperAdmin', 'Bioquimico']), studieRoute.getRouter());

        this.router.use('/determination', authzMiddleware.getRouter(['SuperAdmin', 'Bioquimico']), determinationRoute.getRouter());

        this.router.use('/result', authzMiddleware.getRouter(['SuperAdmin', 'Bioquimico']), resultRoute.getRouter());

        this.router.use('/referenceValue', authzMiddleware.getRouter(['SuperAdmin', 'Bioquimico']), referenceValueRoute.getRouter());

        this.router.use('/unit', authzMiddleware.getRouter(['SuperAdmin', 'Bioquimico']), unitRoute.getRouter());

        this.router.use('/city', authzMiddleware.getRouter(['SuperAdmin', 'Bioquimico']), cityRoute.getRouter());


    }

    getRouter() {
        return this.router;
    }
}

export default MainRouter;
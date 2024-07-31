import express from "express";
import AuthController from "../controllers/auth.js";
import { Utils } from "../utils/utils.js";

class AuthMiddleware {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
        Utils.debug(this.class);
    }
    initRoute() {
        const authController = new AuthController();
        // this.router.post('/', authController.verifyAuth.bind(authController));
        // this.router.get('/', authController.getAuth.bind(authController));
        // this.router.get('/logout', (req, res) => {
        //     res.send('Logout ok');
        // });
        //    this.router.get('/', authController.isAuth.bind(authController));
        this.router.get('*', authController.isAuth.bind(authController));
        this.router.post('*', authController.isAuth.bind(authController));
    }
    getRouter() {
        return this.router;
    }
}

export default AuthMiddleware;

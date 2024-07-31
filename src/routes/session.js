import express from "express";
import { Utils } from "../utils/utils.js";
//import SessionController from "../controllers/session.js";

class SessionRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
    }
    initRoute() {
        const sessionController = new SessionController();
        //this.router.get("/", (req, res) => { res.send("Hello World!"); });
        this.router.post('/sessions', (req, res) => sessionController.createSession(req, res));
        this.router.get('/sessions/:sessionId', (req, res) => sessionController.getSession(req, res));
        this.router.delete('/sessions/:sessionId', (req, res) => sessionController.deleteSession(req, res));

        // this.router.get("/", sessionController.getAll.bind(sessionController));
        // this.router.get("/:id", sessionController.getById.bind(sessionController));
        // this.router.get("/route", sessionController.Test.bind(sessionController));
        // this.router.post("/login", sessionController.logIn.bind(sessionController));
        // this.router.post("/logout", sessionController.logOut.bind(sessionController));
    }
    getRouter() {
        return this.router;
    }
}

export default SessionRoute;

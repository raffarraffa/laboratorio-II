import express from "express";
import StudieController from "../controllers/studie.js";
import { Utils } from "../utils/utils.js";

class StudieRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
        Utils.debug(this.class);
    }
    initRoute() {
        const studieController = new StudieController();
        this.router.get("/", studieController.getAll.bind(studieController));
        this.router.get("/:id", studieController.getById.bind(studieController));
        this.router.get("/route", studieController.Test.bind(studieController));
    }
    getRouter() {
        return this.router;
    }
}

export default StudieRoute;

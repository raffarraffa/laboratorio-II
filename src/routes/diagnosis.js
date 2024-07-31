import express from "express";
import DiagnosisController from "../controllers/diagnosis.js";
import { Utils } from "../utils/utils.js";

class DiagnosisRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
        Utils.debug(this.class);
    }
    initRoute() {
        const diagnosisController = new DiagnosisController();
        this.router.get("/", diagnosisController.getAll.bind(diagnosisController));
        this.router.get("/route", diagnosisController.Test.bind(diagnosisController));
        this.router.get("/search", diagnosisController.getSearch.bind(diagnosisController));
        this.router.get("/:id", diagnosisController.getById.bind(diagnosisController));
    }
    getRouter() {
        return this.router;
    }
}

export default DiagnosisRoute;

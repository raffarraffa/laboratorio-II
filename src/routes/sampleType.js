import express from "express";
import sampletypeController from "../controllers/sampleType.js";
import { Utils } from "../utils/utils.js";
import SampleTypeController from "../controllers/sampleType.js";

class SampleTypeRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
    }
    initRoute() {
        const sampletypeController = new SampleTypeController();
        //this.router.get("/", (req, res) => { res.send("Hello World!"); });
        this.router.get("/", sampletypeController.getAll.bind(sampletypeController));
        this.router.get("/:id", sampletypeController.getById.bind(sampletypeController));
        this.router.get("/route", sampletypeController.Test.bind(sampletypeController));
        this.router.post("/new", sampletypeController.createSampleType.bind(sampletypeController));
    }
    getRouter() {
        return this.router;
    }
}

export default SampleTypeRoute;

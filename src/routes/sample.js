import express from "express";
import sampleController from "../controllers/sample.js";
import { Utils } from "../utils/utils.js";
import SampleController from "../controllers/sample.js";

class SampleRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
    }
    initRoute() {
        const sampleController = new SampleController();
        //this.router.get("/", (req, res) => { res.send("Hello World!"); });
        this.router.get("/", sampleController.getAll.bind(sampleController));
        this.router.get("/:id", sampleController.getById.bind(sampleController));
        this.router.get("/route", sampleController.Test.bind(sampleController));
    }
    getRouter() {
        return this.router;
    }
}

export default SampleRoute;

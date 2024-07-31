import express from "express";
import ReferenceValueController from "../controllers/referenceValue.js";
import { Utils } from "../utils/utils.js";

class ReferenceValueRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
        Utils.debug(this.class);
    }
    initRoute() {
        const referenceValueController = new ReferenceValueController();
        this.router.get("/test", (req, res) => { res.send(`ROUTER OK  ${this.class} `); });
        this.router.get("/debug", referenceValueController.getAllDebug.bind(referenceValueController));
        this.router.get("/", referenceValueController.getAll.bind(referenceValueController));
        this.router.get("/:id", referenceValueController.getById.bind(referenceValueController));
        this.router.get("/route", referenceValueController.Test.bind(referenceValueController));
        this.router.post("/new", referenceValueController.createReferenceValue.bind(referenceValueController));
    }
    getRouter() {
        return this.router;
    }
}

export default ReferenceValueRoute;

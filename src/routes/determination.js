import express from "express";
import DeterminationController from "../controllers/determination.js";
import { Utils } from "../utils/utils.js";

class DeterminationRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
        Utils.debug(this.class);
    }
    initRoute() {
        const determinationController = new DeterminationController();
        this.router.get("/test", (req, res) => { res.send(`ROUTER OK  ${this.class} `); });
        this.router.get("/", determinationController.getAll.bind(determinationController));
        this.router.get("/:id", determinationController.getById.bind(determinationController));
        this.router.get("/route", determinationController.Test.bind(determinationController));
        this.router.post("/new", determinationController.createDetermination.bind(determinationController));
    }
    getRouter() {
        return this.router;
    }
}

export default DeterminationRoute;

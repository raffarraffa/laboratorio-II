import express from "express";
import StateController from "../controllers/state.js";
import { Utils } from "../utils/utils.js";

class StateRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
        Utils.debug(this.class);
    }
    initRoute() {
        const stateController = new StateController();
        this.router.get("/", (req, res) => { res.send("Hello World!"); });
        this.router.get("/:id", stateController.getById.bind(stateController));
        this.router.get("/route", stateController.Test.bind(stateController));
    }
    getRouter() {
        return this.router;
    }
}

export default StateRoute;

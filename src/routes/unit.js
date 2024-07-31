import express from "express";
import UnitController from "../controllers/unit.js";
import { Utils } from "../utils/utils.js";

class UnitRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
        Utils.debug(this.class);
    }
    initRoute() {
        const unitController = new UnitController();
        this.router.get("/", (req, res) => { res.send("Hello Unit!"); });
        //this.router.get("/:id", unitController.getById.bind(unitController));
        this.router.get("/route", unitController.Test.bind(unitController));
        this.router.post("/new", unitController.createUnit.bind(unitController));


    }
    getRouter() {
        return this.router;
    }
}

export default UnitRoute;

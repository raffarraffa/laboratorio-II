import express from "express";
import CityController from "../controllers/city.js";
import { Utils } from "../utils/utils.js";

class CityRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
        Utils.debug(this.class);
    }
    initRoute() {
        const cityController = new CityController();
        //this.router.get("/", (req, res) => { res.send("Hello World!"); });
        this.router.get("/", cityController.getAll.bind(cityController));
        //        this.router.get("/:id", cityController.getId.bind(cityController));
        //      this.router.get("/route", cityController.Test.bind(cityController));
    }
    getRouter() {
        return this.router;
    }
}

export default CityRoute;

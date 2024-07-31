import express from "express";
import ResultController from "../controllers/result.js";
import { Utils } from "../utils/utils.js";

class ResultRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
        Utils.debug(this.class);
    }
    initRoute() {
        const resultController = new ResultController();
        this.router.get("/test", (req, res) => { res.send(`ROUTER OK  ${this.class} `); });
        this.router.get("/", resultController.getAll.bind(resultController));
        /**
         * @param {id}  Id de la orden para vincular los resultados
         * @returns vista formulario para caragr resultados
         */
        this.router.get("/new/:id", resultController.getNew.bind(resultController));
        this.router.get("/:id", resultController.getById.bind(resultController));
        this.router.get("/route", resultController.Test.bind(resultController));
    }
    getRouter() {
        return this.router;
    }
}

export default ResultRoute;

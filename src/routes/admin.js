import express from "express";
import AdminController from "../controllers/admin.js";
import { Utils } from "../utils/utils.js";

class AdminRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
        Utils.debug(this.class);
    }
    /**
     * Enlaza el método especificado al contexto especificado.
     *
     * Esta función toma un método y un contexto como parámetros y devuelve una nueva función que, cuando se llama, ejecutará el método original con el contexto especificado.
     * @bin enlaza el contexto del controller con el controller mismo
     * @param {function} method - El método a enlazar.
     * @param {object} context - El contexto al que se enlaza el método.
     * @return {function} El método enlazado.
     */
    initRoute() {
        const adminController = new AdminController();
        this.router.get('/', adminController.getAll.bind(adminController));
    }
    getRouter() {
        return this.router;
    }
}

export default AdminRoute;

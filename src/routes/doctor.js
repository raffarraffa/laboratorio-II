import express from "express";
import doctorController from "../controllers/doctor.js";
import { Utils } from "../utils/utils.js";
import DoctorController from "../controllers/doctor.js";

class DoctorRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
    }
    initRoute() {
        const doctorController = new DoctorController();
        this.router.get("/search", doctorController.getSearch.bind(doctorController));
        this.router.get("/", doctorController.getAll.bind(doctorController));
        this.router.get("/:id", doctorController.getById.bind(doctorController));
        this.router.get("/route", doctorController.Test.bind(doctorController));
        this.router.post("/new", doctorController.createDoctor.bind(doctorController));

    }
    getRouter() {
        return this.router;
    }
}

export default DoctorRoute;

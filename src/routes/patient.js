import express from "express";
import PatientController from "../controllers/patient.js";
import { Utils } from "../utils/utils.js";

class PatientRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
        Utils.debug(this.class);
    }
    initRoute() {
        const patientController = new PatientController();
        /* new */
        /** recibe peticion inIcial   */
        this.router.get("/", patientController.getPatients.bind(patientController));
        /**recibe peticon para un paciente por id */
        this.router.get("/edit/:id", patientController.getPatientById.bind(patientController));

        this.router.get("/delete/:id", patientController.deleteById.bind(patientController));

        /** recibe peticion de crear un paciente  */
        this.router.post("/create", patientController.createPatient.bind(patientController));


    }
    getRouter() {
        return this.router;
    }
}

export default PatientRoute;

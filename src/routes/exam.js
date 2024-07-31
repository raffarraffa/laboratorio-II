import express from "express";
import examController from "../controllers/exam.js";
import { Utils } from "../utils/utils.js";
import ExamController from "../controllers/exam.js";

class ExamRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
    }
    initRoute() {
        const examController = new ExamController();
        //this.router.get("/", (req, res) => { res.send("Hello World!"); });
        this.router.get("/", examController.getAll.bind(examController));
        this.router.get("/:id", examController.getById.bind(examController));
        this.router.get("/route", examController.Test.bind(examController));
        this.router.post("/new", examController.createExam.bind(examController));
    }
    getRouter() {
        return this.router;
    }
}

export default ExamRoute;

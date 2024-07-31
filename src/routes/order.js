import express from "express";
import OrderController from "../controllers/order.js";
import { Utils } from "../utils/utils.js";

class OrderRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
        Utils.debug(this.class);
    }
    initRoute() {
        const orderController = new OrderController();
        //  this.router.get("/", (req, res) => { res.send("Hello World!"); });      
        // this.router.get("/new", (req, res) => { res.send("Hello World!"); });
        /** recibe id paciente para generar la orden */
        this.router.get("/new/:id/:doctor_id", orderController.getNew.bind(orderController));
        /** recib id orden para editar */
        this.router.get("/edit/:id", orderController.getEdit.bind(orderController));
        /** imprimir orden resultados */
        this.router.get("/result/:id", orderController.getResult.bind(orderController));
        //this.router.post("/new/", orderController.getNew.bind(orderController));
        //    this.router.post("/new", (req, res) => { res.json(req.body); });

        this.router.get("/route", orderController.Test.bind(orderController));
        this.router.get("/", orderController.getAll.bind(orderController));
        this.router.post("/create", orderController.createOrder.bind(orderController));
        this.router.post("/edit", orderController.editOrder.bind(orderController));
        this.router.post("/test", (req, res) => { res.send(req.body) });

        /*    this.router.post("/created", (req, res) => {
    
                const { patients_id, doctor, diagnosis, exams, samples } = req.body;
                console.log(patients_id);
                console.log(doctor);
                console.log(diagnosis);
                console.log(exams);
                console.log(samples);
                Utils.debug(typeof (req.body), this.class, true);
                res.send(req.body);
            });
        */

    }
    getRouter() {
        return this.router;
    }
}

export default OrderRoute;

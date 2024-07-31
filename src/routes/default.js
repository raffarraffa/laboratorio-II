// src/routes/defaultRoute.js
import express from "express";
import DefaultController from "../controllers/default.js";
import Auth from "../middlewares/auth.js";

class DefaultRoute {
    constructor() {
        this.router = express.Router();
        this.defaultController = new DefaultController();
        this.Auth = new Auth();
        this.initRoutes();
    }

    initRoutes() {
        const defaultController = new DefaultController();
        this.router.get("/", (req, res) => { res.send("Hello World!"); });
        this.router.post("/", (req, res) => { res.send("Hello World!"); });
        this.router.post("/login", (req, res) => {
            console.log(` request: ${req.body}`);
            console.log(`Request body: ${JSON.stringify(req.body)}`);
            const requestData = req.body;
            res.json(requestData);
        });
    }

    getRouter() {
        return this.router;
    }
}

export default DefaultRoute;

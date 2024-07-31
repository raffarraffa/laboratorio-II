// src/routes/loginRoute.js
import express from "express";
import LoginController from "../controllers/login.js";
import Auth from "../middlewares/auth_old.js";

class LoginRoute {
    constructor() {
        this.router = express.Router();
        this.loginController = new LoginController();
        this.Auth = new Auth();
        this.initRoutes();
    }

    initRoutes() {
        const loginController = new LoginController();
        this.router.get("/", (req, res) => { res.send("Hello World!"); });
        this.router.post("/", (req, res) => {
            console.log(`Request body: ${JSON.stringify(req.body)}`);
            const requestData = req.body;
            if (requestData.user === "admin" && requestData.password === "admin") {
                return res.redirect("/");
            }
            res.json(requestData);
        });
    }

    getRouter() {
        return this.router;
    }
}

export default LoginRoute;

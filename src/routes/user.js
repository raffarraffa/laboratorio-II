import express from "express";
import { Utils } from "../utils/utils.js";
import UserController from "../controllers/user.js";

class UserRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
    }
    initRoute() {
        const userController = new UserController();
        //this.router.get("/", (req, res) => { res.send("Hello World!"); });
        this.router.get("/", userController.getAll.bind(userController));
        this.router.get("/:id", userController.getById.bind(userController));
        this.router.get("/route", userController.Test.bind(userController));
        this.router.post("/login", userController.logIn.bind(userController));
        this.router.post("/logout", userController.logOut.bind(userController));
    }
    getRouter() {
        return this.router;
    }
}

export default UserRoute;


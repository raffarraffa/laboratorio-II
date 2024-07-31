import express from "express";
import ProfileController from "../controllers/profile.js";
import { Utils } from "../utils/utils.js";

class ProfileRoute {
    constructor() {
        this.router = express.Router();
        this.class = Utils.getClassName(); // Usa la función para obtener la clase actual
        this.initRoute();
        Utils.debug(this.class);
    }
    initRoute() {
        const profileController = new ProfileController();
        this.router.get("/test", (req, res) => { res.send(`ROUTER OK  ${this.class} `); });
        this.router.get("/", profileController.getAll.bind(profileController));
        this.router.get("/:id", profileController.getById.bind(profileController));
        this.router.get("/route", profileController.Test.bind(profileController));
    }
    getRouter() {
        return this.router;
    }
}

export default ProfileRoute;

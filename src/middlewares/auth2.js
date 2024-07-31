// src/middlewares/Auth.js

import express from "express";
class Auth2 {
    constructor() {
        this.autorized = false;
        this.router = express.Router();
        this.initRoute();
    }

    initRoute() {
        this.router.all("*", (req, res, next) => {
            if (this.autorized) {
                next();
            } else {
                res.redirect('/login');
                //                res.status(401).send("Unauthorized");
            }
        });
    }
    getRouter() {
        return this.router;
    }

}

export default Auth2;

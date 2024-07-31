// src/middlewares/Auth3.js

import express from "express";
class Auth3 {
    constructor() {
        this.autorized = false;
        this.router = express.Router();
        this.initRoute();
    }

    initRoute() {
        // this.router.use(async (req, res, next) => {
        //         this.router.locals.success = await req.getFlash("success");
        //         this.router.locals.error = await req.getFlash("error");
        //         this.router.locals.user = req.user;
        //         next();
        //     });
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
export default Auth3;



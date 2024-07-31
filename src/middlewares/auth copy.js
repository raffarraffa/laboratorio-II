// // src/middlewares/Auth.js
// import { expressjwt } from "express-jwt";

// class Auth {
//     constructor() {

//     }


// }

// export default Auth;
// src/middlewares/Auth.js

import express from "express";
class Auth {
    constructor() {
        this.autorized = true;
        this.router = express.Router();
        this.initRoute();
    }

    initRoute() {
        this.router.post("/login", (req, res, next) => {
            if (this.autorized) { console.log("2test ñlogin") }
        });

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

export default Auth;

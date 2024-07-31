import { json } from "sequelize";

// src/middlewares/Auth.js
class AuthMiddleWare {
    constructor() {
    }
    isAuthenticated(req, res, next) {
        if (req.session.user) {
            console.log("test ñloginsaddadf");
            next();
        } else {
            console.log(json(req.body));
            console.log("test ñlogin");
            res.redirect('/');
            //            next('route');
        }
    }
}
export default AuthMiddleWare;

// // export default Auth;
// // src/middlewares/Auth.js

// import express from "express";
// class AuthMiddleware {
//     constructor() {
//         this.autorized = true;
//         this.router = express.Router();
//         this.initRoute();
//     }

//     initRoute() {
//         this.router.post("/login", (req, res, next) => {
//             if (this.autorized) { console.log("2test ñlogin") }
//         });

//         this.router.all("*", (req, res, next) => {
//             if (this.autorized) {
//                 next();
//             } else {
//                 res.redirect('/login');
//                 //                res.status(401).send("Unauthorized");
//             }
//         });
//     }
//     getRouter() {
//         return this.router;
//     }
// }

// export default Auth;

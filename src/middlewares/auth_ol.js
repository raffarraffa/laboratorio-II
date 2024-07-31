import jwt from 'jsonwebtoken';

// src/middlewares/Auth.js
class AuthMiddleWare {
    constructor() {

    }
    isAuthenticated(req, res, next) {
        const token = req.cookies.token;

        if (!token) return res.sendStatus(401);

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user;
            next();
        });
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

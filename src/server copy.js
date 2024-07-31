// src/server.js
import express from "express";
import morgan from "morgan";
import MainRouter from "./mainRouter.js";

import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import expressMySQLSession from "express-mysql-session";

import expressIp from "express-ip";
import Auth from "./middlewares/auth.js";

class Server {
    constructor() {
        this.server = express();
        this.port = 8080;
        this.routes = new MainRouter();
        this.setupServer();
        this.setupSession();
        this.setupRoutes();
    }

    async startServer() {
        this.server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }

    setupServer() {
        // Motor de Plantilla                
        this.server.set('views', './src/views');
        this.server.set('view engine', 'pug');
        // log http request
        this.server.use(morgan('tiny'));
        // json y url-encoded parser
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: true }));
        // autorization
        this.server.use(expressIp().getIpInfoMiddleware);
        this.server.use(cookieParser());
    }

    setupSession() {
        const configSession = {
            secret: "your_session_secret",
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false }
        };
        this.server.use(session(configSession));
    }

    setupRoutes() {
        this.server.use("/", this.routes.getRouter());
    }
}

export default Server;

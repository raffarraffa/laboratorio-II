// src/server.js
import express from "express";
import morgan from "morgan";
import MainRouter from "./mainRouter.js";
class Server {
    constructor() {

        this.server = express();
        this.port = 8080;
        this.routes = new MainRouter();
        this.setupServer();
    }
    getServer() {
        return this.server;
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
        // Inyectar las rutas en el servidor Express
        this.server.use("/", this.routes.getRouter());
    }
}

export default Server;

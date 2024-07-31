// src/server.js
import express from "express";
import session from 'express-session';
import flash from 'connect-flash';
import morgan from "morgan";
import MainRouter from "./mainRouter.js";
import cookieParser from "cookie-parser";

/**
* Construye una nueva instancia de la clase.
*
* Inicializa el servidor, establece el puerto, crea una nueva instancia de MainRouter y configura el servidor, la autenticación y las rutas.
 */
class Server {
    constructor() {
        this.server = express();
        this.port = 8085;
        this.routes = new MainRouter();
        this.setupServer();
        this.setupAuth();
        this.setupRoutes();
        this.setupError();
    }
    /**
    * Starts the server and listens on the specified port.
    *
    * @return {Promise<void>} A promise that resolves when the server is successfully started.
    */
    startServer() {
        this.server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
    /**
     * Configura el servidor estableciendo el directorio de vistas, el motor de plantillas, el middleware de registro,
     * los middleware de JSON y URL-encoded.
     *
     * @return {void}
     */
    setupServer() {
        // Motor de Plantilla                
        this.server.set('views', './src/views');
        this.server.set('view engine', 'pug');
        this.server.locals.pretty = true;
        // log http request
        this.server.use(morgan('tiny'));
        // json y url-encoded parser
        this.server.use(express.json());
        this.server.use(express.urlencoded({ extended: true }));
        this.server.use(cookieParser());
    }
    /**
     * Configura el middleware de autenticación para el servidor.
     *
     * Esta función configura el middleware de sesión para el servidor especificando las opciones de nombre, secreto, resave y saveUninitialized.
     *
     * @return {void} Esta función no devuelve ningún valor.
     */
    setupAuth() {
        // session
        this.server.use(session({
            name: 'sistema_lis',
            secret: 'secreto',
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false }
        }));
        // Configura connect-flash
        this.server.use(flash());
    }
    setupRoutes() {
        this.server.use("/", this.routes.getRouter());
    }
    setupError() {
        // Middleware para el manejo de errores
        this.server.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).send('Error de servidor!');
        });
    }
}

export default Server;

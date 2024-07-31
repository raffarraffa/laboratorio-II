// src/controllers/sessionController.js
import Controller from './controller.js';
import session from 'express-session';
import connectSession from 'connect-session-sequelize';

//import Session from '../models/session.js';
import { Utils } from '../utils/utils.js';

class SessionController extends Controller {
    constructor() {
        super();
        this.SequelizeStore = connectSession(session.Store);
        this.sessionMiddleware = session({
            secret: "your_session_secret",
            store: new this.SequelizeStore({ db: sequelize, tableName: 'sessions' }),
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false }
        });
        this.class = Utils.getClassName();

        Utils.debug(this.class);
    }

    async createSession(req, res) {
        try {
            const { sessionId, expires, data } = req.body;
            const session = await this.models.session.create({
                session_id: sessionId,
                expires,
                data
            });
            res.status(201).json(session);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear la sesión' });
        }
    }

    async getSession(req, res) {
        try {
            const { sessionId } = req.params;
            const session = await this.models.session.findByPk(sessionId);
            if (!session) {
                res.status(404).json({ error: 'Sesión no encontrada' });
            } else {
                res.status(200).json(session);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener la sesión' });
        }
    }

    async deleteSession(req, res) {
        try {
            const { sessionId } = req.params;
            const session = await this.models.session.findByPk(sessionId);
            if (!session) {
                res.status(404).json({ error: 'Sesión no encontrada' });
            } else {
                await session.destroy();
                res.status(200).json({ message: 'Sesión eliminada' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al eliminar la sesión' });
        }
    }
}

export default SessionController;

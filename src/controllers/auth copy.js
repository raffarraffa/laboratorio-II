import Controller from './controller.js';
import { Utils } from '../utils/utils.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = 'your-secret-key';

class AuthController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }

    Test(req, res) {
        res.send('Hello Worldddd!');
    }
    isAuth(req, res, next) {

        //const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const authToken = req.cookies.authToken;
        try {
            const verifiedToken = this.verifyToken(authToken);
            const data = Utils.decrypt(verifiedToken.data);
            console.log(data);
            if (authToken && verifiedToken) {
                res.cookie('authToken', authToken, { httpOnly: true, secure: true, maxAge: 3600000 });
                next();
            } else {
                const { password, username } = req.body;
                // aca verifico login
                if (username === '1' && password === '1') {
                    const user = {
                        userId: 1,
                        role: 'admin',
                        name: 'JUAN',

                    }

                    const token = this.createToken(user, ip);
                    res.cookie('authToken', token, { httpOnly: true, secure: true, maxAge: 3600000 });
                    res.redirect('/');

                } else {
                    res.render('login.pug');

                }


            }
        }
        catch (error) {
            console.log('error');
            res.render('login.pug');
        }

    }

    getAuth(req, res) {
        console.log(Date.now(), 'getauth Worldddd!');
        console.log(req.path);
        res.render('login.pug');
    }
    createToken(user) {

        const data = Utils.encrypt(JSON.stringify(user));
        console.log(data);
        const payload = {
            username: user.name,
            role: user.rol,
            data: data
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
        return token;
    }
    verifyToken(token) {
        try {
            const result = jwt.verify(token, JWT_SECRET);
            return result;
        } catch (err) {
            console.error('Error verificando token:', err.message);
            //throw err;
            return false;
        }
    }






    isAutenticated(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect('/login');
        }
    }

    async getById(req, res) {
        try {

            const id = req.params.id;
            Utils.debug(id, this.class, true);
            const auth = await this.models.auth.findByPk(
                id,
                {
                    include: {
                        model: this.models.user,
                        as: 'users',
                    }
                }
            );
            if (!auth) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(auth.dataValues, this.class, true);
                res.status(200).json(auth);
            }
        } catch (error) {
            console.log(error, `${this.class} no encontrado`);
            res.status(500).json({ error: `Error al obtener ${this.class}` });
        }
    }
}
export default AuthController;

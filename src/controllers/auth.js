import Controller from './controller.js';
import { Utils } from '../utils/utils.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const PASS_SECRET = process.env.PASS_SECRET || 'your-pass-secret-key';
import userController from './user.js';
class AuthController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        this.userController = new userController();
    }

    Test(req, res) {
        res.send('Hello Worldddd!');
    }
    async isAuth(req, res, next) {
        const authToken = req.cookies.authToken;
        try {
            if (authToken) {
                const verifiedToken = this.verifyToken(authToken);
                if (verifiedToken) {
                    const userData = JSON.parse(verifiedToken.data);
                    const user = await this.userController.findByEmail(userData.email);
                    if (!user) {
                        throw new Error('Usuario no encontrado');
                    }
                    req.session.user = {
                        userId: user.id,
                        roles: user.profiles,
                        firstName: user.first_name,
                        lastName: user.last_name
                    };
                    res.cookie('authToken', authToken, { httpOnly: false, secure: true, maxAge: 3600000 });

                    return next();
                }
            }

            if (req.method === 'POST') {
                const { password, username } = req.body;
                if (password && username) {
                    const user = await this.userController.findByEmail(username);
                    console.log(user);
                    if (user && this.verifyPass(user, password)) {
                        /*
                        {
                            id: 1,
                            email: 'admin@admin.com',
                            first_name: 'Rafa',
                            last_name: 'Lopez',
                            password: 'eyJhbGciOiJIUzI1NiJ9.MTIzNA.ecFEOIfC_eow1IJuRguQZEfmcTf4gY1UqJ72XYio3co',
                            profiles: [ { access_auth: 1, name: 'Administrator', license: null } ]
                        }
                        */
                        req.session.user = {
                            userId: user.id,
                            roles: user.profiles,
                            firstName: user.first_name,
                            lastName: user.last_name
                        };
                        const userAuth = {
                            email: user.email,
                            firstName: user.first_name,
                            lastName: user.last_name
                        }
                        const token = this.createToken(userAuth);
                        res.cookie('authToken', token, { httpOnly: true, secure: true, maxAge: 3600000 });
                        return res.redirect('/');
                    } else {
                        req.flash('error', 'Login erroneo');
                        return res.redirect('/');
                    }
                } else {
                    req.flash('error', 'Faltan datos');
                    return res.redirect('/');
                }
            } else {
                return res.render('login.pug');
            }
        } catch (error) {
            console.log('error', error);
            req.flash('error', 'Login erroneo o Faltan datos');
            return res.redirect('/');

        }
    } etAuth(req, res) {
        res.render('login.pug');
    }
    createToken(userAuth) {
        const data = (JSON.stringify(userAuth));
        userAuth.data = data;

        const token = jwt.sign(userAuth, JWT_SECRET, { expiresIn: '1d' });
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
    verifyPass(user, pass) {
        const singPass = jwt.sign(pass, PASS_SECRET);
        return singPass == user.password;
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

                res.status(200).json(auth);
            }
        } catch (error) {
            console.log(error, `${this.class} no encontrado`);
            res.status(500).json({ error: `Error al obtener ${this.class}` });
        }
    }

}
export default AuthController;

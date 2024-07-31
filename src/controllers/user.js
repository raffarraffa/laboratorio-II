import Controller from './controller.js';
import { Utils } from '../utils/utils.js';
import { json } from 'sequelize';
import jwt from 'jsonwebtoken';
class UserController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }

    Test(req, res) {
        res.send('Hello Worldddd!');
    }

    async getAll(req, res) {
        try {
            const users = await this.models.user.findAll(
                {
                    include: [{
                        model: this.models.city,
                        include: {
                            model: this.models.state,
                            attributes: ['name'],
                            as: 'state',
                        },
                        attributes: ['name'],
                        as: 'city',
                    },
                    {
                        model: this.models.profile,
                        as: 'profile',
                    }
                    ]
                }
            );
            if (!users) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(users.dataValues, this.class, true);
                res.status(200).json(users);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async getById(req, res) {
        try {

            const id = req.params.id;
            Utils.debug(id, this.class, true);
            const user = await this.models.user.findByPk(
                id,
                {
                    include: [{
                        model: this.models.city,
                        include: {
                            model: this.models.state,
                            attributes: ['name'],
                            as: 'state',
                        },
                        attributes: ['name'],
                        as: 'city',
                    },
                    {
                        model: this.models.profile,
                        as: 'profile',
                    }
                    ]
                }
            );
            if (!user) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(user.dataValues, this.class, true);
                res.status(200).json(user);
            }
        } catch (error) {
            console.log(error, `${this.class} no encontrado`);
            res.status(500).json({ error: `Error al obtener ${this.class}` });
        }
    }
    async findById(id) {

        try {
            const user = await this.models.user.findOne({
                where: { id: id },
                attributes: ['id', 'first_name', 'last_name', 'password'],
                include: {
                    model: this.models.profile,
                    as: 'profiles',
                    attributes: ['access_auth', 'name', 'license'],
                }
            });
            if (!user) {
                return false;
            } else {
                return user;
            }
        } catch (error) {
            console.log(error, `${this.class} no encontrado`);
            res.status(500).json({ error: `Error al obtener ${this.class}` });
        }
    }
    async findByEmail(email) {

        try {
            const user = await this.models.user.findOne({
                where: { email: email },
                attributes: ['id', 'email', 'first_name', 'last_name', 'password'],
                include: {
                    model: this.models.profile,
                    as: 'profiles',
                    attributes: ['access_auth', 'name', 'license'],
                }
            });
            const userData = user.get({ plain: true });
            if (!user) {
                return false;
            } else {
                Utils.debug(userData, this.class, true);
                return userData;
            }
        } catch (error) {
            console.log(error, `${this.class} no encontrado`);
            res.status(500).json({ error: `Error al obtener ${this.class}` });
        }
    }
    async logIn(req, res) {
        //    return res.send('Hello Worldddd!');
        try {
            const { username, password } = req.body;
            const user = await this.models.user.findByEmail(username);
            console.log(typeof user);

            if (user && user.validarPassword(password)) {
                const token = jwt.sign({ username: user.email, id: user.id }, 'SECRET_KEY', { expiresIn: '1h' });
                Utils.debug(user.dataValues, this.class, true);
                res.status(200).json(token);
            } else {
                throw new Error(`${this.class}  Verifique los datos ingresados `);
            }
        } catch (error) {
            console.log(error, `${this.class} `);
            res.status(500).send(`${error}`);
        }
    }
    logOut(req, res) {
        console.log(json(req.body));
        res.status(401).json({ error: `Error al obtener ${this.class}` });
    }
}

export default UserController;

import Controller from './controller.js';
import { Utils } from '../utils/utils.js';
import { Error, JSON, Op, json } from 'sequelize';

class DiagnosisController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }

    Test(req, res) {
        res.send('Hello Worldddd!');
    }

    async getSearch(req, res) {
        const value = req.query.q;
        console.log(value);
        //    res.send(value);
        const type = isNaN(value) ? 'name' : 'codigo';
        try {
            const models = await this.models.diagnosis.findAll({
                where: {
                    [type]: {
                        [Op.like]: `%${value}%`
                    }
                }
            });
            if (!models || models.length === 0) {
                throw new Error('No se encontraron resultados');
            }
            console.log(models);
            res.render('./diagnosis/SearchResult', { datos: models });
        } catch (error) {
            Utils.debug(error.message, this.class, true);
            if (error.message === 'No se encontraron pacientes') {
                return res.status(404).json({ error: error.message });
            } else {
                return res.status(500).json({ error: 'Ocurrió un error inesperado' });
            }
        }
    }

    async getAll(req, res) {
        try {
            const diagnosiss = await this.models.diagnosis.findAll(
                // {
                //     include: {
                //         model: this.models.city,
                //         include: {
                //             model: this.models.state,
                //             attributes: ['name'],
                //             as: 'state',
                //         },
                //         attributes: ['name'],
                //         as: 'city',
                //     }
                // }
            );
            if (!diagnosiss) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(diagnosiss.dataValues, this.class, true);
                res.status(200).json(diagnosiss);
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
            const diagnosis = await this.models.diagnosis.findByPk(
                id,
                // {
                //     include: {
                //         model: this.models.order,
                //         as: 'orders',
                //     }
                // }
            );
            if (!diagnosis) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(diagnosis.dataValues, this.class, true);
                res.status(200).json(diagnosis);
            }
        } catch (error) {
            console.log(error, `${this.class} no encontrado`);
            res.status(500).json({ error: `Error al obtener ${this.class}` });
        }
    }
}

export default DiagnosisController;

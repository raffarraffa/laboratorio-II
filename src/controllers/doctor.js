import Controller from './controller.js';
import { Utils } from '../utils/utils.js';
import { Error, JSON, Op, json } from 'sequelize';

class DoctorController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }

    Test(req, res) {
        res.send('Hello Worldddd!');

    }
    async createDoctor(req, res) {
        const { patient_id, active, first_name, last_name, licenseData, phone } = req.body;
        const license = `LIC${licenseData}`;

        const doctorCreated = await this.models.doctor.create({ first_name, last_name, license, phone });

        // req.locals.tempData['patient_id'] = patient_id;
        // req.locals.tempData['doctorCreated'] = 6;
        // req.locals.tempData['action'] = 'newOrder';

        const tempData = {
            patient_id: patient_id,
            doctorCreated: doctorCreated.id || 0,
            action: 'newOrder',
            license: license
        }
        req.flash('tempData', tempData);
        res.redirect('/');
    }

    async getSearch(req, res) {
        const value = req.query.q;
        const type = isNaN(value) ? 'last_name' : 'license';
        try {
            const models = await this.models.doctor.findAll({
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
            res.render('./doctors/SearchResult', { datos: models });
        } catch (error) {
            Utils.debug(error.message, this.class, true);
            if (error.message === 'No se encontraron resultados') {
                return res.status(404).json({ error: error.message });
            } else {
                return res.status(500).json({ error: 'Ocurrió un error inesperado' });
            }
        }
    }
    // consultas internas para relaciones o feth
    // consulta pra devoler doctor y crear un select daa en nueva orden
    async getAll2() {
        try {
            const doctors = await this.models.doctor.findAll(
                {
                    attributes: ['id', 'first_name', 'last_name', 'license', 'phone']
                }
            );
            if (!doctors) {
                throw new Error(`${this.class} no encontrado`);
            } else {
                return doctors
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    async getAll(req, res) {
        try {
            const doctors = await this.models.doctor.findAll(
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
            if (!doctors) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(doctors.dataValues, this.class, true);
                res.status(200).json(doctors);
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
            const doctor = await this.models.doctor.findByPk(
                id,
                {
                    include: {
                        model: this.models.order,
                        as: 'orders',
                    }
                }
            );
            if (!doctor) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(doctor.dataValues, this.class, true);
                res.status(200).json(doctor);
            }
        } catch (error) {
            console.log(error, `${this.class} no encontrado`);
            res.status(500).json({ error: `Error al obtener ${this.class}` });
        }
    }
}

export default DoctorController;

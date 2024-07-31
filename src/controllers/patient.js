import Controller from './controller.js';
import { Utils } from '../utils/utils.js';
import { Error, JSON, Op, json, where } from 'sequelize';
import CityController from './city.js';

class PatientController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }

    /** recibe peticion incial 
     * @returns array pacientes 
     * @orden paciente
     * 
     * */
    async getPatients(req, res) {
        Utils.debug(`*******  ${this.class} **********`, this.class, true);
        const user = req.session.user;
        console.log(user);
        try {
            const models = await this.models.patient.findAll({
                where: { active: 1 },
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
                    model: this.models.order,

                    as: 'orders',

                }
                ]
            });
            const cityController = new CityController();
            const citys = await cityController.getAll2();
            res.render('patients.pug', { datos: models, citys: citys, user: user });
        } catch (error) {
            Utils.debug(error.message, this.class, true);
            res.send({ error: error.message });
        }

    }
    /** busca paciente por id */
    async getPatientById(req, res) {
        Utils.debug(`*******  ${this.class} **********`, this.class, true);
        const user = req.session.user;
        console.log(user);
        const id = req.params.id;
        console.log('linea 90' + id);
        try {
            const patient = await this.models.patient.findByPk(
                id, {
                include: {
                    model: this.models.city,
                    include: {
                        model: this.models.state,
                        attributes: ['name'],
                        as: 'state',
                    },
                    attributes: ['name'],
                    as: 'city',
                }
            });
            if (!patient) {
                throw new Error('Paciente no encontrado');
            }

            patient.setDataValue('edad', Utils.calcularEdad(patient.birth_at));
            res.json(patient);
        }
        catch (error) {
            console.error('Error getting patient:', error);
            res.status(500).json({
                message: 'Error getting patient',
                error: error.message
            });
        }
    }
    /** Crea paciente */
    async createPatient(req, res) {
        Utils.debug(`*******  ${this.class} **********`, this.class, true);
        const user = req.session.user;
        console.log(user);
        const idPatient = req.body.id;

        if (isNaN(idPatient)) {
            const pat = await this.models.patient.findByPk(
                req.body.id, {
                include: {
                    model: this.models.city,
                    include: {
                        model: this.models.state,
                        attributes: ['name'],
                        as: 'state',
                    },
                    attributes: ['name'],
                    as: 'city',
                }
            });
        }
        try {
            const city = await this.models.city.findOne({
                attributes: ['id'],
                where: {
                    name: req.body.city
                }
            });

            if (!city) {
                throw new Error('La ciudad especificada no existe en la base de datos.');
            }

            let patient;
            if (req.body.id) {

                const patientId = parseInt(req.body.id);
                const patientDataToUpdate = {

                    active: req.body.active,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    document: req.body.document,
                    email: req.body.email,
                    phone: req.body.phone,
                    birth_at: req.body.birth_at,
                    sex: req.body.sex,
                    address: req.body.address,
                    city: city.id,
                    pregnant: req.body.pregnant,
                    users_id: user.userId

                };
                const [updatedRowsCount] = await this.models.patient.update(
                    patientDataToUpdate,
                    {
                        where: {
                            id: patientId
                        }
                    }
                );
                if (updatedRowsCount === 0) {
                    throw new Error('No se encontró el paciente para actualizar.');
                }
                //patient = updatedPatient;
            } else {
                req.body.id = null;
                patient = await this.models.patient.create({
                    ...req.body,
                    users_id: user.userId,
                    citys_id: city.id
                });
                if (!patient) {
                    throw new Error('No se pudo crear el paciente.');
                }
            }

            if (req.body.action === 'create') {
                req.flash('success', 'Paciente creado exitosamente');
                res.redirect('/');
            } else if (req.body.action === 'createWithOrder') {
                const tempData = {
                    patient_id: patient.id,
                    doctorCreated: false,
                    action: 'newOrder'
                };
                req.flash('tempData', tempData);
                res.redirect('/');
            } else {
                throw new Error('Acción no reconocida.');
            }
        } catch (error) {
            console.error('Error creating or updating patient:', error);
            req.flash('error', 'Error, no se pudo crear el usuario');
            res.redirect('/');
        }
    }

    async createPatint2(req, res) {
        const cityId = await this.models.city.findOne(
            {
                attributes: ['id'],
                where: {
                    name: req.body.city
                }
            });

        const patientNew = req.body;
        patientNew.citys_id = cityId.id;


        try {

            if (patientNew.id) {
                const [updatedRowsCount] = await this.models.patient.update(patientNew);
                if (updatedRowsCount === 0) {
                    throw new Error('No se pudo actualizar el paciente');
                }

            } else {
                const patient = await this.models.patient.create(patientNew);
                if (!patient) {
                    throw new Error('No se pudo crear el paciente');
                }
            }

            if (patientNew.action == 'create') {
                res.redirect('/');
            }
            if (patientNew.action == 'createWithOrder') {
                res.render('orderNew.pug', { patient: patient.dataValues });
            }

        } catch (error) {
            console.error('Error creating patient:', error);
            res.status(500).json({
                message: 'Error creating patient',
                error: error.message
            });
        }
    }
    async deleteById(req, res) {

        const id = req.params.id;
        try {
            // Desactivar el paciente cambiando active a 0
            await this.models.patient.update(
                { active: 0 },
                { where: { id: id } }
            );

            // Redirigir al usuario a la página principal después de la operación exitosa
            res.send('ok');
        } catch (error) {
            // Capturar y manejar cualquier error que pueda ocurrir durante la actualización
            console.error('Error deleting patient:', error);
            res.status(500).json({
                message: 'Error deleting patient',
                error: error.message
            });
        }
    }
}
export default PatientController;

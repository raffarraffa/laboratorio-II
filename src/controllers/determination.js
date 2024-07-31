import Controller from './controller.js';
import { Utils } from '../utils/utils.js';

class DeterminationController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }

    Test(req, res) {
        res.send('Hello Worldddd!');
    }
    async createDetermination(req, res) {
        const { name, observation } = req.body;
        try {
            const determinationCreated = await this.models.determination.create({ name, observation });
            // res.status(201).json(determinationCreated);
            res.redirect('/admin');
        } catch (error) {
            console.log(error);
        }
    }
    async getAllForAdmin() {
        try {

            const models = await this.models.determination.findAll();
            const plainModels = models.map(model => model.get({ plain: true }));
            return plainModels;

        } catch (error) {

            return JSON.stringify({ "error": error });

        }
    }

    async getAll(req, res) {
        try {
            const determinations = await this.models.determination.findAll(
                {
                    where: {

                        //                status: 'Activa', 

                    },

                    // include: [{
                    //     model: this.models.user,
                    //     as: 'user',
                    // },
                    // {
                    //     model: this.models.doctor,
                    //     as: 'doctor',
                    // },
                    // {
                    //     model: this.models.diagnosis,
                    //     as: 'diagnosis',
                    // },
                    // {
                    //     model: this.models.sample,
                    //     as: 'samples',
                    //     include: {
                    //         model: this.models.sampleType,
                    //         as: 'sampleType',
                    //     },
                    // },
                    // {
                    //     model: this.models.studie,
                    //     as: 'studies',
                    //     include:
                    //     {
                    //         model: this.models.exam,
                    //         as: 'exam',
                    //     }

                    // }
                    // ]

                }
            );


            if (determinations.length == 0) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(determinations.dataValues, this.class, true);
                res.status(200).json(determinations);
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
            const determination = await this.models.determination.findByPk(
                id,
                // {
                //     include: [{
                //         model: this.models.user,
                //         as: 'user',
                //     },
                //     {
                //         model: this.models.doctor,
                //         as: 'doctor',
                //     },
                //     {
                //         model: this.models.diagnosis,
                //         as: 'diagnosis',
                //     },
                //     {
                //         model: this.models.sample,
                //         as: 'samples',
                //         include: {
                //             model: this.models.sampleType,
                //             as: 'sampleType',
                //         },
                //     },
                //     {
                //         model: this.models.studie,
                //         as: 'studies',
                //         include:
                //         {
                //             model: this.models.exam,
                //             as: 'exam',
                //         }

                //     }
                //     ]
                // }
            );
            if (!determination) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(determination.dataValues, this.class, true);
                res.status(200).json(determination);
            }
        } catch (error) {
            console.log(error, `${this.class} no encontrado`);
            res.status(500).json({ error: `Error al obtener ${this.class}` });
        }
    }
}

export default DeterminationController;

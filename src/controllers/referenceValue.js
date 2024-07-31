import Controller from './controller.js';
import { Utils } from '../utils/utils.js';

class ReferenceValueController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }

    Test(req, res) {
        res.send('Hello Worldddd!');
    }
    async createReferenceValue(req, res) {

        const { sex, age_min, age_max, pregnant, value_min, value_max, value_ref_min, value_ref_max, observation, determinations_id, units_id, dflt } = req.body;
        //dftl = dflt == '' ? 0 : dflt
        //    const dflt = (req.body.dftl) ? req.body.dftl : 0;

        // Crear un nuevo registro
        const newReferenceValue = await this.models.referenceValue.create({
            sex,
            age_min,
            age_max,
            pregnant: pregnant === '1', // Convertir a booleano si es necesario
            value_min,
            value_max,
            value_ref_min,
            value_ref_max,
            observation,
            determinations_id,
            units_id,
            dflt

        });
        //{"action":"create","sex":"M","age_min":"055","age_max":"50","pregnant":"0","value_min":"9","value_max":"36","value_ref_min":"20","value_ref_max":"256","observation":"Millones x microlitro","determinations_id":"1","unit_id":"1"}

        try {
        } catch (error) {
            console.log(error);
            console.error('Error al generar el PDF:', error);
            res.status(500).send('Error al generar el PDF');
        }

        //{"action":"create","sex":"M","age_min":"0","age_max":"0","pregnant":"0","value_min":"0","value_max":"0","value_ref_min":"0","value_ref_max":"0","observation":""}
        res.json(newReferenceValue);
    }

    async getAll(req, res) {
        try {
            const referenceValue = await this.models.referenceValue.findAll(
                {
                    where: {

                        //                status: 'Activa', 

                    },
                    include: [{
                        model: this.models.determination,
                        as: 'determination'
                    }, {
                        model: this.models.unit,
                        as: 'unit',
                    }]

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


            if (referenceValue.length == 0) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(referenceValue.dataValues, this.class, true);
                res.status(200).json(referenceValue);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async getAllForAdmin() {
        try {

            const models = await this.models.referenceValue.findAll({
                include: [
                    {
                        model: this.models.unit,
                        as: 'unit',
                        attributes: ['name']
                    }
                ]
            });
            //const plainModels = models.map(model => model.get({ plain: true }));
            const plainModels = models.map(model => {
                return {
                    ...model.get({ plain: true }),
                    //unitName: model.unit.name
                }
            });

            return plainModels;

        } catch (error) {

            return JSON.stringify({ "error": error });

        }
    }
    async getAllDebug(req, res) {
        console.log('entro por debug');
        try {

            const models = await this.models.referenceValue.findAll({
                // include: [
                //     {
                //         model: this.models.unit,
                //         as: 'unit',
                //         attributes: ['name']
                //     }
                // ]
            });
            // const plainModels = models.map(model => model.get({ plain: true }));
            // const plainModels = models.map(model => {
            //     return {
            //         ...model.get({ plain: true }),
            //         //unitName: model.units.name
            //     }
            // });

            res.json(models);

        } catch (error) {

            return JSON.stringify({ "error": error });

        }
    }
    async getById(req, res) {
        try {

            const id = req.params.id;
            Utils.debug(id, this.class, true);
            const referencevalue = await this.models.referencevalue.findByPk(
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
            if (!referencevalue) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(referencevalue.dataValues, this.class, true);
                res.status(200).json(referencevalue);
            }
        } catch (error) {
            console.log(error, `${this.class} no encontrado`);
            res.status(500).json({ error: `Error al obtener ${this.class}` });
        }
    }
}

export default ReferenceValueController;

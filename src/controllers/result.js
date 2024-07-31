import Controller from './controller.js';
import { Utils } from '../utils/utils.js';

class ResultController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }

    async getNew_1(req, res) {
        const id = req.params.id;

        const order = await this.models.order.findByPk(id,
            {

                include: [{
                    model: this.models.patient,
                    as: 'patient',
                },
                {
                    model: this.models.user,
                    as: 'user',
                },
                {
                    model: this.models.doctor,
                    as: 'doctor',
                },
                {
                    model: this.models.diagnosis,
                    as: 'diagnosis',
                },
                {
                    model: this.models.sample,
                    as: 'samples',
                    include: {
                        model: this.models.sampleType,
                        as: 'sampleType',
                    },
                },
                {
                    model: this.models.studie,
                    as: 'studies',
                    include:
                    {
                        model: this.models.exam,
                        as: 'exam',
                        include: {
                            model: this.models.determination,
                            as: 'determinations',
                            include: {
                                model: this.models.referenceValue,
                                as: 'referenceValue',
                                include: {
                                    model: this.models.unit,
                                    as: 'unit',
                                }
                            }
                        }
                    }

                }
                ]

            }
        );
        order.patient.edad = Utils.calcularEdad(order.patient.birth_at);
        const orderData = JSON.stringify({ "order": order });
        //    res.json({ "order": order }); //JSON.stringify(order);
        res.render('resultNew.pug', { "order": order });

    }
    async getResultDeteminations(orderId) {
        const result = [];
        // logica para seleccionar los valores de referencia correctos
        const seleccionarValoresReferencia = (determination, patient) => {
            const { referenceValue } = determination;
            const edad = patient.dataValues.edad;
            const sexo = patient.sex;
            const embarazada = patient.pregnant;
            console.log(referenceValue);

            // Filtrar los valores de referencia según sexo, edad y estado de embarazo
            return referenceValue.find(ref =>
                ref.sex === sexo &&
                ref.age_min <= edad && edad <= ref.age_max &&
                ref.pregnant === embarazada
            );
        };

        // Recorrer los estudios y sus determinaciones
        studies.forEach(study => {
            study.exam.determinations.forEach(determination => {
                const valorReferencia = seleccionarValoresReferencia(determination, patient);
                if (valorReferencia) {
                    result.push({
                        reference_values_id: valorReferencia.id,
                        determinations_id: determination.id,
                        studies_id: study.id,
                        value: null
                    });
                }
            });
        });
        return result;
    }
    async updateResult(req) {
        console.log('updateResult ***************************************************************************************************');
        const user = req.session.user;
        const userId = user.userId;
        Utils.debug(userId, this.class, true);

        const results = req.body.results;
        const updates = Object.entries(results).map(([key, value]) => {
            // saco las comillas simple
            const id = parseInt(key.replace(/'/g, ''), 10);
            return { id, value };
        });
        console.log('results');
        console.log(updates);



        try {
            const transactionResult = await this.dataBase.startTransaction();
            const updatePromises = updates.map((update) => {
                const resultUpdate = this.models.result.update({ value: update.value, users_id: userId }, { where: { id: update.id }, transaction: transactionResult });
                return resultUpdate;
            });
            await Promise.all(updatePromises);
            // Confirmar la transacción
            await transactionResult.commit();
            console.log('Actualización exitosa');
        } catch (error) {
            console.error('Error al actualizar:', error);
            //     res.status(500).send('Error al actualizar los resultados');
        }
    }
    async getResultOrder(order_id, userId) {
        const id = order_id;
        const order = await this.models.order.findByPk(id,
            {

                include: [{
                    model: this.models.patient,
                    as: 'patient',
                },

                {
                    model: this.models.studie,
                    as: 'studies',
                    include:
                    {
                        model: this.models.exam,
                        as: 'exam',
                        include: {
                            model: this.models.determination,
                            as: 'determinations',
                            include: {
                                model: this.models.referenceValue,
                                as: 'referenceValue',
                                // include: {
                                //     model: this.models.unit,
                                //     as: 'unit',
                                // }
                            }
                        }
                    }

                }
                ]

            }
        );
        order.patient.dataValues.edad = Utils.calcularEdad(order.patient.birth_at);
        const orderData = order.get({ plain: true });
        console.log(orderData);
        const order2 = {
            orderData: {
                id: order.id,
                observation: order.observation,
                status: order.status,
                delivered: order.delivered,
                doctorsId: order.doctorsId,
                diagnosisId: order.diagnosisId,
                patientsId: order.patientsId,
                usersId: order.usersId,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            },
            patient: order.patient,
            studies: order.studies.map(study => study.exam)
        };
        const resultData = [];

        //******//
        // Inicializar el array result
        const result = [];
        // Lógica para seleccionar los valores de referencia correctos
        const seleccionarValoresReferencia = (determination, patient) => {
            // alore array referencias
            const { referenceValue } = determination;
            const edad = patient.dataValues.edad;
            const sexo = patient.sex;
            const embarazada = patient.pregnant;
            const valorReferencia = referenceValue.find(ref =>
                ref.sex === sexo &&
                ref.age_min <= edad && edad <= ref.age_max &&
                ref.pregnant === embarazada
            );
            if (valorReferencia == undefined) {
                const result = referenceValue.find(ref => ref.dflt == true)
                return result;
            }
            return valorReferencia;
        };

        // Recorrer los estudios y sus determinaciones
        order.studies.forEach(study => {
            study.exam.determinations.forEach(determination => {
                const valorReferencia = seleccionarValoresReferencia(determination, order.patient);
                if (valorReferencia) {
                    result.push({
                        reference_values_id: valorReferencia.id,
                        determinations_id: determination.id,
                        studies_id: study.id,
                        users_id: userId,
                        value: null
                    });
                }
            });
        });
        return result;
    }
    async getResultOrder_2(order_id) {
        Utils.debug('order_id');
        const order = await this.models.order.findByPk(order_id,
            {

                include: [{
                    model: this.models.patient,
                    as: 'patient',
                },
                {
                    model: this.models.user,
                    as: 'user',
                },
                {
                    model: this.models.doctor,
                    as: 'doctor',
                },
                {
                    model: this.models.diagnosis,
                    as: 'diagnosis',
                },
                {
                    model: this.models.sample,
                    as: 'samples',
                    include: {
                        model: this.models.sampleType,
                        as: 'sampleType',
                    },
                },
                {
                    model: this.models.studie,
                    as: 'studies',
                    include:
                    {
                        model: this.models.exam,
                        as: 'exam',
                        include: {
                            model: this.models.determination,
                            as: 'determinations',
                            include: {
                                model: this.models.referenceValue,
                                as: 'referenceValue',
                                include: {
                                    model: this.models.unit,
                                    as: 'unit',
                                }
                            }
                        }
                    }

                }
                ]

            }
        );
        //        const patient = order.patient.get({ plain: true });

        order.patient.dataValues.edad = Utils.calcularEdad(order.patient.birth_at);
        const orderData = order.get({ plain: true });
        const order2 = {
            orderData: {
                id: order.id,
                observation: order.observation,
                status: order.status,
                delivered: order.delivered,
                doctorsId: order.doctorsId,
                diagnosisId: order.diagnosisId,
                patientsId: order.patientsId,
                usersId: order.usersId,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            },
            patient: order.patient,
            studies: order.studies.map(study => study.exam)
        };

        //******//
        // Inicializar el array result
        const result = [];

        // Lógica para seleccionar los valores de referencia correctos
        const seleccionarValoresReferencia = (determination, patient) => {
            const { referenceValue } = determination;
            const edad = patient.dataValues.edad;
            const sexo = patient.sex;
            const embarazada = patient.pregnant;
            // Filtrar los valores de referencia según sexo, edad y estado de embarazo
            return referenceValue.find(ref =>
                ref.sex === sexo &&
                ref.age_min <= edad && edad <= ref.age_max &&
                ref.pregnant === embarazada
            );
        };
        // Recorrer los estudios y sus determinaciones
        order.studies.forEach(study => {
            study.exam.determinations.forEach(determination => {
                const valorReferencia = seleccionarValoresReferencia(determination, order.patient);
                if (valorReferencia) {
                    result.push({
                        reference_values_id: valorReferencia.id,
                        determinations_id: determination.id,
                        studies_id: study.id,
                        value: null
                    });
                }
            });
        });
        return result;
    }

    async getNew(req, res) { // este preprocesa la data
        const id = req.params.id;
        const order = await this.models.order.findByPk(id,
            {

                include: [{
                    model: this.models.patient,
                    as: 'patient',
                },
                {
                    model: this.models.user,
                    as: 'user',
                },
                {
                    model: this.models.doctor,
                    as: 'doctor',
                },
                {
                    model: this.models.diagnosis,
                    as: 'diagnosis',
                },
                {
                    model: this.models.sample,
                    as: 'samples',
                    include: {
                        model: this.models.sampleType,
                        as: 'sampleType',
                    },
                },
                {
                    model: this.models.studie,
                    as: 'studies',
                    include:
                    {
                        model: this.models.exam,
                        as: 'exam',
                        include: {
                            model: this.models.determination,
                            as: 'determinations',
                            include: {
                                model: this.models.referenceValue,
                                as: 'referenceValue',
                                include: {
                                    model: this.models.unit,
                                    as: 'unit',
                                }
                            }
                        }
                    }

                }
                ]

            }
        );
        //        const patient = order.patient.get({ plain: true });

        order.patient.dataValues.edad = Utils.calcularEdad(order.patient.birth_at);
        const orderData = order.get({ plain: true });
        const order2 = {
            orderData: {
                id: order.id,
                observation: order.observation,
                status: order.status,
                delivered: order.delivered,
                doctorsId: order.doctorsId,
                diagnosisId: order.diagnosisId,
                patientsId: order.patientsId,
                usersId: order.usersId,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
            },
            patient: order.patient,
            studies: order.studies.map(study => study.exam)
        };
        const resultData = [];

        //******//
        // Inicializar el array result
        const result = [];

        // Lógica para seleccionar los valores de referencia correctos
        const seleccionarValoresReferencia = (determination, patient) => {
            const { referenceValue } = determination;
            const edad = patient.dataValues.edad;
            const sexo = patient.sex;
            const embarazada = patient.pregnant;

            // Filtrar los valores de referencia según sexo, edad y estado de embarazo
            return referenceValue.find(ref =>
                ref.sex === sexo &&
                ref.age_min <= edad && edad <= ref.age_max &&
                ref.pregnant === embarazada
            );
        };

        // Recorrer los estudios y sus determinaciones
        order.studies.forEach(study => {
            study.exam.determinations.forEach(determination => {
                const valorReferencia = seleccionarValoresReferencia(determination, order.patient);
                if (valorReferencia) {
                    result.push({
                        reference_values_id: valorReferencia.id,
                        determinations_id: determination.id,
                        studies_id: study.id,
                        value: null
                    });
                }
            });
        });
        Utils.debug(`RESULT 334 ${id}`, this.class, true);
        res.json({ "order2": order2 });
    }

    Test(req, res) {
        res.send('Hello Worldddd!');
    }

    async getAll(req, res) {
        try {
            const results = await this.models.result.findAll(
                {
                    include: [
                        {
                            model: this.models.studie,
                            as: 'studie',
                            include: [
                                {
                                    model: this.models.exam,
                                    as: 'exam',
                                }
                            ]
                        },
                        {
                            model: this.models.determination,
                            as: 'determination',
                        },
                        {
                            model: this.models.referenceValue,
                            as: 'referenceValue',
                        }

                        //         {
                        //             model: this.models.exam,
                        //             as: 'exam',
                        //         }
                    ]
                }
            );

            if (!results) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(results.dataValues, this.class, true);
                res.status(200).json(results);
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
            const result = await this.models.result.findByPk(
                id,
                // {
                //     include: {
                //         model: this.models.order,
                //         as: 'orders',
                //     }
                // }
            );
            if (!result) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(result.dataValues, this.class, true);
                res.status(200).json(result);
            }
        } catch (error) {
            console.log(error, `${this.class} no encontrado`);
            res.status(500).json({ error: `Error al obtener ${this.class}` });
        }
    }
}

export default ResultController;

import Controller from './controller.js';
import { Utils } from '../utils/utils.js';
import DoctorController from './doctor.js';
import ExamController from './exam.js';
import ResultController from './result.js'
import Patient from '../models/patient.js';
import { json, Sequelize } from 'sequelize';
/** para genracion pdf **/
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import puppeteer from 'puppeteer';
import pug from 'pug';


// Necesario para usar __dirname con módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class OrderController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }
    /**
     * Obtiene nuevos datos para un pedido basado en el ID del paciente.
     *
     * @param {Object} req - El objeto de solicitud
     * @param {Object} res - El objeto de respuesta
     * @return {Object} Los datos del pedido incluyendo médicos y exámenes
     */
    async getNew(req, res) {
        if (req.session.user) {
            Utils.debug(`${this.class}  autorizado`, this.class, true);
            console.log(req.session.user);
        } else {
            Utils.debug(`${this.class} NO  autorizado`, this.class, true);
            console.log(req.session.user);
        };

        const id = req.params.id;
        const doctor_id = req.params.doctor_id || 0;
        const patient = await this.models.patient.findByPk(id);
        const doctors = await this.models.doctor.findAll();
        //    const exams = await this.models.exam.findAll({ include: [{ model: this.models.sampleType, as: 'sampleType', }] });
        const exams = await this.models.exam.findAll({
            include: [
                {
                    model: this.models.sampleType,
                    as: 'sampleType',
                },
                {
                    model: this.models.determinationsExam,
                    as: 'determinationsExam',
                    where: {
                        exams_id: Sequelize.col('exam.id')
                    }
                }
            ]
        });
        const diagnosis = await this.models.diagnosis.findAll();
        const samplesType = await this.models.sampleType.findAll();
        const patientData = patient.get({ plain: true });
        patientData.edad = Utils.calcularEdad(patientData.birth_at);

        const order = {
            'doctors': doctors,
            'exams': exams,
            'diagnosis': diagnosis,
            'samplesType': samplesType,
            'patient': patientData,
            'doctorId': doctor_id,
        }



        res.render('orderNew.pug', {
            'order': order,
        });
    }
    async getEdit(req, res) {
        const { dev } = req.query;
        const id = req.params.id;
        const orderData = await this.models.order.findByPk(id,
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
                    },

                },
                {
                    model: this.models.studie,
                    as: 'studies',
                    include: {
                        model: this.models.result,
                        as: 'results',
                        include: {
                            model: this.models.referenceValue,
                            as: 'referenceValue',
                            include: {
                                model: this.models.determination,
                                as: 'determination'
                            }
                        }
                    },
                },
                {
                    model: this.models.studie,
                    as: 'studies',
                    include: {
                        model: this.models.result,
                        as: 'results',
                        include: {

                            model: this.models.determination,
                            as: 'determination'

                        }
                    },
                },




                ]

            }
        );

        const patient = await this.models.patient.findByPk(orderData.patientsId);
        const doctors = await this.models.doctor.findAll();
        const exams = await this.models.exam.findAll({ include: [{ model: this.models.sampleType, as: 'sampleType', }] });
        const diagnosis = await this.models.diagnosis.findAll();
        const samplesType = await this.models.sampleType.findAll();
        const order = {
            'doctors': doctors,
            'exams': exams,
            'diagnosis': diagnosis,
            'samplesType': samplesType,

        }
        order.orderData = orderData;
        //    order.orderData = orderData.get({ plain: true });
        const doctorData = await this.models.doctor.findByPk(orderData.doctorsId);
        order.doctorData = doctorData.get({ plain: true });
        const patientData = patient.get({ plain: true });
        patientData.edad = Utils.calcularEdad(patientData.birth_at);
        order.patient = patientData;
        const ordenJson = order.orderData;
        const fecha1 = Utils.getDateWithoutTime(new Date());
        const fecha2 = Utils.getDateWithoutTime(order.orderData.createdAt);

        order.orderData.createdAt = Utils.getDate(order.orderData.createdAt);
        order.orderData.editable = (fecha1 < fecha2);
        if (!dev) {
            res.render('orderEdit.pug', { 'order': order });
        } else {
            res.json(order);
        }
        // res.render('orderEdit.pug', {'order': order });
    }

    async createOrder(req, res) {
        const user = req.session.user;
        const userId = user.userId;
        const trasactionOrder = await this.dataBase.startTransaction();
        try {
            // creo orden
            const order = {
                'doctorsId': req.body.doctorsId,
                'patientsId': req.body.patientsId,
                'diagnosisId': req.body.diagnosisId,
                'observation': req.body.observation,
                'usersId': userId
            }
            // insert orden creada
            const orderCreated = await this.models.order.create(order, { transaction: trasactionOrder });
            // creo array exams recibidos
            const exams = req.body.exams;
            let examsOrder = exams.map(examen => {
                return {
                    'orders_id': orderCreated.id,
                    'exams_id': examen
                };
            });
            // insert exams de la orden
            const examsCreated = await this.models.studie.bulkCreate(examsOrder, { transaction: trasactionOrder });
            const samplesReceived = req.body.samples;
            const samplesRequired = req.body.samplesRequired;
            // verifico muestras requerids y las recibidas
            let samplesOrder;
            if (samplesReceived) {
                samplesOrder = samplesRequired.map(sample => {
                    if (samplesReceived.includes(sample)) {
                        return {
                            'orders_id': orderCreated.id,
                            'samples_type_id': sample,
                            "status": "Recibida"
                        };
                    } else {
                        return {
                            'orders_id': orderCreated.id,
                            'samples_type_id': sample,
                            "status": "Requerida"
                        };
                    }
                })
            } else {
                samplesOrder = samplesRequired.map(sample => {
                    return {
                        'orders_id': orderCreated.id,
                        'samples_type_id': sample,
                        "status": "Requerida"
                    };
                });

            }
            // insert samples
            const samplesExamsCreated = await this.models.sample.bulkCreate(samplesOrder, { transaction: trasactionOrder });
            await trasactionOrder.commit();
            //    if (samplesExamsCreated) {
            const trasactionOrder2 = await this.dataBase.startTransaction();
            // creo los resultados en null
            //BUG resultados
            const resultController = new ResultController();
            const resultsOrder = await resultController.getResultOrder(orderCreated.id, userId);
            console.log('************* 257 ***************');
            console.log(resultsOrder);
            console.log('************ 259 ****************');
            if (resultsOrder) {
                const results = await this.models.result.bulkCreate(resultsOrder, { transaction: trasactionOrder2 });

            } else {
                console.log('************* 121 ***************');
                console.log('No hay resultados para esta orden');
                console.log('************ 123 ****************');
            }
            await trasactionOrder2.commit();

            req.flash('success_msg', 'Orden creada con exito');
            req.flash('tempData', { 'orderId': orderCreated.id });
            res.redirect('/');
        } catch (error) {
            console.log(error);
            if (trasactionOrder) {
                // Revertir la transacción en caso de error
                await trasactionOrder.rollback();
                console.log('transactioOrder rolled back');
            }
            console.error('transactioOrder rolled back error:', error);
            req.flash('error_msg', 'Error creando la orden');
            res.redirect('/');
        }
    }
    async createOrderTest(req, res) {
        console.log('************* 121 ***************');
        //console.log(req.body);
        console.log('************ 123 ****************');
        req.flash('success', 'sucess al crear o actualizar paciente');
        req.flash('error', 'Error al crear o actualizar paciente');
        req.flash('tempData', JSON.stringify({ "orderId": 2 }));
        res.redirect('/');

    }
    async editOrder(req, res) {
        const user = req.session.user;
        const userId = user.userId;
        const { orderId, observation, status, results } = req.body;
        const resultController = new ResultController();
        const samples = req.body.samples.map(sample => JSON.parse(sample));
        console.clear();
        const order = await this.models.order.findOne({
            where: {
                id: orderId
            },
            include: [{
                model: this.models.sample,
                as: 'samples',
            },
            {
                model: this.models.studie,
                as: 'studies',
                include: {
                    model: this.models.result,
                    as: 'results',
                }
            }
            ]
        });

        order.samples.forEach(sample => {
            const isSample = samples.find(sampleOrder => sampleOrder[sample.id]);
            console.log('***** muestra');
            console.log(isSample);
            console.log(sample.id);
            console.log(isSample[sample.id]);
            if (isSample) {
                sample.status = isSample[sample.id];
            }
        });

        await Promise.all(order.samples.map(async sample => {
            console.log(sample);
            if (sample.changed('status')) {
                await sample.save();
            } else {
                console.log('No se hicieron cambios, no se actualiza la muestra ' + sample.id);
            }
        }));
        order.status = status;
        order.observation = observation;

        if (order.changed('status') || order.changed('observation')) {
            await order.save();
            console.log('ok');
        } else {
            console.log('No se hicieron cambios, no se guarda la orden.');
        }
        resultController.updateResult(req);
        res.redirect('/');

    }
    Test(req, res) {
        res.send('Hello Worldddd!');
    }

    async getAll(req, res) {
        try {
            const orders = await this.models.order.findAll(
                {
                    where: {

                        //                status: 'Activa', 

                    },

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
                        }

                    }
                    ]

                }
            );
            if (!orders) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(orders.dataValues, this.class, true);
                res.render('./orders/orderList', { orders: orders });
                //res.status(200).json(orders);
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
            const order = await this.models.order.findByPk(
                id,
                {
                    include: [{
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
                        }

                    }
                    ]
                }
            );
            if (!order) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(order.dataValues, this.class, true);
                res.status(200).json(order);
            }
        } catch (error) {
            console.log(error, `${this.class} no encontrado`);
            res.status(500).json({ error: `Error al obtener ${this.class} ` });
        }
    }
    async getResult2(req, res) {

        res.render('resultPrint.pug')
    }
    async getResult_3(req, res) {
        //        const datosPaciente = await this.getPacienteData(req.params.id);

        // Define el path de la plantilla según el tipo de PDF que quieras generar
        const templatePath = join(__dirname, '../views/resultPrint.pug');

        // Define las opciones del PDF
        const pdfOptions = {
            path: 'paciente_reporte.pdf',
            format: 'A4',
            margin: {
                top: '30mm',
                bottom: '30mm',
                left: '15mm',
                right: '15mm'
            },
            displayHeaderFooter: true,
            headerTemplate: `
                <div style="font-size: 10px; width: 100%; text-align: center;">
                    <span class="title">Informe Médico</span>
                </div>
            `,
            footerTemplate: `
                <div style="font-size: 10px; width: 100%; text-align: center;">
                    Página <span class="pageNumber"></span> de <span class="totalPages"></span>
                </div>
            `,
            printBackground: true
        };

        try {
            const pdf = await this.generatePDF(templatePath, {
                paciente: datosPaciente,
                fecha: new Date().toLocaleDateString()
            }, pdfOptions);

            // Envía el PDF al cliente
            res.contentType("application/pdf");
            res.send(pdf);
        } catch (error) {
            res.status(500).send('Error al generar el PDF');
        }
    }

    async getPacienteData(id) {
        // Implementa la lógica para obtener datos del paciente
    }
    async getResult_2(req, res) {
        // Supongamos que los datos llegan en el cuerpo de la solicitud
        const { title, description } = req.body;

        // HTML dinámico con datos recibidos
        const html = `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20mm;
                    }
                    h1 {
                        color: #333;
                    }
                    p {
                        font-size: 12px;
                        color: #666;
                    }
                </style>
            </head>
            <body>
                <h1>${title || 'Informe de Prueba'}</h1>
                <p>${description || 'Este es un PDF generado con Puppeteer y HTML dinámico.'}</p>
            </body>
            </html>
        `;

        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setContent(html);
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true
            });
            await browser.close();

            res.contentType("application/pdf");
            res.send(pdfBuffer);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            res.status(500).send('Error al generar el PDF');
        }
    }

    /**********************/
    async getResult_1(req, res) {
        // Datos ficticios para enviar a la plantilla
        const data = {
            fecha: '20/07/2024',
            paciente: 'Juan Pérez',
            edad: '30 años',
            genero: 'Masculino',
            medico: 'Dra. María López',
            hematologia: [
                { prueba: 'Hemoglobina', resultado: '13.5 g/dL', referencia: '13.0-17.0 g/dL' },
                { prueba: 'Hematocrito', resultado: '40%', referencia: '38-50%' },
                { prueba: 'Leucocitos', resultado: '6,000 /µL', referencia: '4,000-10,000 /µL' }
            ],
            bioquimica: [
                { prueba: 'Glucosa', resultado: '90 mg/dL', referencia: '70-100 mg/dL' },
                { prueba: 'Colesterol Total', resultado: '180 mg/dL', referencia: '< 200 mg/dL' },
                { prueba: 'Triglicéridos', resultado: '150 mg/dL', referencia: '< 150 mg/dL' }
            ],
            uroanalisis: [
                { prueba: 'pH', resultado: '6.0', referencia: '5.0-7.0' },
                { prueba: 'Densidad', resultado: '1.015', referencia: '1.010-1.030' },
                { prueba: 'Proteínas', resultado: 'Negativo', referencia: 'Negativo' }
            ]
        };


        try {
            // Renderizar la plantilla Pug a HTML
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            // Construir la ruta al archivo Pug
            const templatePath = join(__dirname, '..', 'views', 'result.pug');

            // Renderizar la plantilla Pug a HTML
            const html = pug.renderFile(templatePath, data);


            // Usar el método estático de Utils para generar el PDF
            const pdfBuffer = await Utils.generatePdf(html);

            // Enviar el PDF como respuesta
            res.contentType("application/pdf");
            res.send(pdfBuffer);
        } catch (error) {
            console.error('Error al generar el informe:', error);
            res.status(500).send('Error al generar el informe');
        }
    }


    async getResult(req, res) {
        const id = req.params.id
        try {
            Utils.debug(id, this.class, true);
            const order = await this.models.order.findByPk(
                id,
                {
                    include: [{
                        model: this.models.user,
                        as: 'user',
                    },
                    {
                        model: this.models.patient,
                        as: 'patient',

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
                        }

                    },
                    {
                        model: this.models.studie,
                        as: 'studies',
                        include:
                            [{
                                model: this.models.result,
                                as: 'results',
                                include: [{
                                    model: this.models.determination,
                                    as: 'determination',
                                },
                                {
                                    model: this.models.referenceValue,
                                    as: 'referenceValue',
                                    include: {
                                        model: this.models.unit,
                                        as: 'unit',
                                    }
                                }]
                            }]

                    }
                    ]
                }
            );

            order.fechaLocal = order.createdAt.toLocaleDateString();
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            // // Construir la ruta al archivo Pug
            const templatePath = join(__dirname, '..', 'views', 'result.pug');

            // // Renderizar la plantilla Pug a HTML
            const html = pug.renderFile(templatePath, order);


            // Usar el método estático de Utils para generar el PDF
            const order_test = {
                "fecha": "${order.fecha}",
                "paciente": "${order.pacente}",
                "edad": "${order.edad}",
                "genero": "${order.genero}",
                "medico": "${order.medico}",

            }

            const pdfBuffer = await Utils.generatePdf(html, 'Lis2021.pdf', order_test);
            // Enviar el PDF como respuesta
            res.contentType("application/pdf");
            res.send(pdfBuffer);
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            res.status(500).send('Error al generar el PDF');
        }
    }
}

export default OrderController;

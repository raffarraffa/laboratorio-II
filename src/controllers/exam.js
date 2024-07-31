import Controller from './controller.js';



import { Utils } from '../utils/utils.js';

class ExamController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }

    Test(req, res) {
        res.send('Hello Worldddd!');
    }
    // repsuesta para formualrios
    async createExam(req, res) {
        //BUG: requeire transaccion
        const { create, nbu, detail, time, samples_type_id, determinations } = req.body;
        try {
            const examCreated = await this.models.exam.create({ create, nbu, detail, time, samples_type_id });
            const determinations_exams = await this.models.determinationsExam.bulkCreate(determinations.map(determination => ({ exams_id: examCreated.id, determinations_id: determination })));
            res.status(201).json(examCreated);
        } catch (error) {
            console.log(error);
        }
    }
    async getAll2() {
        try {
            const exams = await this.models.exam.findAll(
                {
                    include: [
                        {
                            model: this.models.sampleType,
                            as: 'sampleType',
                        },
                        {
                            model: this.models.determination,
                            as: 'determinations',
                            through: { attributes: [] }, // Excluir atributos de la tabla intermedia
                        }
                    ]
                }
            );
            if (!exams) {
                throw new Error(`${this.class} no encontrado`);
            } else {
                return exams;
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async getAllForAdmin() {
        try {

            const models = await this.models.exam.findAll(
                {
                    include: [                        
                        {
                            model: this.models.determination,
                            as: 'determinations',
                            through: { attributes: [] },
                        }
                    ]
                }
            );
            const plainModels = models.map(model => model.get({ plain: true }));
            return plainModels;
        } catch (error) {
            return JSON.stringify({ "error": error });
        }
    }
    async getAll(req, res) {
        try {
            const exams = await this.models.exam.findAll(
                {
                    include: [
                        {
                            model: this.models.sampleType,
                            as: 'sampleType',
                        },
                        {
                            model: this.models.determination,
                            as: 'determinations',
                            through: { attributes: [] }, // Excluir atributos de la tabla intermedia
                        }
                    ]
                }
            );
            if (!exams) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(exams.dataValues, this.class, true);
                res.status(200).json(exams);
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
            const exam = await this.models.exam.findByPk(
                id,
                {
                    include: {
                        model: this.models.sampleType,
                        as: 'sampleType',
                    }
                }
            );
            if (!exam) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(exam.dataValues, this.class, true);
                res.status(200).json(exam);
            }
        } catch (error) {
            console.log(error, `${this.class} no encontrado`);
            res.status(500).json({ error: `Error al obtener ${this.class}` });
        }
    }
}

export default ExamController;

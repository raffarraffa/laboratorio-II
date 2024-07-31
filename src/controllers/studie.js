import Controller from './controller.js';
import { Utils } from '../utils/utils.js';

class StudieController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }

    Test(req, res) {
        res.send('Hello Worldddd!');
    }
    async examsDistinctFromAdmin() {
        const studies = await this.models.studie.sequelize.query(
            'CALL getDistinctExams()');
        console.log(studies);
        return studies;
    }
    async determinationsDistinctFromAdmin() {
        const determination = await this.models.studie.sequelize.query(
            'CALL `getDistinctDeteminations`()');
        console.log('*******************************************determination **********************');
        console.log(determination);
        return determination;
    }
    async getAll(req, res) {
        try {
            const studies = await this.models.studie.findAll(
                {
                    include: [
                        {
                            model: this.models.order,
                            as: 'order',
                        },
                        {
                            model: this.models.exam,
                            as: 'exam',
                        }
                    ]
                }
            );

            if (!studies) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(studies.dataValues, this.class, true);
                res.status(200).json(studies);
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
            const studie = await this.models.studie.findByPk(
                id,
                // {
                //     include: {
                //         model: this.models.order,
                //         as: 'orders',
                //     }
                // }
            );
            if (!studie) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(studie.dataValues, this.class, true);
                res.status(200).json(studie);
            }
        } catch (error) {
            console.log(error, `${this.class} no encontrado`);
            res.status(500).json({ error: `Error al obtener ${this.class}` });
        }
    }
}

export default StudieController;

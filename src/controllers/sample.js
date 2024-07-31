import Controller from './controller.js';
import { Utils } from '../utils/utils.js';

class SampleController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }

    Test(req, res) {
        res.send('Hello Worldddd!');
    }
    async samplesDistinctFromAdmin() {
        const samples = await this.models.sample.sequelize.query(
            'CALL `getDistinctSamples`();');
        console.log(samples);
        const samplesIdsInUse = samples.map(model => model.samples_type_id);
        return samplesIdsInUse;
    }


    async getAll(req, res) {
        try {
            const samples = await this.models.sample.findAll();
            if (!samples) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(samples.dataValues, this.class, true);
                res.status(200).json(samples);
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
            const sample = await this.models.sample.findByPk(
                id,
                // {
                //     include: {
                //         model: this.models.order,
                //         as: 'orders',
                //     }
                // }
            );
            if (!sample) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(sample.dataValues, this.class, true);
                res.status(200).json(sample);
            }
        } catch (error) {
            console.log(error, `${this.class} no encontrado`);
            res.status(500).json({ error: `Error al obtener ${this.class}` });
        }
    }
}

export default SampleController;

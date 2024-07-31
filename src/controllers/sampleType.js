import Controller from './controller.js';
import { Utils } from '../utils/utils.js';

class SampleTypeController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }

    Test(req, res) {
        res.send('Hello Worldddd!');
    }
    async createSampleType(req, res) {
        const { name, description } = req.body;

        try {
            const sampleType = await this.models.sampleType.create({
                name,
                description
            });

            res.status(201).json(sampleType);
        } catch (error) {
            console.log(error);
        }
    }

    async getAll(req, res) {
        try {
            const sampleTypes = await this.models.sampleType.findAll();
            if (!sampleTypes) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(sampleTypes.dataValues, this.class, true);
                res.status(200).json(sampleTypes);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    async getAllForAdmin() {
        try {
            const models = await this.models.sampleType.findAll();
            const sampleTypes = models.map(model => {
                return {
                    ...model.get({ plain: true }),
                }
            });
            return sampleTypes;
        }
        catch (error) {
            console.log(error);
        }
    }
    async getById(req, res) {
        try {

            const id = req.params.id;
            Utils.debug(id, this.class, true);
            const sampleType = await this.models.sampleType.findByPk(
                id,
                // {
                //     include: {
                //         model: this.models.order,
                //         as: 'orders',
                //     }
                // }
            );
            if (!sampleType) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(sampleType.dataValues, this.class, true);
                res.status(200).json(sampleType);
            }
        } catch (error) {
            console.log(error, `${this.class} no encontrado`);
            res.status(500).json({ error: `Error al obtener ${this.class}` });
        }
    }
}

export default SampleTypeController;

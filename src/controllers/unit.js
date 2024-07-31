import Controller from './controller.js';
import { Utils } from '../utils/utils.js';

class UnitController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }

    Test(req, res) {

        res.send('Hello Worldddd!');
    }
    async createUnit(req, res) {
        const { name, unit } = req.body;
        try {
            const unitCreated = await this.models.unit.create({ name, unit });

            res.status(201).json(unitCreated);

        } catch (error) {
            console.log(error);
        }
    }
    async getAllForAdmin() {
        try {

            const models = await this.models.unit.findAll();
            const plainModels = models.map(model => model.get({ plain: true }));
            return plainModels;

        } catch (error) {

            return JSON.stringify({ "error": error });

        }
    }
    async getAll2(req, res) {
        console.log(req.body);

        //{ action: 'create', name: 'ggg', unit: 'rt5' }
        const unitController = new UnitController();

        const unidades = await this.models.unit.create({
            name: req.body.name,
            unit: req.body.unit
        });
        res.send('sdfgsg');
    }

}

export default UnitController;

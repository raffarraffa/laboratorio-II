import Controller from './controller.js';
import { Utils } from '../utils/utils.js';

class CityController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }

    Test(req, res) {
        res.send('Hello Worldddd!');
    }

    async getAll(req, res) {
        try {
            const citys = await this.models.city.findAll(
                // {
                //     include: {
                //         model: this.models.city,
                //         include: {
                //             model: this.models.state,
                //             attributes: ['name'],
                //             as: 'state',
                //         },
                //         attributes: ['name'],
                //         as: 'city',
                //     }
                // }
            );
            if (!citys) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                //    Utils.debug(citys.dataValues, this.class, true);
                res.status(200).json(citys);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    // peticones para formularios, devuelve las ciudades
    async getAll2() {
        try {
            const citys = await this.models.city.findAll({
                attributes: ['id', 'name'],
                order: [['name', 'ASC']]
            });
            if (!citys) {
                throw new Error(`${this.class} no encontrado`);
            } else {
                //    Utils.debug(citys.dataValues, this.class, true);
                return citys;
            }
        }
        catch (error) {
            console.log(error);
        }
    }

}

export default CityController;

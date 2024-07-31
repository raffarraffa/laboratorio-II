import Controller from './controller.js';
import { Utils } from '../utils/utils.js';

class DefaultController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }
    Test(req, res) {
        console.log(error, `${this.class} no encontrado`);
        res.status(500).json({ error: `Error al obtener ${this.class}` });
    }

}
export default DefaultController;

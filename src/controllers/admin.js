import Controller from './controller.js';
import { Utils } from '../utils/utils.js';
import ExamController from './exam.js';
import DeterminationController from './determination.js';
import ReferenceValueController from './referenceValue.js';
import SampleTypeController from './sampleType.js';
import SampleController from './sample.js';
import StudieController from './studie.js';
import UnitController from './unit.js';

class AdminController extends Controller {
    constructor() {
        super();
        this.class = Utils.getClassName();
        Utils.debug(this.class);
    }
    async getAll(req, res) {
        const user = req.session.user;
        // examens
        const examController = new ExamController();
        const exams = await examController.getAllForAdmin();
        console.log('******************************************************************************************************************************************');
        exams.forEach(exam => console.log(exam.determinations));

        console.log('******************************************************************************************************************************************');

        // dteminaciones
        const determinationController = new DeterminationController();
        const determinations = await determinationController.getAllForAdmin();

        // references values
        const referenceValueController = new ReferenceValueController();
        const referenceValues = await referenceValueController.getAllForAdmin();

        // units 
        const unitController = new UnitController();
        const units = await unitController.getAllForAdmin();


        // samples
        const sampleTypeController = new SampleTypeController();
        const sampleType = await sampleTypeController.getAllForAdmin();

        // examenes en suo por ordenes par aevitar borrado o edicion
        // studies se requiren  paa verificar los examenes en uso
        const studieController = new StudieController();
        const examsInUse = await studieController.examsDistinctFromAdmin();
        const examIdsInUse = examsInUse.map(exam => exam.exams_id);

        // determinaciones en uso
        const determinationInUse = await studieController.determinationsDistinctFromAdmin();
        const determinationIdsInUse = determinationInUse.map(determ => determ.determinations_id);
        // samples en uso
        const sampleController = new SampleController();
        const samplesIdsInUse = await sampleController.samplesDistinctFromAdmin();

        //SELECT DISTINCT determinations_id from `determinations_exams`,studies WHERE determinations_exams.exams_id = studies.exams_id
        const adminData = {
            'exams': exams,
            'determinations': determinations,
            'referenceValues': referenceValues,
            'units': units,
            'examsInUse': examIdsInUse,
            'determinationsInUse': determinationIdsInUse,
            'sampleType': sampleType,
            'samplesInUse': samplesIdsInUse
        }
        console.log(adminData);

        res.render('admin.pug', { adminData: adminData, title: 'Express', user: user });
    }
    Test(req, res) {
        res.send('Hello Worldddd!');
    }


}
export default AdminController;

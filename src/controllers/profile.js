import Controller from './controller.js';
import { Utils } from '../utils/utils.js';

class ProfileController extends Controller {
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
            const profiles = await this.models.profile.findAll(
                {
                    where: {

                        //                status: 'Activa', 

                    },

                    include: [{
                        model: this.models.user,
                        as: 'users',
                    },
                        // {
                        //     model: this.models.doctor,
                        //     as: 'doctor',
                        // },
                        // {
                        //     model: this.models.diagnosis,
                        //     as: 'diagnosis',
                        // },
                        // {
                        //     model: this.models.sample,
                        //     as: 'samples',
                        //     include: {
                        //         model: this.models.sampleType,
                        //         as: 'sampleType',
                        //     },
                        // },
                        // {
                        //     model: this.models.studie,
                        //     as: 'studies',
                        //     include:
                        //     {
                        //         model: this.models.exam,
                        //         as: 'exam',
                        //     }

                        // }
                    ]

                }
            );


            if (profiles.length == 0) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(profiles.dataValues, this.class, true);
                res.status(200).json(profiles);
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
            const profile = await this.models.profile.findByPk(
                id,
                {
                    include: {
                        model: this.models.user,
                        as: 'users',
                    }
                }
            );
            if (!profile) {
                res.status(404).json({ error: `${this.class} no encontrado` });
            } else {
                Utils.debug(profile.dataValues, this.class, true);
                res.status(200).json(profile);
            }
        } catch (error) {
            console.log(error, `${this.class} no encontrado`);
            res.status(500).json({ error: `Error al obtener ${this.class}` });
        }
    }
}

export default ProfileController;

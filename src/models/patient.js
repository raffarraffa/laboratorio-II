import { Model, DataTypes, Utils } from 'sequelize';
import { z } from 'zod';
class Patient extends Model {

    static async findById_old(id) { // solocomoejemplo 
        return this.findByPk(id);
    }
    static async findById(id) {
        try {
            const patient = await this.findByPk(id, {
                include: [
                    {
                        model: this.sequelize.models.city, // Verifica si este modelo está correctamente definido
                        as: 'city',
                        include: [
                            {
                                model: this.sequelize.models.state, // Verifica si este modelo está correctamente definido
                                as: 'state',
                                attributes: ['name']
                            }
                        ],
                        attributes: ['name']
                    }
                ]
            });

            if (!patient) {
                return { error: `${id} no encontrado` };
            } else {
                patient.edad = Utils.calcularEdad(patient.birth_at);
                return patient;
            }
        } catch (error) {
            console.error(error, `Patient no encontrado`);
            throw new Error(`Error al obtener Patient`);
        }
    }
    static async findById_bad(id) {
        try {

            const patient = await this.findByPk(id, {
                include: {
                    model: this.models.city,
                    as: 'city',
                    include: {
                        model: this.sequelize.models.state,
                        as: 'state',
                        attributes: ['name']
                    },
                    attributes: ['name']
                }
            });

            if (!patient) {
                return { error: `${id} no encontrado` };
            } else {
                patient.edad = Utils.calcularEdad(patient.birth_at);
                return patient;
            }
        } catch (error) {
            console.error(error, `Patient no encontrado`);
            throw new Error(`Error al obtener Patient`);
        }
    }
    // validación con Zod
    static isValidModel(data) {
        const schema = z.object({
            first_name: z.string().max(80),
            last_name: z.string().max(80),
            sex: z.enum(['M', 'F']),
            active: z.string().transform(val => parseInt(val, 10)).refine(val => val === 0 || val === 1,
                {
                    message: 'active debe ser 0 o 1'
                }),

            document: z.string().max(9),
            phone: z.string().max(15),
            email: z.string().email().max(80),
            address: z.string().max(80),
            birth_at: z.string().optional(),
            password: z.string().max(80).optional(),
            pregnant: z.number().int().refine(val => val === 0 || val === 1).optional(),
            citys_id: z.string().transform(val => parseInt(val, 10)).refine(val => val === 0 || val === 1, {
                message: 'city_id debe ser un numero'
            }),
        });
        return schema.safeParse(data);
    }

    static initModel(sequelize) {
        Patient.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true
            },
            first_name: {
                type: DataTypes.STRING(80),
                allowNull: false
            },
            last_name: {
                type: DataTypes.STRING(80),
                allowNull: false
            },
            sex: {
                type: DataTypes.ENUM('M', 'F'),
                allowNull: false
            },
            active: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 1,
                comment: "0: inactivo, 1: activo"
            },
            document: {
                type: DataTypes.STRING(9),
                allowNull: false
            },
            phone: {
                type: DataTypes.STRING(15),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(80),
                allowNull: false
            },
            address: {
                type: DataTypes.STRING(80),
                allowNull: false
            },
            birth_at: {
                type: DataTypes.STRING,
                allowNull: true
            },
            password: {
                type: DataTypes.STRING(80),
                allowNull: true
            },
            pregnant: {
                type: DataTypes.TINYINT,
                allowNull: true
            },
            users_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },

            citys_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'citys',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            modelName: 'patient',
            tableName: 'patients',
            freezeTableName: false, // bloquea pluralización
            timestamps: false, // Desactiva createdAt y updatedAt
            underscored: true, // snake_case en la base de datos
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "id" },
                    ]
                },
                {
                    name: "fk_employees_citys1_idx",
                    using: "BTREE",
                    fields: [
                        { name: "citys_id" },
                    ]
                },
            ]
        });
        return Patient;
    }
}
export default Patient;
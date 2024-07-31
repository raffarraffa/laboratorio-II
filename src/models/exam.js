import { Model, DataTypes } from 'sequelize';
class Exam extends Model {
    static async findById(id) { // solocomoejemplo 
        return this.findByPk(id);
    }
    // static async findAll() {
    //     const exams = await this.findAll(
    //         {
    //             include: [
    //                 {
    //                     model: this.models.sampleType,
    //                     as: 'sampleType',
    //                 }
    //             ]
    //         }
    //     );
    // }

    static initModel(sequelize) {
        Exam.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true
            },
            nbu: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                unique: "nbu"
            },
            detail: {
                type: DataTypes.STRING(250),
                allowNull: false
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            },
            time: {
                type: DataTypes.TINYINT,
                allowNull: false,
                comment: " tiempo de obtencion resultado"
            },
            samples_type_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'sample_types',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            modelName: 'Exam',
            tableName: 'exams',
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
                    name: "nbu",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "nbu" },
                    ]
                },
                {
                    name: "fk_exams_samples_type1_idx",
                    using: "BTREE",
                    fields: [
                        { name: "samples_type_id" },
                    ]
                },
            ]
        });
        return Exam;
    }
}
export default Exam;
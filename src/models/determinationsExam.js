// determinationexam.js
import { DataTypes, Model } from 'sequelize';
class DeterminationsExam extends Model {
    static initModel(sequelize) {
        DeterminationsExam.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    primaryKey: true
                },
                determinations_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'determinations',
                        key: 'id'
                    }
                },
                exams_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'exams',
                        key: 'id'
                    }
                }
            },
            {
                sequelize,
                modelName: 'DeterminationExam', // Nombre del modelo en singular
                tableName: 'determinations_exams',
                freezeTableName: false, // bloquea pluralización
                timestamps: false, // Desactiva createdAt y updatedAt
                underscored: true, // snake_case en la base de datos
                charset: 'utf8mb4',
                collate: 'utf8mb4_general_ci',
                indexes: [
                    {
                        name: "fk_determinations_exams_determinations1_idx",
                        using: "BTREE",
                        fields: [
                            { name: "determinations_id" },
                        ]
                    },
                    {
                        name: "fk_determinations_exams_exams1_idx",
                        using: "BTREE",
                        fields: [
                            { name: "exams_id" },
                        ]
                    },
                ]
            });
        return DeterminationsExam;
    }
}
export default DeterminationsExam;

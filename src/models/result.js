// state.js
import { DataTypes, Model } from 'sequelize';
class Result extends Model {
    static initModel(sequelize) {
        Result.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true
                },
                value: {
                    type: DataTypes.STRING(150),
                    allowNull: true
                },
                reference_values_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'reference_values',
                        key: 'id'
                    }
                },
                determinations_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'determinations',
                        key: 'id'
                    }
                },
                users_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: true,
                    references: {
                        model: 'users',
                        key: 'id'
                    }
                },
                studies_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'studies',
                        key: 'id'
                    }
                }
            },
            {
                sequelize,
                modelName: 'Result', // Nombre del modelo en singular
                tableName: 'results',
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
                        name: "fk_results_reference_values1_idx",
                        using: "BTREE",
                        fields: [
                            { name: "reference_values_id" },
                        ]
                    },
                    {
                        name: "fk_results_determinations1_idx",
                        using: "BTREE",
                        fields: [
                            { name: "determinations_id" },
                        ]
                    },
                    {
                        name: "fk_results_studies1_idx",
                        using: "BTREE",
                        fields: [
                            { name: "studies_id" },
                        ]
                    },
                ]
            });
        return Result;
    }
}
export default Result;

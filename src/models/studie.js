// state.js
import { DataTypes, Model } from 'sequelize';
class Studie extends Model {
    static initModel(sequelize) {
        Studie.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    primaryKey: true
                },
                exams_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'exams',
                        key: 'id'
                    }
                },
                orders_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'orders',
                        key: 'id'
                    }
                }
            },
            {
                sequelize,
                modelName: 'Studie', // Nombre del modelo en singular
                tableName: 'studies',
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
                        name: "fk_studies_exams1_idx",
                        using: "BTREE",
                        fields: [
                            { name: "exams_id" },
                        ]
                    },
                    {
                        name: "fk_studies_orders1_idx",
                        using: "BTREE",
                        fields: [
                            { name: "orders_id" },
                        ]
                    },
                ]
            });
        return Studie;
    }
}
export default Studie;

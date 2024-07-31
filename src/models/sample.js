// samples.js
import { DataTypes, Model } from 'sequelize';
class Sample extends Model {
    static initModel(sequelize) {
        Sample.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    primaryKey: true
                },
                samples_type_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'samples_type',
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
                },
                status: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                    defaultValue: sequelize.fn('unix_timestamp')
                }
            },
            {
                sequelize,
                modelName: 'Sample', // Nombre del modelo en singular
                tableName: 'samples',
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
                        name: "samples_type_id",
                        unique: true,
                        using: "BTREE",
                        fields: [
                            { name: "samples_type_id" },
                            { name: "orders_id" },
                            { name: "status" },
                        ]
                    },
                    {
                        name: "fk_samples_samples_type1_idx",
                        using: "BTREE",
                        fields: [
                            { name: "samples_type_id" },
                        ]
                    },
                    {
                        name: "fk_samples_orders1_idx",
                        using: "BTREE",
                        fields: [
                            { name: "orders_id" },
                        ]
                    },
                ]
            });
        return Sample;
    }
}
export default Sample;

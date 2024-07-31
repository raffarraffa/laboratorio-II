// order.js
import { DataTypes, Model } from 'sequelize';
class Order extends Model {
    static initModel(sequelize) {
        Order.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    primaryKey: true
                },
                observation: {
                    type: DataTypes.STRING(250),
                    allowNull: true
                },
                status: {
                    type: DataTypes.ENUM('Inactiva', 'Activa', 'Ingresada', 'Toma Muestra', 'Analitica', 'Para firma', 'Firmada'),
                    allowNull: true,
                    defaultValue: "Ingresada"
                },
                delivered: {
                    type: DataTypes.DATE,
                    allowNull: true
                },
                doctorsId: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'doctors',
                        key: 'id'
                    }
                },
                diagnosisId: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'diagnosis',
                        key: 'id'
                    }
                },
                patientsId: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'patients',
                        key: 'id'
                    }
                },
                usersId: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id'
                    }
                },
                // created_at: {
                //     type: DataTypes.DATE,
                //     allowNull: true
                // },
                // updated_at: {
                //     type: DataTypes.DATE,
                //     allowNull: true
                // }

            },
            {
                sequelize,
                modelName: 'Order', // Nombre del modelo en singular
                tableName: 'orders',
                freezeTableName: false, // bloquea pluralización
                timestamps: true, // Desactiva createdAt y updatedAt
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
                        name: "fk_orders_doctors1_idx",
                        using: "BTREE",
                        fields: [
                            { name: "doctors_id" },
                        ]
                    },
                    {
                        name: "fk_orders_diagnosis1_idx",
                        using: "BTREE",
                        fields: [
                            { name: "diagnosis_id" },
                        ]
                    },
                    {
                        name: "fk_orders_patients1_idx",
                        using: "BTREE",
                        fields: [
                            { name: "patients_id" },
                        ]
                    },
                    {
                        name: "fk_orders_employees1_idx",
                        using: "BTREE",
                        fields: [
                            { name: "users_id" },
                        ]
                    },
                ]
            });
        return Order;
    }
}
export default Order;

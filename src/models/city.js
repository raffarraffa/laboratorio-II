// city.js
import { DataTypes, Model } from 'sequelize';
class City extends Model {
    static initModel(sequelize) {
        City.init(
            {
                id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    primaryKey: true,
                    allowNull: false,
                    autoIncrement: true,
                },
                name: {
                    type: DataTypes.STRING(80),
                    allowNull: false,
                },
                statesId: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'states',
                        key: 'id',
                    },
                },
            },
            {
                sequelize,
                modelName: 'City', // Nombre del modelo en singular
                tableName: 'citys',
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
                        name: "fk_citys_states1_idx",
                        using: "BTREE",
                        fields: [
                            { name: "states_id" },
                        ]
                    },
                ]
            });
        return City;
    }
}
export default City;

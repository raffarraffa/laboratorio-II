// state.js
import { DataTypes, Model } from 'sequelize';
class State extends Model {
    static initModel(sequelize) {
        State.init(
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
            },
            {
                sequelize,
                modelName: 'State', // Nombre del modelo en singular
                tableName: 'states',
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
                ]
            });
        return State;
    }
}
export default State;

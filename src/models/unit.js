// unit.js
import { DataTypes, Model } from 'sequelize';
class Unit extends Model {
    static initModel(sequelize) {
        Unit.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    primaryKey: true
                },
                name: {
                    type: DataTypes.STRING(45),
                    allowNull: false
                },
                unit: {
                    type: DataTypes.STRING(20),
                    allowNull: true
                }
            },
            {
                sequelize,
                modelName: 'Unit', // Nombre del modelo en singular
                tableName: 'units',
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
        return Unit;
    }
}
export default Unit;

// determination.js
import { DataTypes, Model } from 'sequelize';
class Determination extends Model {
    static initModel(sequelize) {
        Determination.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    primaryKey: true
                },
                name: {
                    type: DataTypes.STRING(150),
                    allowNull: true
                },
                observation: {
                    type: DataTypes.STRING(250),
                    allowNull: true
                },
                reference_default: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: true
                },
                active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true
                }
            },
            {
                sequelize,
                modelName: 'Determination', // Nombre del modelo en singular
                tableName: 'determinations',
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
        return Determination;
    }
}
export default Determination;

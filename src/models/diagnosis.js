// diagnosis.js
import { DataTypes, Model } from 'sequelize';
class Diagnosis extends Model {
    static initModel(sequelize) {
        Diagnosis.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    primaryKey: true
                },
                codigo: {
                    type: DataTypes.STRING(5),
                    allowNull: false
                },
                name: {
                    type: DataTypes.STRING(200),
                    allowNull: false
                }
            },
            {
                sequelize,
                modelName: 'Diagnosis', // Nombre del modelo en singular
                tableName: 'diagnosis',
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
        return Diagnosis;
    }
}
export default Diagnosis;

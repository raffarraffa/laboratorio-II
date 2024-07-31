// samplestype.js
import { DataTypes, Model } from 'sequelize';
class SampleType extends Model {
    static initModel(sequelize) {
        SampleType.init(
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
                description: {
                    type: DataTypes.STRING(150),
                    allowNull: false
                },
                active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: 1
                }
            },
            {
                sequelize,
                modelName: 'SamplesType', // Nombre del modelo en singular
                tableName: 'sample_types',
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
        return SampleType;
    }
}
export default SampleType;

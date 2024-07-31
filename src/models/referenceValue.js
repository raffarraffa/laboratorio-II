// referencevalue.js
import { DataTypes, Model } from 'sequelize';
class ReferenceValue extends Model {
    static initModel(sequelize) {
        ReferenceValue.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    primaryKey: true
                },
                sex: {
                    type: DataTypes.ENUM('M', 'F'),
                    allowNull: true
                },
                age_min: {
                    type: DataTypes.INTEGER,
                    allowNull: true
                },
                age_max: {
                    type: DataTypes.INTEGER,
                    allowNull: true
                },
                pregnant: {
                    type: DataTypes.TINYINT.UNSIGNED,
                    allowNull: false,
                    defaultValue: 0
                },
                value_max: {
                    type: DataTypes.DECIMAL(6, 2),
                    allowNull: true,
                    comment: "alor max poible"
                },
                value_min: {
                    type: DataTypes.DECIMAL(6, 2),
                    allowNull: true,
                    comment: "Valor minimo posible"
                },
                value_ref_max: {
                    type: DataTypes.DECIMAL(6, 2),
                    allowNull: false,
                    comment: "valor max para persana sana"
                },
                value_ref_min: {
                    type: DataTypes.DECIMAL(6, 2),
                    allowNull: false,
                    comment: "valo rmin para persona sana"
                },
                units_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: true,
                    references: {
                        model: 'units',
                        key: 'id'
                    }
                },
                observation: {
                    type: DataTypes.STRING(250),
                    allowNull: true
                },
                active: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: 1,
                    comment: "0: inactivo 1 activo"
                },
                dflt: {
                    type: DataTypes.BOOLEAN,
                    allowNull: true,
                    defaultValue: null,
                },
                determinations_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'determinations',
                        key: 'id'
                    }
                }
            },
            {
                sequelize,
                modelName: 'ReferenceValue', // Nombre del modelo en singular
                tableName: 'reference_values',
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
                        name: "units_id",
                        using: "BTREE",
                        fields: [
                            { name: "units_id" },
                        ]
                    },
                    {
                        name: "fk_reference_values_determinations1_idx",
                        using: "BTREE",
                        fields: [
                            { name: "determinations_id" },
                        ]
                    }
                ]
            });
        return ReferenceValue;
    }
}
export default ReferenceValue;

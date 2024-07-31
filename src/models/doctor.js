import { Model, DataTypes } from 'sequelize';
class Doctor extends Model {
    static async findById(id) { // solocomoejemplo 
        return this.findByPk(id);
    }

    static initModel(sequelize) {
        Doctor.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true
            },
            first_name: {
                type: DataTypes.STRING(80),
                allowNull: false
            },
            last_name: {
                type: DataTypes.STRING(45),
                allowNull: false
            },
            license: {
                type: DataTypes.STRING(45),
                allowNull: true
            },
            phone: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        }, {
            sequelize,
            modelName: 'Doctor',
            tableName: 'doctors',
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
        return Doctor;
    }
}
export default Doctor;
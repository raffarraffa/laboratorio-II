import { Model, DataTypes } from 'sequelize';
class User extends Model {
    static async findById(id) { // solocomoejemplo 
        return this.findByPk(id);
    }
    static async findByEmail(email) {
        return this.findOne({ where: { email } });
    }
    validarPassword(password) {
        return password === this.password; // Simplificación, asegúrate de usar hashing en producción
    }

    static initModel(sequelize) {
        User.init({
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true
            },
            firstName: {
                type: DataTypes.STRING(80),
                allowNull: false
            },
            lastName: {
                type: DataTypes.STRING(80),
                allowNull: false
            },
            document: {
                type: DataTypes.STRING(9),
                allowNull: false
            },
            phone: {
                type: DataTypes.STRING(15),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(80),
                allowNull: false
            },
            address: {
                type: DataTypes.STRING(80),
                allowNull: false
            },
            password: {
                type: DataTypes.STRING(80),
                allowNull: false,
                defaultValue: "1234"
            },
            active: {
                type: DataTypes.TINYINT.UNSIGNED,
                allowNull: false
            },
            entryDate: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            citysId: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: 'citys',
                    key: 'id'
                }
            }
        }, {
            sequelize,
            modelName: 'User',
            tableName: 'users',
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
                    name: "fk_employees_citys1_idx",
                    using: "BTREE",
                    fields: [
                        { name: "citys_id" },
                    ]
                },
            ]
        });
        return User;
    }
}
export default User;
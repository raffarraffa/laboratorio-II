// profiles.js
import { DataTypes, Model } from 'sequelize';
class Profile extends Model {
    static initModel(sequelize) {
        Profile.init(
            {
                id: {
                    autoIncrement: true,
                    type: DataTypes.TINYINT.UNSIGNED,
                    allowNull: false,
                    primaryKey: true
                },
                active: {
                    type: DataTypes.TINYINT.UNSIGNED,
                    allowNull: false,
                    defaultValue: 1
                },
                access_auth: {
                    type: DataTypes.TINYINT.UNSIGNED,
                    allowNull: false
                },
                name: {
                    type: DataTypes.STRING(80),
                    allowNull: false
                },
                license: {
                    type: DataTypes.STRING(45),
                    allowNull: true
                },
                users_id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id'
                    }
                }
            },
            {
                sequelize,
                modelName: 'Profile', // Nombre del modelo en singular
                tableName: 'profiles',
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
                        name: "fk_profiles_users1_idx",
                        using: "BTREE",
                        fields: [
                            { name: "users_id" },
                        ]
                    },
                ]
            });
        return Profile;
    }
}
export default Profile;

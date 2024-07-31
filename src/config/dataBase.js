// Database.js
import { Op, Sequelize } from 'sequelize';

class DataBase {
    constructor(database, username, password, options) {
        this.sequelize = new Sequelize(database, username, password, options);
    }

    connect() {
        return this.sequelize.authenticate()
            .then(() => {
                console.log('Conexión a la base de datos establecida correctamente.');
            })
            .catch(error => {
                console.error('Error al conectar a la base de datos:', error);
            });
    }
    async startTransaction() {
        try {
            const t = await this.sequelize.transaction();
            return t;
        } catch (error) {
            console.error('Error al iniciar la transacción:', error);
            throw error;
        }
    }
}
export default DataBase;

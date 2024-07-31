import DataBase from "../config/dataBase.js";
import InitModels from "../models/initModels.js";
import puppeteer from 'puppeteer';
import { Utils } from "../utils/utils.js";
import 'dotenv/config';

class Controller {

    constructor() {
        const dbName = process.env.DB_NAME_REMOTO;
        const dbUser = process.env.DB_USER_REMOTO;
        const dbPassword = process.env.DB_PASSWORD_REMOTO;
        const dbHost = process.env.DB_HOST_REMOTO;
        const dbDialect = process.env.DB_DIALECT_REMOTO;
        this.dataBase = new DataBase(dbName, dbUser, dbPassword, { host: dbHost, dialect: dbDialect });
        this.models = InitModels.getModels(this.dataBase.sequelize);
        this.class = Utils.getClassName();
    }
    /**
 * Verifica si el usuario tiene acceso a un recurso específico en función de su rol.
 *
 * @param {Object} req - El objeto de solicitud que contiene el rol del usuario.
 * @param {string} accessReq - El nombre del recurso al que se desea verificar el acceso.
 * @return {boolean} Retorna true si el usuario tiene acceso al recurso, false en caso contrario.
 */
    accessRolAuth(req, reqAccess) {
        const authAccess = req.session.user.roles.some(role => role.name === reqAccess);
        return authAccess;
    }

    static async generatePdf(html) {
        try {
            // Usa Puppeteer para convertir el HTML a PDF
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setContent(html);
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                displayHeaderFooter: true,
                headerTemplate: `
                    <div style="font-size: 10px; width: 100%; text-align: center;">
                        Encabezado del PDF
                    </div>
                `,
                footerTemplate: `
                    <div style="font-size: 10px; width: 100%; text-align: center;">
                        Página <span class="pageNumber"></span> de <span class="totalPages"></span>
                    </div>
                `
            });
            await browser.close();

            return pdfBuffer;
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            throw new Error('Error al generar el PDF');
        }
    }
}
export default Controller; 
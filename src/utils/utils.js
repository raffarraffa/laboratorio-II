// src/utils/utils.js
import 'dotenv/config';
const DEV = process.env.DEV === 'true' ? true : false;
import puppeteer from "puppeteer";
import crypto from "crypto";
// Configuración de cifrado
const ALGORITHM = process.env.ALGORITHM;
if (!ALGORITHM) {
    throw new Error('Environment variable ALGORITHM is not defined');
}

const KEY = process.env.KEY;
if (!KEY) {
    throw new Error('Environment variable KEY is not defined');
}

const IV = process.env.IV;
if (!IV) {
    throw new Error('Environment variable IV is not defined');
}


export class Utils {
    static numRand() {
        return Math.floor(Math.random() * 100);
    }

    static getClassName = () => {
        const stack = new Error().stack.split('\n');
        const callerLine = stack[2].trim();
        const callerFileName = callerLine.match(/\((.*):\d+:\d+\)/)[1];
        const fileName = callerFileName.substring(callerFileName.lastIndexOf('/') + 1).replace(/\.js$/, '');
        return fileName;
    }
    static debug = (message, call = 'Anonimo', active = DEV) => {
        if (DEV || active) {
            console.log(` __________________  ${call} __________________`);
            console.log(` ${message}`);
            console.log(' ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ̅ ');
        }
    }
    /**
     * Calcula la edad basada en la fecha de nacimiento proporcionada.
     *
     * @param {string} fecha - La fecha de nacimiento en formato 'AAAA-MM-DD'.
     * @return {number} La edad calculada.
     */
    static calcularEdad(fecha) {
        this.debug(typeof fecha);
        const hoy = new Date();
        const cumple = new Date(fecha);
        let edad = hoy.getFullYear() - cumple.getFullYear();
        const m = hoy.getMonth() - cumple.getMonth();
        // fverifica si ya cumplio hoy
        if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
            edad--;
        }
        return edad;
    }
    /**
     * Una función para obtener datos temporales de la sesión.
     *
     * @param {Object} req - El objeto de solicitud.
     * @param {string} param - El parámetro para recuperar de la sesión.
     * @return {any} Los datos recuperados de la sesión.
     */
    static getTempData(req) {
        const data = req.session.tempData ? req.session.tempData : null;
        req.session.tempData = null;
        return data
    }

    /**
     * Establece datos temporales en la sesión para usar en otro controlador.
     * @param {false} en caso que no data se establezca el valor de la variable
     * @param {Object} req - El objeto de solicitud.
     * @param {string} param - El parámetro para establecer en la sesión.
     * @param {any} data - Los datos que se establecerán en la sesión.
     * @return {boolean} Indica si los datos se guardaron correctamente.
     */
    static setTempData(req, data) {
        if (data) {
            req.session.tempData = data;
            return true;
        } else {
            req.session.tempData = false;
        }
        return false;
    }


    static async generatePdf(html, header = '') {
        try {
            // Usa Puppeteer para convertir el HTML a PDF
            const browser = await puppeteer.launch({
                headless: false,
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
                        ${header} - Encabezado del PDF
                    </div>
                `,
                footerTemplate: `
                    <div style="font-size: 10px; width: 100%; text-align: center;">
                        Página <span class="pageNumber"></span> de <span class="totalPages"></span>
                    </div>
                `
                ,
                margin: {
                    top: '20mm',
                    right: '20mm',
                    bottom: '20mm',
                    left: '20mm'

                }
            });
            await browser.close();

            return pdfBuffer;
        } catch (error) {
            console.error('Error al generar el PDF:', error);
            throw new Error('Error al generar el PDF');
        }
    }
    static getDateWithoutTime(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const dateAux = new Date(year, month, day);
        console.log(`FECHA ${dateAux}`);
        return dateAux;
    }
    static getDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        return `${year}-${month}-${day}`; // 	dateAux;
    }

    static encrypt(text) {
        let cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }
    static decrypt(text) {
        let decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
        let decrypted = decipher.update(text, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}

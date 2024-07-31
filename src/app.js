// src/app.js
import Server from "./server.js";
import 'dotenv/config';
global.DEV = process.env.DEV === 'true' ? true : false;
console.log(DEV);
class App {
    constructor() {
        this.server = new Server();
        this.server.startServer();
    }
}
export default new App;

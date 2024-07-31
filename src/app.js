// src/app.js
import Server from "./server.js";
global.DEV = 1;
const userRoles = [
    { access_auth: 2, name: 'Recepcion', license: null },
    { access_auth: 1, name: 'Bioquimico', license: null }
];

const reqRoles = ['SuperAdmin', 'Bioquimico'];

const hasReqRole = reqRoles.some(reqRole =>
    userRoles.some(userRole => userRole.name === reqRole)
);

console.log(hasReqRole);
class App {
    constructor() {
        this.server = new Server();
        this.server.startServer();
    }
}
export default new App;

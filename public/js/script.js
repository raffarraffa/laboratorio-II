console.log(tempData);
console.log(success);
console.log(error);
//notify.alertSucess(success, null, 1500);
//alertas
//notify.alertError('Error:', error, 2000);
if (error.length != '') {
    notify.alertError('Error:', error, 2000);
}
if (success.length != '') {
    notify.alertSucess(success, null, 1500);
}
//notify.alertSucess('linea7', null, 500);
//notify.alertError('Error', `Error: ${error}`, 2000);
//notify.alertError('Error', 'al carga paciente', 1000)

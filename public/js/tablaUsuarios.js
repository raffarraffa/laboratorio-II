const resultModal = new bootstrap.Modal(document.getElementById('responseModal'));
const resultDiv = document.getElementById('dataModal');
let currentNewScript = null;
document.addEventListener('DOMContentLoaded', function () {
    const table = document.querySelector('#tablaPacientes');
    if (table && typeof (DataTable) !== 'undefined') {
        new DataTable(table, {
            lengthMenu: [50, 25, 10, 5],
            responsive: true,
            paging: true,
            searching: true,
            //ordering: true,
            // language: {
            //     url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
            // },
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ Pacientes",
                "sZeroRecords": "No se encontro Paciente segun su busqueda, <button class='btn btn-outline-primary w-100.px-2 mx-0 my-1 mx-1' onclick='newPatient();'>Crear Paciente</button>",
                "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ paciente",
                "sInfoEmpty": "Mostrando 0 a 0 de 0 paciente",
                "sInfoFiltered": "(filtrado de _MAX_ paciente totales)",
                "sSearch": "Buscar:",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
            },
            "columnDefs": [
                { "orderable": false, "targets": [1] },
                { "searchable": false, "targets": [1] }
            ]
        });
    } else {
        document.querySelector('#tablaPacientes').innerHTML = 'DataTables no se ha cargado correctamente.';
    }
    const sexFemale = document.getElementById('female');
    sexFemale.addEventListener('change', (event) => {
        const labelPregnant = document.getElementById('labelPregnant');
        if (event.target.checked) {
            labelPregnant.classList.remove('d-none');
        } else {
            labelPregnant.classList.add('d-none');
        }
    });
    const sexMale = document.getElementById('male');
    sexMale.addEventListener('change', (event) => {
        const labelPregnant = document.getElementById('labelPregnant');
        if (event.target.checked) {
            labelPregnant.classList.add('d-none');
        } else {
            labelPregnant.classList.remove('d-none');
        }
    });
    if (tempData) { // verifico tempData
        // acciones con tempData
        //{patient_id: '4', doctorCreated: 6, action: 'newOrder', license: 'lic'}
        const dataAction = verifyTempData();   // verifico tempdata     
        if (dataAction.action == 'newOrder' && dataAction.patient_id > 0) {
            console.log(dataAction);
            const doctor_id = dataAction.doctorCreated || 0;
            newOrderPatient(dataAction.patient_id, doctor_id);

        }
    }
});
function autocompleteOff() {
    const inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
        //inputs[i].removeAttribute('autocomplete');
    }
}
/**
 * Edita de forma asíncrona la información de un paciente en la interfaz de usuario.
 *
 * @param {string} id - El ID del paciente a editar.
 * @return {Promise<void>} Una promesa que se resuelve cuando la información del paciente ha sido actualizada.
 */
async function editPatient(id) {
    const patient = await getData(`/patient/edit/${id}`, true);
    const labelPregnant = document.getElementById('labelPregnant');
    console.log(patient);
    const inputs = Array.from(document.querySelectorAll('input')).slice(1);


    inputs.forEach(input => {
        if (input.id === 'pregnant0' || input.id === 'pregnant1') {
            input.checked = patient.pregnant == input.value;
        } else if (input.id === 'female') {
            if (patient.sex == input.value) {
                labelPregnant.classList.remove('d-none');
                input.checked = true;
            }
        } else if (input.id === 'male') {
            if (patient.sex == input.value) {
                labelPregnant.classList.add('d-none');
                input.checked = true;
            }

        }
        else if (input.id !== 'city') {
            input.value = patient[input.id];
        } else {
            input.value = patient.city.name;
        }
    });

    modalDisplay('first_name');
}

async function deletePatient(id) {

    const confirmado = window.confirm('¿Está por borrar el paciente, seguro de que deseas continuar?');

    // Verificar la respuesta del usuario
    if (confirmado) {
        const deleteById = await getData(`/patient/delete/${id}`, true);
        if (deleteById == 'ok') {
            alert('Eliminado');
            location.reload();
        } else {
            alert('Error');
            location.reload();
        }
    }

}
async function editOrder(id) {
    // inicializo las tipos de muestras
    sampleTypeArray = [];
    // inicializo el div para mostar la orden
    resultDiv.innerHTML = '';
    const resultOrder = await getData(`/order/edit/${id}`, true);
    resultDiv.innerHTML = resultOrder;
    const scriptNew = resultDiv.getElementsByTagName('script')[0].src;
    console.log(scriptNew);
    if (currentNewScript) {
        document.head.removeChild(currentNewScript);
    }
    const script = document.createElement('script');
    script.src = scriptNew;
    document.head.appendChild(script);
    currentNewScript = script;
    script.onload = function () {
        functionOrderData();
    }
    resultModal.show();
}
async function firmarOrder(id) {
    // inicializo las tipos de muestras
    sampleTypeArray = [];
    // inicializo el div para mostar la orden
    resultDiv.innerHTML = '';
    const resultOrder = await getData(`/order/firmar/${id}`, true);
    resultDiv.innerHTML = resultOrder;
    const scriptNew = resultDiv.getElementsByTagName('script')[0].src;
    console.log(scriptNew);
    if (currentNewScript) {
        document.head.removeChild(currentNewScript);
    }
    const script = document.createElement('script');
    script.src = scriptNew;
    document.head.appendChild(script);
    currentNewScript = script;
    script.onload = function () {
        functionOrderData();
    }
    resultModal.show();
}

async function newResult(id) {
    // inicializo las tipos de muestras
    sampleTypeArray = [];
    // inicializo el div para mostar la orden
    resultDiv.innerHTML = '';
    const resultOrder = await getData(`/order/resultEdit/${id}`, true);
    resultDiv.innerHTML = resultOrder;
    const scriptNew = resultDiv.getElementsByTagName('script')[0].src;
    console.log(scriptNew);
    if (currentNewScript) {
        document.head.removeChild(currentNewScript);
    }
    const script = document.createElement('script');
    script.src = scriptNew;
    document.head.appendChild(script);
    currentNewScript = script;
    script.onload = function () {
        functionOrderData();
    }

    resultModal.show();

}
async function printOrder(id) {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const width = screenWidth * 0.5; // 50% del ancho de la pantalla
    const height = screenHeight * 0.8; // 80% del alto de la pantalla
    const left = ((screenWidth - width) / 5) * 4; // Centrar la ventana horizontalmente
    const top = (screenHeight - height) / 2; // Centrar la ventana verticalmente


    const printWindow = window.open(
        `http://localhost:8085/order/result/${id}`,
        '_blank',
        `toolbar=no,width=${width},height=${height},top=${top},left=${left},scrollbars=no`
    );
    printWindow.onload = function () {
        printWindow.print();
    };

}
async function newOrderPatient(id, doctor_id = false) {
    console.log(id);
    sampleTypeArray = [];
    resultDiv.innerHTML = '';
    const resultOrder = await getData(`/order/new/${id}/${doctor_id}`, true);
    resultDiv.innerHTML = resultOrder;
    const scriptNew = resultDiv.getElementsByTagName('script')[0].src;
    console.log(scriptNew);
    if (currentNewScript) {
        document.head.removeChild(currentNewScript);
    }
    const script = document.createElement('script');
    script.src = scriptNew;
    document.head.appendChild(script);
    currentNewScript = script;
    script.onload = function () {
        functionOrderData();
    }
    resultModal.show();
}
function newPatient() {
    const nameInput = document.getElementById('fist_name', true);
    modalDisplay(nameInput);
}
/**
 *  Function para mostrar modal 
 *
 * @param {boolean} focus - indica el elemnto para hacer focus si fuera necesario
 */
function modalDisplay(nameInput, focus = false) {
    const myModal = new bootstrap.Modal(document.getElementById('modalPaciente'));
    if (focus) {
        myModal._element.addEventListener('shown.bs.modal', function () {
            nameInput.focus();
        });
    }
    myModal.show();
}
/**
 * Funcion asincrona pàra hacer peticiones fetch adaptadas al contexto
 *
 * @param {string} url - url end point
 * @param {boolean} parse - Indica si fuera un json y queiro parseado o no
 * @return {Promise} retorna  una promesa
 */
async function getData(url, parse = false) {
    const controller = new AbortController();
    const signal = controller.signal;
    try {
        console.log(url);
        const response = await fetch(url, {
            credentials: 'include',
            redirect: 'manual',
            signal: signal
        });
        console.log(response.status);
        if (response.status === 0 || response.status == 0) {
            console.log('Redirección detectada. Cancelando la solicitud.');
            Swal.fire({
                icon: "error",
                title: 'Error',
                text: 'Sin permiso para acceder a esta seccion',
                footer: '<p>Sistema LIS ULP LAB2 2024</p>'
            });
            controller.abort(); // Cancelar la solicitud

            return; // Salir de la función
        }

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            const data = await (parse ? response.json() : response.text());
            return data;
        } else if (contentType && contentType.includes('text')) {
            const data = await response.text();
            return data;
        } else {
            throw new Error(`Contenido no soportado: ${contentType}`);
        }
    } catch (error) {
        console.error('Error peticionando data:', error);
        console.log(response.status);
        console.log(url);
        throw error;
    }
}


function agregarValor(valor) {
    valores.push(valor);
    console.log(`Valor ${valor} agregado.`);
}

// Función para eliminar un valor específico del array
function eliminarValor(valor) {
    const index = valores.indexOf(valor);
    if (index !== -1) {
        valores.splice(index, 1);
        console.log(`Valor ${valor} eliminado.`);
    } else {
        console.log(`El valor ${valor} no existe en el array.`);
    }
}
const functionOrderData = () => {
    const allTypeSampleArray = [];

    document.addEventListener('change', function (event) {
        console.clear();
        const target = event.target;
        console.log(sampleTypeArray);
        if (target.matches('#examsSelect input[type="checkbox"]')) {
            // id del examen
            const examId = target.value;
            // id del tipo muestra
            const sampleTypeId = target.getAttribute('data-sample');
            // indice de sampletype en array
            let index = sampleTypeArray.indexOf(sampleTypeId);
            // elemnto no muestras
            const noMuestras = document.getElementById('noMuestras');

            console.log('exam id ' + examId);
            console.log('sampletype id ' + sampleTypeId);
            // actualiza el array de type muestras

            // si target esta checked 
            if (target.checked) {
                // se agega al array
                sampleTypeArray.push(sampleTypeId);
                document.getElementById(`labelSample${sampleTypeId}`).classList.remove('d-none');
                // checked typesample required
                document.getElementById(`sampleRequired${sampleTypeId}`).checked = true;
            }
            // si target esta unchecked 
            if (!target.checked) {
                // se elimina del array
                sampleTypeArray.splice(sampleTypeArray.indexOf(sampleTypeId), 1);
                // vuelvo a buscar el pimer indice en el arrya para asegurarme si exite
                index = sampleTypeArray.indexOf(sampleTypeId);
                //si index ==-1 significa que no necesito ese typeSample 
                console.log('index checked ' + index);

                // si el typo muetsr ano exite 
                if (index === -1) {
                    //oculto type sample
                    document.getElementById(`labelSample${sampleTypeId}`).classList.add('d-none');
                    // me aseguro que type sample no este chequeda
                    document.getElementById(`sample${sampleTypeId}`).checked = false;
                    // sino se reuqeir emeustra mne aseugro qu eno este tildada la sapleRequired
                    document.getElementById(`sampleRequired${sampleTypeId}`).checked = false;
                }

            }
            // segun sampleTypeArray 
            // muestra las muestras correspondientes
            if (sampleTypeArray.length > 0) {
                noMuestras.classList.add('d-none');
            } else {
                noMuestras.classList.remove('d-none');
            }
            console.log('array con sample type seleccionadas ' + sampleTypeArray);

        }
    });
}

const verifyTempData = () => {
    if (tempData) {

        console.log(tempData);
        if (tempData.length > 0) {
            return false;
        }
        return tempData;
    }
}

/***** Para decidir si quedan *****/
async function newResultOrder(id) {
    console.log(`Result ${id}`);
    console.log(id);
    resultDiv.innerHTML = '';
    const resultOrder = await getData(`/result/new/${id}`, true);
    resultDiv.innerHTML = resultOrder;
    const scriptNew = resultDiv.getElementsByTagName('script')[0].src;
    console.log(scriptNew);
    if (currentNewScript) {
        document.head.removeChild(currentNewScript);
    }
    const script = document.createElement('script');
    script.src = scriptNew;
    document.head.appendChild(script);
    currentNewScript = script;
    script.onload = function () {
        functionOrderData();
    }
    resultModal.show();
}
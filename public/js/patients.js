document.addEventListener('DOMContentLoaded', function () {
    const patientInput = document.getElementById('patientInput');
    const patientList = document.getElementById('patientList');
    const column2 = document.getElementById('column2');
    inputPatientEvento(patientInput, patientList);
    eventoClickIcon(patientList, column2);
    closeModalButton.addEventListener('click', function () {
        patientNew.close();
    });
});

const inputPatientEvento = (patientInput, patientList) => {
    patientNew();
    patientInput.addEventListener('input', async function () {
        const inputStr = patientInput.value;
        let type = '';
        if (inputStr.length > 0) {
            type = isNaN(inputStr) ? 'last_name' : 'document';
            try {
                const encodedType = encodeURIComponent(type);
                const encodedValue = encodeURIComponent(inputStr);
                const response = await fetch(`/patient/search?type=${encodedType}&value=${encodedValue}`);
                if (response.status === 200) {
                    const data = await response.text();
                    patientList.innerHTML = data;
                } else if (response.status === 404) {
                    //patientList.innerHTML = patientNew();
                    patientNew();
                } else {
                    throw new Error('Error en la solicitud');
                }
            } catch (error) {
                patientList.innerHTML = "<h3>Ingrese paciente a buscar: Busque por Apellido o DNI</h3>";
                console.error('Error:', error);
            }
        } else {
            patientNew();
            patientList.innerHTML = "<h3>Ingrese paciente a buscar: Busque por Apellido o DNI2</h3>";
        }

        console.log(`Valor actual: ${inputStr}`);
        console.log(`Longitud del valor actual: ${inputStr.length}`);
    });
}

const eventoClickIcon = (patientList, column2) => {
    patientList.addEventListener('click', function (event) {
        if (event.target && event.target.tagName === 'I' && event.target.classList.contains('fa')) {
            const icon = event.target;
            const parentDiv = icon.closest('.grid-container');
            if (parentDiv) {
                const parentId = parentDiv.getAttribute('id');
                const iconName = icon.getAttribute('name');
                console.log('ID del div padre:', parentId);
                console.log('Icono seleccionado:', iconName);
                let metodo = '';

                switch (iconName) {
                    case 'orderNew':
                    case 'edit':
                    case 'orderList':
                        metodo = 'GET';
                        break;
                    case 'delete':
                        metodo = 'DELETE';
                        break;
                    default:
                        metodo = 'GET';
                        break;
                }
                sendRequest(metodo, `patient/${iconName}/${parentId}`, {}, column2);
            }
        }
    });
}
async function sendRequest(metodo, url, datos = {}, column2) {
    try {
        const response = await fetch(url, {
            method: metodo,
            headers: metodo !== 'GET' ? { 'Content-Type': 'application/json' } : undefined,
            body: metodo !== 'GET' ? JSON.stringify(datos) : undefined
        });

        if (response.status === 200) {
            const data = await response.text();
            column2.innerHTML = data;
        } else {
            column2.innerHTML = errorRequest();
            throw new Error('Error en la solicitud');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
const patientPost = async (data) => {
    try {
        const response = await fetch('/patient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const responseData = await response.text();
        console.log(responseData);
        return responseData;
    } catch (error) {
        console.error('Error:', error);
    }

    return null;
}
const patientNew = () => {
    const patientNewDialog = document.getElementById('patientNew');
    const closeModalButton = document.getElementById('closeModalButton');
    closeModalButton.addEventListener('click', function () {
        patientNewDialog.close();
    });
    patientNewDialog.showModal();
    return `
        <h3>No se encontró el paciente. </h3>
        <button>Nuevo Paciente</button>
    `;

}
const errorRequest = () => {
    return `Error en la peticion`;
}

function newOrder(id) {
    alert('nueva orden para' + id);
}
/**
 * 
 * @param {const ipAPI = "//api.ipify.org?format=json";
const response = await fetch(ipAPI);
const data = await response.json();
const inputValue = data.ip;
const { value: ipAddress } = await Swal.fire({
  title: "Enter your IP address",
  input: "text",
  inputLabel: "Your IP address",
  inputValue,
  showCancelButton: true,
  inputValidator: (value) => {
    if (!value) {
      return "You need to write something!";
    }
  }
});
if (ipAddress) {
  Swal.fire(`Your IP address is ${ipAddress}`);
}} id 
 */
async function listOrders(id) {
    const ipAPI = "//api.ipify.org?format=json";
    const response = await fetch(ipAPI);
    const data = await response.json();
    const inputValue = data.ip;
    const { value: ipAddress } = await Swal.fire({
        title: "Enter your IP address",
        input: "text",
        html: `
        <input id="swal-input1" class="swal2-input">
        <input id="swal-input2" class="swal2-input">
        <input id="swal-input3" class="swal2-input">
    `,
        inputLabel: "Your IP address",
        inputValue,
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return "You need to write something!";
            }
        }
    });
    if (ipAddress) {
        Swal.fire(`Your IP address is ${ipAddress}`);
    }
}
async function listOrders3(id) {
    const { value: formValues } = await Swal.fire({
        title: "Multiple inputs",
        html: `
            <input id="swal-input1" class="swal2-input">
            <input id="swal-input2" class="swal2-input">
            <input id="swal-input3" class="swal2-input">
        `,
        focusConfirm: false,
        preConfirm: () => {
            return [
                document.getElementById("swal-input1").value,
                document.getElementById("swal-input2").value,
                document.getElementById("swal-input3").value
            ];
        }
    });
    if (formValues) {
        Swal.fire(JSON.stringify(formValues));
    }
}
async function listOrders2(id) {
    alert('nueva orden para' + id);
    const ipAPI = "//api.ipify.org?format=json";
    const response = await fetch(ipAPI);
    const data = await response.json();
    const inputValue = data.ip;
    const { value: ipAddress } = await Swal.fire({
        title: "Enter your IP address",
        input: "text",
        inputLabel: "Your IP address",
        inputValue,
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
                return "You need to write something!";
            }
        }
    });
    if (ipAddress) {
        Swal.fire(`Your IP address is ${ipAddress}`);
    }
}
function deletePatient(id) {
    Swal.fire({
        title: "The Internet?",
        text: "That thing is still around?",
        icon: "question"
    });
}
function editPatient(id) {
    Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            alert('aca va un fetch');
            //Swal.fire("Saved!", "", "success");
        } else if (result.isDenied) {
            Swal.fire("Changes are not saved", "", "info");
        }
    });
}


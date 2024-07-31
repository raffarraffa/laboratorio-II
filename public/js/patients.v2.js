let myUuid = uuid;

document.addEventListener('DOMContentLoaded', function () {
    const patientInput = document.getElementById('patientInput');
    const patientList = document.getElementById('patientList');
    const column2 = document.getElementById('column2');

    // Manejador evento iconos
    eventoClickIcon();

    // Manejador evento input
    inputPatientEvento(patientInput, patientList);
});

const inputPatientEvento = (patientInput, patientList) => {
    patientInput.addEventListener('input', async function () {
        const inputStr = patientInput.value;
        let type = '';
        let data = null;

        if (inputStr.length > 0) {
            if (isNaN(inputStr)) {
                console.log(`Valor strings`);
                type = 'last_name';
            } else {
                console.log(`Valor number`);
                type = 'document';
            }

            try {
                const encodedType = encodeURIComponent(type);
                const encodedValue = encodeURIComponent(inputStr);
                const response = await fetch(`/patient/search?type=${encodedType}&value=${encodedValue}`);
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                data = await response.text();
                console.log(data);
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            data = null;
        }

        console.log(`Valor actual: ${inputStr}`);
        console.log(`Longitud del valor actual: ${inputStr.length}`);

        // Actualizar la lista de pacientes con los datos recibidos
        if (data) {
            patientList.innerHTML = data;
        } else {
            patientList.innerHTML = "<h3>Ingrese paciente a buscar: Busque por Apellido o DNI</h3>";
        }
    });
};

const eventoClickIcon = () => {
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
                        metodo = 'GET';
                        break;
                    case 'delete':
                        metodo = 'DELETE';
                        break;
                    case 'edit':
                        metodo = 'GET';
                        break;
                    case 'orderList':
                        metodo = 'GET';
                        break;
                    default:
                        metodo = 'GET';
                        break;
                }
                sendRequest(metodo, `patient/${iconName}/${parentId}`, iconName, {});
            }
        }
    });
};

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
        const result = await response.text();
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
    return null;
};

async function sendRequest(metodo, url, datos = {}) {
    try {
        const response = await fetch(url, {
            method: metodo,
            headers: metodo !== 'GET' ? { 'Content-Type': 'application/json' } : undefined,
            body: metodo !== 'GET' ? JSON.stringify(datos) : undefined
        });
        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }
        const data = await response.text();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

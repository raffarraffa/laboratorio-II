var tablaDoctor = new DataTable('#doctorSelect', {
    //fixedHeader: true,
    lengthMenu: [50, 100],
    responsive: true,
    paging: true,
    searching: true,
    deferRender: true,
    language: {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ Doctor",
        "sZeroRecords": "No se encontro Paciente segun su busqueda, <button type='button' class='btn btn-outline-primary w-100.px-2 mx-0 my-1 mx-1' onclick='newMedic();'>Crear Medico</button>",
        "sInfoFiltered": "(filtrado de _MAX_ doctores totales)",
        "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ doctores",
        "sInfoEmpty": "Mostrando 0 a 0 de 0 doctores",
        "sSearch": "Buscar:",
        "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"

        },
    },
});
var tablaDiagnosis = new DataTable('#diagnosisSelect', {
    //fixedHeader: true,
    lengthMenu: [50, 100],
    responsive: true,
    paging: true,
    searching: true,
    deferRender: true,
    language: {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ Diagnostico",
        "sZeroRecords": "No se encontro Diagnostico segun su busqueda",
        "sInfoFiltered": "(filtrado de _MAX_ diagnosticos totales)",
        "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ diagnosticos",
        "sInfoEmpty": "Mostrando 0 a 0 de 0 diagnosticos",
        "sSearch": "Buscar:",
        "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"

        },
    },
});
var tablaExams = new DataTable('#examsSelect', {
    //fixedHeader: true,
    lengthMenu: [50, 100],
    responsive: true,
    paging: true,
    searching: true,
    deferRender: true,
    language: {
        "sProcessing": "Procesando...",
        "sLengthMenu": "Mostrar _MENU_ Examenes",
        "sZeroRecords": "No se encontro Examen segun su busqueda",
        "sInfoFiltered": "(filtrado de _MAX_ examenes totales)",
        "sInfo": "Mostrando _START_ a _END_ de _TOTAL_ examenes",
        "sInfoEmpty": "Mostrando 0 a 0 de 0 examenes",
        "sSearch": "Buscar:",
        "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"

        },
    },
});

// verico modal doctor definido
if (typeof doctorModal == undefined) {
    var doctorModal = new bootstrap.Modal(document.getElementById('newDoctorModal'));
} else {
    doctorModal = new bootstrap.Modal(document.getElementById('newDoctorModal'));
}
function newMedic() {
    console.log('newMedic');
    document.getElementById('buttonsOrder').classList.add('d-none');
    doctorModal.show();
}
function verModalOrder() {

    document.getElementById('buttonsOrder').classList.remove('d-none');
}
(function editOrder() {

    const samplesDiv = document.getElementById('samplesDiv');
    const radioButtons = samplesDiv.querySelectorAll('input[type="radio"]');



    console.log(radioButtons.length);
    // // Itera sobre los radio buttons y añade un event listener
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function (event) {
            const sample = event.target.getAttribute('data-id');
            const sampleRequired = event.target.getAttribute('name');


            // if (event.target.checked) {
            //         //     document.getElementById(`labelSample${sample}`).classList.remove('d-none');
            //         //     document.getElementById(`sampleRequired${sampleRequired}`).checked = true;
            //         // }

            console.log('Radio button changed: ', event.target.value);
        });
    });

})();
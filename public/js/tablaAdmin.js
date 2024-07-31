document.addEventListener('DOMContentLoaded', function () {
    const contentTitle = document.getElementById('contentTitle');

    console.log(adminData);
    document.addEventListener('click', (event) => {
        const eventTarget = event.target;
        const dataIndex = eventTarget.dataset;
        //console.clear();
        console.log(dataIndex);
        const elementType = eventTarget.getAttribute('type');
        console.log(elementType);
        const node = event.target.parentNode;
        const previo = node.previousElementSibling;
        const next = node.nextElementSibling;
        //console.log(node);
        // console.log(previo);
        // const labelClick = previo.querySelector('label')

        // if (previo.classList.contains('colHead')) {
        //     //console.log(labelClick.textContent);
        //     contentTitle.textContent = labelClick.textContent
        // }
        // const datos = adminData[elementType][dataIndex];
        // console.log(datos);



        // //const titleDiv=node.get
        // let specificParent = node.closest('.colHead');
        // console.log(specificParent);

        // console.log('Click event detected:', event.target.dataset);
        // console.log('Click event detected:', event);
        // const type = event.target.getAttribute('type');
        // console.log('Button type:', type);
    });
})

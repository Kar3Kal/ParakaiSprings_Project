document.addEventListener('DOMContentLoaded', function() {
    const tooltip = document.getElementById('areaInfo');
    const hoverBoxes = document.querySelectorAll('.hover-box');

    hoverBoxes.forEach(box => {
        box.addEventListener('mouseenter', function(event) {
            const areaName = box.dataset.area;
            displayAreaInfo(areaName, event);
        });

        box.addEventListener('mousemove', function(event) {
            const boxRect = event.target.getBoundingClientRect();
            tooltip.style.left = boxRect.left + 'px';
            tooltip.style.top = (boxRect.top - tooltip.offsetHeight - 5) + 'px';
        });

        box.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none';
        });
    });
});

function displayAreaInfo(areaName) {
   var areas = xmlAreasDatabase.getElementsByTagName('area');
    var infoBox = document.getElementById('areaInfo');

    for (var i = 0; i < areas.length; i++) {
        var xmlAreaName = areas[i].getElementsByTagName('areaName')[0].textContent;
        if (xmlAreaName === areaName) {
            var cost = areas[i].getElementsByTagName('cost')[0].textContent;
            var capacity = areas[i].getElementsByTagName('capacity')[0].textContent;
            var status = areas[i].getElementsByTagName('status')[0].textContent;
            var image = areas[i].getElementsByTagName('image')[0].textContent;

            infoBox.innerHTML = `
                <strong>Area Name:<br></strong> ${xmlAreaName}<br>
                <strong>Cost:</strong> $${cost}<br>
                <strong>Capacity:</strong> ${capacity}<br>
                <strong>Status:</strong> ${status === 'true' ? 'Reserved' : 'Available'}<br>
                <img src="./assets/${image}" alt="${xmlAreaName}" style="width:100px; height:auto;">
            `;

            infoBox.style.display = 'block';
            break;
        }
    }
}

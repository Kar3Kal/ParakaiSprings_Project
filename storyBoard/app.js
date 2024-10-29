let xmlAreasDatabase;
let availableCapacities = {};

window.addEventListener("load", doLoad);

function doLoad() {
    xmlAreasDatabase = loadXML('areas.xml');
    loadInitialCapacities();
}

function loadXML(xmlFile) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", xmlFile, false);
    xmlhttp.send();
    return xmlhttp.responseXML;
}

document.querySelector(".btnSearch").addEventListener("click", search);

function search() {
    var capacityInput = parseInt(document.getElementById("txtCapacity").value);
    var hoverBoxes = document.querySelectorAll('.hover-box'); // Get hover boxes

    hoverBoxes.forEach(box => {
        var area = box.getAttribute("data-area");
        var areaCapacity = getAreaCapacity(area);

        // If no capacity input, show all areas, otherwise filter by capacity
        if (isNaN(capacityInput) || capacityInput <= 0 || areaCapacity >= capacityInput) {
            box.style.display = "block";
        } else {
            box.style.display = "none";
        }
    });
}

function clickArea(area) {
    displayModal(area);
    
}

function displayModal(areaName) {
    var areas = xmlAreasDatabase.getElementsByTagName("area");
    for (var i = 0; i < areas.length; i++) {
        var xmlAreaName = areas[i].getElementsByTagName("areaName")[0].textContent;
        if (xmlAreaName === areaName) {
            var cost = parseFloat(areas[i].getElementsByTagName("cost")[0].textContent); // price per day
            var status = areas[i].getElementsByTagName("status")[0].textContent;
            var image = areas[i].getElementsByTagName("image")[0].textContent;
            var capacity = areas[i].getElementsByTagName("capacity")[0].textContent;
            
            var duration = calculateDuration();

            var capacityTxtBox = parseInt(document.getElementById("txtCapacity").value); // Get capacity from the input

            // Validate capacity input
            if (isNaN(capacityTxtBox) || capacityTxtBox <= 0) {
                alert("Please enter a valid capacity.");
                return;
            }

            var totalCost = duration * capacityTxtBox * cost;

            document.getElementById("modalTitle").textContent = xmlAreaName;
            document.getElementById("modalCost").textContent = "Cost: $" + cost.toFixed(2); // Show cost per day
            document.getElementById("modalCapacity").textContent = "Available Capacity: " + availableCapacities[xmlAreaName] + " of " + capacity;
            document.getElementById("modalStatus").textContent = "Status: " + (status === 'true' ? 'Reserved' : 'Available');
            document.getElementById("modalPaxs").textContent = "Number of Packs: " + capacityTxtBox;
            document.getElementById("modalImage").src = "./assets/" + image;
            document.getElementById("modalDuration").textContent = "Duration: " + (duration > 0 ? duration + ' days' : 'Invalid dates');

            document.getElementById("modalTotalCost").textContent = "Total Cost: $" + (totalCost > 0 ? totalCost.toFixed(2) : '0.00');

            // Show the modal
            var modal = document.getElementById("myModal");
            modal.style.display = "block";
            //break;
        }
    }
}

function loadInitialCapacities() {
    var areas = xmlAreasDatabase.getElementsByTagName("area");
    for (var i = 0; i < areas.length; i++) {
        var xmlAreaName = areas[i].getElementsByTagName("areaName")[0].textContent;
        var capacity = parseInt(areas[i].getElementsByTagName("capacity")[0].textContent);
        var status = areas[i].getElementsByTagName("status")[0].textContent;

        if (status === 'true') {
            availableCapacities[xmlAreaName] = 0;
        } else {
            availableCapacities[xmlAreaName] = capacity;
        }
    }

    document.querySelectorAll('.hover-box').forEach(box => {
        box.addEventListener('click', function() {
            var areaName = this.getAttribute("data-area");
            displayModal(areaName);
        });
    });
}

function calculateDuration() {
    var checkInDate = document.getElementById('checkIn-Calander').value;
    var checkOutDate = document.getElementById('checkOut-Calander').value;

    if (checkInDate && checkOutDate) {

        var checkin = new Date(checkInDate);
        var checkout = new Date(checkOutDate);

        checkin.setHours(8, 0, 0, 0);
        checkout.setHours(8, 0, 0, 0);

        // If check-in and check-out are on the same day, return 1
        if (checkin.getTime() === checkout.getTime()) {
            return 1;
        }

        var timeDifference = checkout.getTime() - checkin.getTime();

        var dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1;

        return dayDifference;
    }
    return 0;
}

function getAreaCapacity(areaName) {
    return availableCapacities[areaName] || 0;
}

document.querySelector('.book').addEventListener("click", submitBooking);

const modal = document.getElementById('myModal');
const closeButton = document.querySelector('.close');
closeButton.onclick = hideModal;

function hideModal() {
    modal.style.display = 'none';
}
document.querySelector('.cancel').addEventListener("click", hideModal);

function submitBooking() {
    var areaName = document.getElementById("modalTitle").textContent;
    var capacityInTxtbox = parseInt(document.getElementById("txtCapacity").value);

    if (availableCapacities[areaName] === 0) {
        alert("This area is fully booked and reserved.");
        return;
    } else if (capacityInTxtbox > availableCapacities[areaName]) {
        alert("Requested capacity exceeds available capacity. Please enter a lower value.");
        return;
    }

    availableCapacities[areaName] -= capacityInTxtbox;

    if (availableCapacities[areaName] === 0) {
        updateAreaStatus(areaName, 'reserved');
    }

    document.getElementById("selectedArea").textContent = 'Selected Area: ' + areaName;
    document.getElementById("arrivalDate").textContent = 'Arrival Date: ' + document.getElementById("checkIn-Calander").value;
    document.getElementById("leaveDate").textContent = 'Leave Date: ' + document.getElementById("checkOut-Calander").value;
    document.getElementById("costPerDay").textContent = 'Cost per Day: $' + parseFloat(document.getElementById("modalCost").textContent.replace(/[^0-9.-]+/g, "")).toFixed(2);
    document.getElementById("totalCost").textContent = 'Total Cost: $' + parseFloat(document.getElementById("modalTotalCost").textContent.replace(/[^0-9.-]+/g, "")).toFixed(2);
    document.getElementById("maxCapacity").textContent = 'Maximum Capacity: ' + availableCapacities[areaName];
    
    var summary = document.getElementById("bookingSummaryModal");
    summary.style.display = "block";
}

function updateAreaStatus(areaName, newStatus) {
    var areas = xmlAreasDatabase.getElementsByTagName("area");
    for (var i = 0; i < areas.length; i++) {
        var xmlAreaName = areas[i].getElementsByTagName("areaName")[0].textContent;
        if (xmlAreaName === areaName) {
            areas[i].getElementsByTagName("status")[0].textContent = (newStatus === 'reserved') ? 'true' : 'false';
            break;
        }
    }
}

document.querySelector(".close-summary").onclick = function() {
    var modal = document.getElementById("bookingSummaryModal");
    modal.style.display = "none";
}

// Finalize booking and close summary modal
document.querySelector('.ok').addEventListener("click", function () {
    var modal = document.getElementById("bookingSummaryModal");
    modal.style.display = "none";  
});






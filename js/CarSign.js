import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, collection, getDocs, writeBatch } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBv-DYm4c4l9Dn-o7ME4TnI92YsCpss1nM",
    authDomain: "carsign-423fc.firebaseapp.com",
    databaseURL: "https://carsign-423fc-default-rtdb.firebaseio.com",
    projectId: "carsign-423fc",
    storageBucket: "carsign-423fc.firebasestorage.app",
    messagingSenderId: "219688439999",
    appId: "1:219688439999:web:2d4f8646c98bcb76e4360a",
    measurementId: "G-7FRW6JPXBJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Global variables
let carLocations = {};
let cachedCarLocations = null;
let currentPage = 1;
const itemsPerPage = 10;
let sortColumn = 'location';
let sortDirection = 'asc';

// Submit car location
function submitCarLocation() {
    const carNumber = document.getElementById('carNumbers').value;
    const location = document.getElementById('locations').value;
    const loading = document.getElementById('loading');

    const password = prompt("請輸入密碼，系統測試中348362");
    const correctPassword = "348362";

    if (password !== correctPassword) {
        alert("密碼錯誤，無法提交車輛位置。");
        return;
    }

    const locations = {
        "二級廠": { lat: 24.8953731, lng: 121.2110354 },
        "OK鋼棚": { lat: 24.8955410, lng: 121.2094455 },
        "連側鋼棚": { lat: 24.8955352, lng: 121.2088128 },
        "無線電鋼棚": { lat: 24.8942494, lng: 121.2084913 },
        "陸區鋼棚": { lat: 24.8936913, lng: 121.2085201 },
        "玄捷鋼棚": { lat: 24.8933285, lng: 121.2084722 },
        "風雨走廊": { lat: 24.8926953, lng: 121.2099437 },
        "待安置車號": { lat: 24.8950000, lng: 121.2090000 }
    };

    const carLocation = locations[location];
    if (!carLocation) {
        alert("指定位置無效。");
        return;
    }

    loading.style.display = "block";
    const carRef = doc(db, "carLocations", carNumber);
    setDoc(carRef, {
        carNumber: carNumber,
        locationName: location,
        lat: carLocation.lat,
        lng: carLocation.lng
    })
        .then(() => {
            alert("車號位置已儲存");
            cachedCarLocations = null; // Clear cache
            addMarker(carLocation.lat, carLocation.lng, carNumber, location);
            showStatus();
            loading.style.display = "none";
        })
        .catch(error => {
            alert("無法儲存車號資料");
            console.error(error);
            loading.style.display = "none";
        });
}

// Show status modal
function showStatus() {
    const modal = document.getElementById("modal");
    const loading = document.getElementById("loading");
    modal.classList.add("show");
    loading.style.display = "block";

    if (cachedCarLocations) {
        carLocations = cachedCarLocations;
        updateStatusTable();
        updateMarkers();
        loading.style.display = "none";
        return;
    }

    const carRef = collection(db, "carLocations");
    getDocs(carRef)
        .then(snapshot => {
            carLocations = {};
            snapshot.forEach(doc => {
                const data = doc.data();
                carLocations[data.carNumber] = {
                    locationName: data.locationName,
                    lat: data.lat,
                    lng: data.lng
                };
            });
            cachedCarLocations = { ...carLocations };
            updateMarkers();
            updateStatusTable();
            loading.style.display = "none";
        })
        .catch(error => {
            alert("無法讀取車輛資料");
            console.error(error);
            loading.style.display = "none";
        });
}

// Update status table with sorting and pagination
function updateStatusTable() {
    const tableBody = document.getElementById("statusTable");
    const pageInfo = document.getElementById("pageInfo");
    if (!tableBody || !pageInfo) return;

    tableBody.innerHTML = "";

    const locationData = {};
    Object.keys(carLocations).forEach(carNumber => {
        const carInfo = carLocations[carNumber];
        const locationName = carInfo.locationName;
        if (!locationData[locationName]) {
            locationData[locationName] = { carNumbers: [], count: 0 };
        }
        locationData[locationName].carNumbers.push(carNumber);
        locationData[locationName].count++;
    });

    const sortedData = Object.keys(locationData).map(locationName => ({
        location: locationName,
        carNumbers: locationData[locationName].carNumbers,
        count: locationData[locationName].count
    })).sort((a, b) => {
        const valA = sortColumn === 'location' ? a.location : a.carNumbers.join(', ');
        const valB = sortColumn === 'location' ? b.location : b.carNumbers.join(', ');
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    currentPage = Math.min(currentPage, totalPages);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = sortedData.slice(start, end);

    paginatedData.forEach(data => {
        const row = document.createElement("tr");

        const locationCell = document.createElement("td");
        locationCell.textContent = data.location;
        row.appendChild(locationCell);

        const carNumberCell = document.createElement("td");
        carNumberCell.textContent = data.carNumbers.join(", ");
        row.appendChild(carNumberCell);

        const totalCell = document.createElement("td");
        totalCell.textContent = data.count;
        row.appendChild(totalCell);

        tableBody.appendChild(row);
    });

    pageInfo.textContent = `第 ${currentPage} 頁 / 共 ${totalPages} 頁`;
}

// Sort table by column
function sortTable(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    updateStatusTable();
}

// Pagination controls
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateStatusTable();
    }
}

function nextPage() {
    const totalPages = Math.ceil(Object.keys(carLocations).length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateStatusTable();
    }
}

// Close modal
function closeModal() {
    document.getElementById("modal").classList.remove("show");
}

// Clear all car numbers
function clearCarNumbers() {
    const password = prompt("請輸入密碼以清除所有車號");
    const correctPassword = "348362";
    const loading = document.getElementById("loading");

    if (password !== correctPassword) {
        alert("密碼錯誤，無法清除車號。");
        return;
    }

    loading.style.display = "block";
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    carLocations = {};
    cachedCarLocations = null;
    markerCluster.clearMarkers();

    const carRef = collection(db, "carLocations");
    getDocs(carRef)
        .then(snapshot => {
            const batch = writeBatch(db);
            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            return batch.commit();
        })
        .then(() => {
            alert("所有車號已清除");
            updateStatusTable();
            loading.style.display = "none";
        })
        .catch(error => {
            alert("清除失敗");
            console.error(error);
            loading.style.display = "none";
        });
}

// Add marker to map
function addMarker(lat, lng, carNumber, locationName) {
    const existingMarkers = markers.filter(m => m.position.lat() === lat && m.position.lng() === lng);
    const carNumbers = existingMarkers.map(m => m.title).concat([carNumber]);

    existingMarkers.forEach(m => {
        markers = markers.filter(marker => marker !== m);
        m.setMap(null);
    });

    const marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: carNumber
    });

    marker.addListener('click', () => {
        infoWindow.setContent(`
            <div style="color: black;">
                <h3>${locationName}</h3>
                <p>車號: ${carNumbers.join(', ')}</p>
            </div>
        `);
        infoWindow.open(map, marker);
    });

    markers.push(marker);
    markerCluster.addMarker(marker);
}

// Update all markers on map
function updateMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    markerCluster.clearMarkers();

    const locationData = {};
    Object.keys(carLocations).forEach(carNumber => {
        const carInfo = carLocations[carNumber];
        const key = `${carInfo.lat},${carInfo.lng}`;
        if (!locationData[key]) {
            locationData[key] = { lat: carInfo.lat, lng: carInfo.lng, locationName: carInfo.locationName, carNumbers: [] };
        }
        locationData[key].carNumbers.push(carNumber);
    });

    Object.values(locationData).forEach(data => {
        const marker = new google.maps.Marker({
            position: { lat: data.lat, lng: data.lng },
            map: map,
            title: data.carNumbers[0]
        });

        marker.addListener('click', () => {
            infoWindow.setContent(`
                <div style="color: black;">
                    <h3>${data.locationName}</h3>
                    <p>車號: ${data.carNumbers.join(', ')}</p>
                </div>
            `);
            infoWindow.open(map, marker);
        });

        markers.push(marker);
        markerCluster.addMarker(marker);
    });
}

// Modal click event to close when clicking outside
document.getElementById("modal").addEventListener("click", function (event) {
    if (event.target === document.getElementById("modal")) {
        closeModal();
    }
});

// Expose functions to global scope
window.submitCarLocation = submitCarLocation;
window.showStatus = showStatus;
window.closeModal = closeModal;
window.clearCarNumbers = clearCarNumbers;
window.sortTable = sortTable;
window.prevPage = prevPage;
window.nextPage = nextPage;

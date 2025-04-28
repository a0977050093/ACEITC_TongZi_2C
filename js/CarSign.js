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
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics(app);
const db = firebase.firestore(app);

// Global variables
let carLocations = {};
let cachedCarLocations = null;
let currentPage = 1;
const itemsPerPage = 10;
let sortColumn = 'location';
let sortDirection = 'asc';
const defaultCenter = { lat: 24.8940207, lng: 121.2095940 };
const defaultZoom = 17;

// Submit car location
function submitCarLocation() {
    const carNumber = document.getElementById('carNumbers').value;
    const location = document.getElementById('locations').value;
    const loading = document.getElementById('loading');
    const notification = document.getElementById('notification');

    if (!carNumber || !location) {
        showNotification("請選擇車號和位置", "error");
        return;
    }

    const password = prompt("請輸入密碼，系統測試中348362");
    const correctPassword = "348362";

    if (password !== correctPassword) {
        showNotification("密碼錯誤，無法提交車輛位置。", "error");
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
        showNotification("指定位置無效。", "error");
        return;
    }

    loading.style.display = "block";
    const carRef = db.collection("carLocations").doc(carNumber);
    carRef.set({
        carNumber: carNumber,
        locationName: location,
        lat: carLocation.lat,
        lng: carLocation.lng
    })
        .then(() => {
            showNotification("車號位置已儲存", "success");
            cachedCarLocations = null; // Clear cache
            addMarker(carLocation.lat, carLocation.lng, carNumber, location);
            showStatus();
            loading.style.display = "none";
        })
        .catch(error => {
            showNotification(`無法儲存車號資料: ${error.message}`, "error");
            console.error("提交車號失敗:", error);
            loading.style.display = "none";
        });
}

// Show status modal
function showStatus() {
    const modal = document.getElementById("modal");
    const loading = document.getElementById("loading");
    if (!modal || !loading) {
        console.error("Modal 或 Loading 元素未找到");
        return;
    }

    modal.classList.add("show");
    loading.style.display = "block";

    if (cachedCarLocations) {
        carLocations = cachedCarLocations;
        updateStatusTable();
        updateMarkers();
        loading.style.display = "none";
        return;
    }

    db.collection("carLocations").get()
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
            showNotification(`無法讀取車輛資料: ${error.message}`, "error");
            console.error("讀取車輛資料失敗:", error);
            loading.style.display = "none";
        });
}

// Update status table with sorting and pagination
function updateStatusTable() {
    const tableBody = document.getElementById("statusTable");
    const pageInfo = document.getElementById("pageInfo");
    if (!tableBody || !pageInfo) {
        console.error("TableBody 或 PageInfo 元素未找到");
        return;
    }

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
    const modal = document.getElementById("modal");
    if (modal) {
        modal.classList.remove("show");
    }
}

// Clear all car numbers
function clearCarNumbers() {
    const password = prompt("請輸入密碼以清除所有車號");
    const correctPassword = "348362";
    const loading = document.getElementById("loading");
    const notification = document.getElementById("notification");

    if (password !== correctPassword) {
        showNotification("密碼錯誤，無法清除車號。", "error");
        return;
    }

    loading.style.display = "block";
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    carLocations = {};
    cachedCarLocations = null;
    markerCluster.clearMarkers();

    db.collection("carLocations").get()
        .then(snapshot => {
            const batch = db.batch();
            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            return batch.commit();
        })
        .then(() => {
            showNotification("所有車號已清除", "success");
            updateStatusTable();
            loading.style.display = "none";
        })
        .catch(error => {
            showNotification(`清除失敗: ${error.message}`, "error");
            console.error("清除車號失敗:", error);
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

    // Add default center marker if no other markers exist
    if (markers.length === 0) {
        const centerMarker = new google.maps.Marker({
            position: defaultCenter,
            map: map,
            title: "軍事基地中心"
        });
        centerMarker.addListener('click', () => {
            infoWindow.setContent(`
                <div style="color: black;">
                    <h3>軍事基地中心</h3>
                    <p>經度: ${defaultCenter.lng}, 緯度: ${defaultCenter.lat}</p>
                </div>
            `);
            infoWindow.open(map, centerMarker);
        });
        markers.push(centerMarker);
        markerCluster.addMarker(centerMarker);
    }
}

// Reset map view to default center and zoom
function resetMapView() {
    map.setCenter(defaultCenter);
    map.setZoom(defaultZoom);
}

// Show notification
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (!notification) {
        console.error("Notification 元素未找到");
        return;
    }
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Bind button events and modal click event
document.addEventListener("DOMContentLoaded", () => {
    // Bind submit button
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn) {
        submitBtn.addEventListener("click", submitCarLocation);
    } else {
        console.error("Submit button 未找到");
    }

    // Bind status button
    const statusBtn = document.getElementById("status-btn");
    if (statusBtn) {
        statusBtn.addEventListener("click", showStatus);
    } else {
        console.error("Status button 未找到");
    }

    // Bind modal close event
    const modal = document.getElementById("modal");
    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    } else {
        console.error("Modal 元素未找到");
    }
});

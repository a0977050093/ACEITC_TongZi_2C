let map;
let markers = {}; // 儲存地圖標記
let carLocations = {}; // 儲存車號位置

// 初始化地圖
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 24.8940207, lng: 121.2095940 },
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });
}

// Firebase 配置
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getFirestore, collection, doc, setDoc, getDocs } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBv-DYm4c4l9Dn-o7ME4TnI92YsCpss1nM",
  authDomain: "carsign-423fc.firebaseapp.com",
  projectId: "carsign-423fc",
  storageBucket: "carsign-423fc.appspot.com",
  messagingSenderId: "219688439999",
  appId: "1:219688439999:web:2d4f8646c98bcb76e4360a",
  measurementId: "G-7FRW6JPXBJ"
};

// 初始化 Firebase 應用
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 提交車輛位置
function submitCarLocation() {
  const carNumber = document.getElementById('carNumbers').value;
  const location = document.getElementById('locations').value;

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

  // 儲存車號資料到 Firestore
  const carRef = doc(db, "carLocations", carNumber);
  setDoc(carRef, {
    carNumber: carNumber,
    locationName: location,
    lat: carLocation.lat,
    lng: carLocation.lng
  })
    .then(() => {
      alert("車號位置已儲存");

      // 更新本地 carLocations 物件
      carLocations[carNumber] = {
        locationName: location,
        lat: carLocation.lat,
        lng: carLocation.lng
      };

      // 添加標記到地圖
      addMarker(carLocation.lat, carLocation.lng, carNumber);
      updateStatusTable();
    })
    .catch((error) => {
      alert("無法儲存車號資料");
      console.error(error);
    });
}

// 添加標記
function addMarker(lat, lng, title) {
    if (markers[title]) {
        markers[title].setMap(null);
    }

    markers[title] = new google.maps.Marker({
        position: { lat, lng },
        map: map,
        title: title
    });
}

// 顯示狀況表
function showStatus() {
    const modal = document.getElementById("modal");
    modal.style.display = "flex"; // 顯示模態框
    
    // 從 Firestore 獲取車輛資料
    const carRef = collection(db, "carLocations");
    getDocs(carRef).then(snapshot => {
        snapshot.forEach(doc => {
            const data = doc.data();
            // 更新 carLocations
            carLocations[data.carNumber] = {
                locationName: data.locationName,
                lat: data.lat,
                lng: data.lng
            };
        });
        updateStatusTable();
    }).catch((error) => {
        alert("無法讀取車輛資料");
        console.error(error);
    });
}

// 關閉模態框
function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

// 避免誤觸背景關閉
document.getElementById("modal").addEventListener("click", function (event) {
    if (event.target === document.getElementById("modal-content")) {
        return;
    }
    closeModal();
});

// 更新車輛狀況表
function updateStatusTable() {
    const tableBody = document.getElementById("statusTable");
    tableBody.innerHTML = "";

    Object.keys(carLocations).forEach(carNumber => {
        const carInfo = carLocations[carNumber];

        const row = document.createElement("tr");

        const locationCell = document.createElement("td");
        locationCell.textContent = carInfo.locationName;
        row.appendChild(locationCell);

        const carNumberCell = document.createElement("td");
        carNumberCell.textContent = carNumber;
        row.appendChild(carNumberCell);

        const totalCell = document.createElement("td");
        totalCell.textContent = "1"; // 如果有需要可以更新總數
        row.appendChild(totalCell);

        tableBody.appendChild(row);
    });
}

// 清除所有車號
function clearCarNumbers() {
    const password = prompt("請輸入密碼以清除所有車號");
    const correctPassword = "348362";

    if (password !== correctPassword) {
        alert("密碼錯誤，無法清除車號。");
        return;
    }

    // 清除標記
    Object.keys(markers).forEach(carNumber => {
        markers[carNumber].setMap(null);
    });

    markers = {}; // 清空標記
    carLocations = {}; // 清空位置資料

    updateStatusTable();
}

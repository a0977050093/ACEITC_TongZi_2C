// LogiFour.js

// 裝備數據結構
let equipmentData = {
    輪車: {
        大貨車: ["軍E-21188", "軍E-21137"],
        悍馬車: ["軍E-21189", "軍E-21190"],
        中型戰術輪車: ["軍E-21191", "軍E-21192"],
        輕型戰術輪車: ["軍E-21193", "軍E-21194"]
    },
    兵工: {
        T91: ["序號1", "序號2"]
    },
    化學: {
        裝備1: ["序號1", "序號2"],
        裝備2: ["序號3", "序號4"]
    },
    工兵: {
        裝備1: ["序號1", "序號2"],
        裝備2: ["序號3", "序號4"]
    },
    通信: {
        裝備1: ["序號1", "序號2"],
        裝備2: ["序號3", "序號4"]
    },
    經理: {
        裝備1: ["序號1", "序號2"],
        裝備2: ["序號3", "序號4"]
    }
};

let currentSerials = [];
let allEquipment = [];
let currentPage = 1;
const itemsPerPage = 10;

// 初始化所有裝備清單（支援搜尋）
function initializeEquipmentList() {
    allEquipment = [];
    Object.keys(equipmentData).forEach(mainCategory => {
        Object.keys(equipmentData[mainCategory]).forEach(subCategory => {
            equipmentData[mainCategory][subCategory].forEach(serial => {
                allEquipment.push({
                    mainCategory,
                    subCategory,
                    serial
                });
            });
        });
    });
    currentSerials = allEquipment.map(item => item.serial);
    updateSerialSelect();
    updateEquipmentDetails(currentSerials);
}

// 導航顯示/隱藏（建議 2）
function toggleNav() {
    const nav = document.getElementById('search-nav');
    nav.classList.toggle('active');
}

// 更新子分類選單
function updateSubCategoryOptions(mainCategory) {
    const subCategorySelect = document.getElementById('sub-category');
    subCategorySelect.innerHTML = '<option value="" data-icon="fa-filter">所有子類型</option>';
    subCategorySelect.disabled = !mainCategory;

    if (mainCategory && equipmentData[mainCategory]) {
        Object.keys(equipmentData[mainCategory]).forEach(item => {
            subCategorySelect.innerHTML += `<option value="${item}">${item}</option>`;
        });
    }
}

// 顯示裝備資料
function showEquipment(type, item) {
    const serials = equipmentData[type][item] || [];
    currentSerials = serials;
    currentPage = 1;
    updateSerialSelect();
    updateEquipmentDetails(serials);
    document.getElementById('search-nav').classList.remove('active');
}

// 更新序號選單
function updateSerialSelect() {
    const serialSelect = document.getElementById('serialNumber');
    serialSelect.innerHTML = '<option value="" disabled selected>請選擇序號</option>';
    currentSerials.forEach(serial => {
        serialSelect.innerHTML += `<option value="${serial}">${serial}</option>`;
    });
}

// 更新裝備表格（支援分頁）
function updateEquipmentDetails(serials) {
    const tableBody = document.getElementById('equipmentTable').querySelector('tbody');
    tableBody.innerHTML = '';
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedSerials = serials.slice(start, end);

    paginatedSerials.forEach(serial => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${serial}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>
                <button class="operation-btn" onclick="deleteRow(this)">刪除</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    const totalPages = Math.ceil(serials.length / itemsPerPage) || 1;
    document.getElementById('page-info').textContent = `第 ${currentPage} 頁 / 共 ${totalPages} 頁`;
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;

    sendIframeHeight();
}

// 刪除表格行
function deleteRow(button) {
    const row = button.parentElement.parentElement;
    const serial = row.cells[0].textContent;
    row.remove();
    currentSerials = currentSerials.filter(s => s !== serial);
    updateSerialSelect();
    updateEquipmentDetails(currentSerials);
}

// 搜尋裝備（建議 2）
function searchEquipment(query, mainCategory, subCategory) {
    let filtered = allEquipment;

    if (mainCategory) {
        filtered = filtered.filter(item => item.mainCategory === mainCategory);
    }

    if (subCategory) {
        filtered = filtered.filter(item => item.subCategory === subCategory);
    }

    if (query) {
        query = query.toLowerCase();
        filtered = filtered.filter(item => 
            item.serial.toLowerCase().includes(query) || 
            item.subCategory.toLowerCase().includes(query) || 
            item.mainCategory.toLowerCase().includes(query)
        );
    }

    currentSerials = filtered.map(item => item.serial);
    currentPage = 1;
    updateSerialSelect();
    updateEquipmentDetails(currentSerials);

    // 更新搜尋建議
    const suggestions = document.getElementById('search-suggestions');
    suggestions.innerHTML = '';
    if (query) {
        const matches = filtered.slice(0, 10); // 限制建議數量
        matches.forEach(match => {
            const li = document.createElement('li');
            const iconClass = match.mainCategory === '輪車' ? 'fa-truck' : 
                             match.mainCategory === '兵工' ? 'fa-gun' : 
                             match.mainCategory === '化學' ? 'fa-flask' : 
                             match.mainCategory === '工兵' ? 'fa-tools' : 
                             match.mainCategory === '通信' ? 'fa-radio' : 
                             match.mainCategory === '經理' ? 'fa-briefcase' : 'fa-filter';
            li.innerHTML = `<i class="fas ${iconClass}"></i> ${match.mainCategory} > ${match.subCategory} > ${match.serial}`;
            li.dataset.main = match.mainCategory;
            li.dataset.sub = match.subCategory;
            li.dataset.serial = match.serial;
            li.addEventListener('click', () => {
                showEquipment(match.mainCategory, match.subCategory);
                document.getElementById('equipment-search').value = match.serial;
                suggestions.classList.remove('active');
            });
            suggestions.appendChild(li);
        });
        suggestions.classList.add('active');
    } else {
        suggestions.classList.remove('active');
    }
}

// 表單提交（現況）
document.getElementById('statusForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        serialNumber: document.getElementById('serialNumber').value,
        status: document.getElementById('status').value,
        notes: document.getElementById('notes').value,
        entryDate: document.getElementById('entryDate').value,
        enteredBy: document.getElementById('enteredBy').value
    };

    // 更新現況
    const tableBody = document.getElementById('equipmentTable').querySelector('tbody');
    const rows = tableBody.querySelectorAll('tr');
    let updated = false;

    rows.forEach(row => {
        const serialCell = row.querySelector('td:first-child');
        if (serialCell.textContent === formData.serialNumber) {
            row.querySelectorAll('td').forEach((cell, index) => {
                if (index === 1) cell.textContent = formData.status;
                else if (index === 2) cell.textContent = formData.notes;
                else if (index === 3) cell.textContent = formData.entryDate;
                else if (index === 4) cell.textContent = formData.enteredBy;
            });
            updated = true;
        }
    });

    if (!updated) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${formData.serialNumber}</td>
            <td>${formData.status}</td>
            <td>${formData.notes}</td>
            <td>${formData.entryDate}</td>
            <td>${formData.enteredBy}</td>
            <td>
                <button class="operation-btn" onclick="deleteRow(this)">刪除</button>
            </td>
        `;
        tableBody.appendChild(newRow);
        currentSerials.push(formData.serialNumber);
    }

    // 顯示模態框（建議 2）
    const modal = document.getElementById('form-modal');
    const message = document.getElementById('form-message');
    message.textContent = '現況已成功提交！';
    modal.style.display = 'block';

    this.reset();
    updateSerialSelect();
    updateEquipmentDetails(currentSerials);
});

// 表單提交（新增裝備）
document.getElementById('equipmentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const mainCategory = document.getElementById('new-main-category').value.trim();
    const subCategory = document.getElementById('new-sub-category').value.trim();
    const serial = document.getElementById('new-serial').value.trim();

    if (!equipmentData[mainCategory]) {
        equipmentData[mainCategory] = {};
    }
    if (!equipmentData[mainCategory][subCategory]) {
        equipmentData[mainCategory][subCategory] = [];
    }
    if (!equipmentData[mainCategory][subCategory].includes(serial)) {
        equipmentData[mainCategory][subCategory].push(serial);
    }

    localStorage.setItem('equipmentData', JSON.stringify(equipmentData));
    initializeEquipmentList();
    updateSubCategoryOptions(mainCategory);
    showEquipment(mainCategory, subCategory);

    // 顯示模態框（建議 2）
    const modal = document.getElementById('form-modal');
    const message = document.getElementById('form-message');
    message.textContent = '裝備已成功新增！';
    modal.style.display = 'block';

    this.reset();
});

// 模態框關閉
function closeFormModal() {
    document.getElementById('form-modal').style.display = 'none';
}

// 搜尋和篩選邏輯（建議 2）
document.getElementById('equipment-search').addEventListener('input', function() {
    const query = this.value;
    const mainCategory = document.getElementById('main-category').value;
    const subCategory = document.getElementById('sub-category').value;
    searchEquipment(query, mainCategory, subCategory);
});

document.getElementById('main-category').addEventListener('change', function() {
    const mainCategory = this.value;
    updateSubCategoryOptions(mainCategory);
    const subCategory = document.getElementById('sub-category').value;
    searchEquipment(document.getElementById('equipment-search').value, mainCategory, subCategory);
});

document.getElementById('sub-category').addEventListener('change', function() {
    const mainCategory = document.getElementById('main-category').value;
    const subCategory = this.value;
    searchEquipment(document.getElementById('equipment-search').value, mainCategory, subCategory);
});

// 分頁控制
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        updateEquipmentDetails(currentSerials);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(currentSerials.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateEquipmentDetails(currentSerials);
    }
});

// 點擊外部關閉搜尋建議
document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-input')) {
        document.getElementById('search-suggestions').classList.remove('active');
    }
});

// 動態調整 iframe 高度（建議）
function sendIframeHeight() {
    const height = Math.max(document.body.scrollHeight, 500);
    window.parent.postMessage({ type: 'iframeResize', height: height }, '*');
}

// 初始化
const storedData = JSON.parse(localStorage.getItem('equipmentData'));
if (storedData) {
    Object.assign(equipmentData, storedData);
}
initializeEquipmentList();
document.querySelector('.menu-toggle').addEventListener('click', toggleNav);
window.addEventListener('load', sendIframeHeight);
window.addEventListener('resize', sendIframeHeight);
document.getElementById('equipment-search').addEventListener('input', sendIframeHeight);
document.getElementById('sub-category').addEventListener('change', sendIframeHeight);
document.getElementById('prev-page').addEventListener('click', sendIframeHeight);
document.getElementById('next-page').addEventListener('click', sendIframeHeight);
document.getElementById('statusForm').addEventListener('submit', sendIframeHeight);
document.getElementById('equipmentForm').addEventListener('submit', sendIframeHeight);

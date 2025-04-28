// LogiFour.js

const equipmentData = {
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

// 導航選單顯示/隱藏（建議 2）
function toggleSidebar() {
    const nav = document.getElementById('dropdown-nav');
    nav.classList.toggle('active');
}

// 更新子分類選單
function updateSubCategoryOptions(mainCategory) {
    const subCategorySelect = document.getElementById('sub-category');
    subCategorySelect.innerHTML = '<option value="" disabled selected>選擇子類型</option>';
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
    updateSerialSelect();
    updateEquipmentDetails(serials);
    document.getElementById('dropdown-nav').classList.remove('active'); // 行動裝置上收起導航
}

// 更新序號選單
function updateSerialSelect() {
    const serialSelect = document.getElementById('serialNumber');
    serialSelect.innerHTML = '<option value="" disabled selected>請選擇序號</option>';
    currentSerials.forEach(serial => {
        serialSelect.innerHTML += `<option value="${serial}">${serial}</option>`;
    });
}

// 更新裝備表格
function updateEquipmentDetails(serials) {
    const tableBody = document.getElementById('equipmentTable').querySelector('tbody');
    tableBody.innerHTML = '';
    serials.forEach(serial => {
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
}

// 刪除表格行
function deleteRow(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

// 表單提交
document.getElementById('statusForm').addEventListener('submit', function (e) {
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
    }

    // 顯示模態框（建議 2）
    const modal = document.getElementById('form-modal');
    const message = document.getElementById('form-message');
    message.textContent = '現況已成功提交！';
    modal.style.display = 'block';

    this.reset();
    updateSerialSelect();
});

// 模態框關閉
function closeFormModal() {
    document.getElementById('form-modal').style.display = 'none';
}

document.querySelector('#form-modal .close-button').addEventListener('click', closeFormModal);

// 巢狀下拉選單邏輯（建議 2）
document.getElementById('main-category').addEventListener('change', function() {
    const mainCategory = this.value;
    updateSubCategoryOptions(mainCategory);
});

document.getElementById('sub-category').addEventListener('change', function() {
    const mainCategory = document.getElementById('main-category').value;
    const subCategory = this.value;
    if (mainCategory && subCategory) {
        showEquipment(mainCategory, subCategory);
    }
});

// 返回頂部（若需要）
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

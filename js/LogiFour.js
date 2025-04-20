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

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.style.transform = sidebar.style.transform === 'translateX(0)' ? 'translateX(-100%)' : 'translateX(0)';
}

function toggleSubMenu(menuId) {
    const subMenu = document.getElementById(menuId);
    subMenu.style.display = subMenu.style.display === 'block' ? 'none' : 'block';
}

function showEquipment(type, item) {
    const serials = equipmentData[type][item];
    currentSerials = serials;
    updateSerialSelect();
    document.getElementById('sidebar').style.transform = 'translateX(-100%)';
    updateEquipmentDetails(serials);
}

function updateSerialSelect() {
    const serialSelect = document.getElementById('serialNumber');
    serialSelect.innerHTML = '<option value="" disabled selected>請選擇序號</option>';
    currentSerials.forEach(serial => {
        serialSelect.innerHTML += `<option value="${serial}">${serial}</option>`;
    });
}

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

function deleteRow(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}

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
                if (index === 1) {
                    cell.textContent = formData.status;
                } else if (index === 2) {
                    cell.textContent = formData.notes;
                } else if (index === 3) {
                    cell.textContent = formData.entryDate;
                } else if (index === 4) {
                    cell.textContent = formData.enteredBy;
                }
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

    this.reset();
    updateSerialSelect();
    document.getElementById('sidebar').style.transform = 'translateX(0)';
});
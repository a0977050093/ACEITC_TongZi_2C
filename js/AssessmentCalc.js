function addTrainingRecord() {
    const trainingList = document.getElementById('training-list');
    const recordDiv = document.createElement('div');
    recordDiv.className = 'training-record';
    recordDiv.innerHTML = `
        <input type="text" class="date-picker training-start" placeholder="例如 114/01/01" required>
        <span>至</span>
        <input type="text" class="date-picker training-end" placeholder="例如 114/01/01" required>
        <button type="button" onclick="this.parentElement.remove()">刪除</button>
    `;
    trainingList.appendChild(recordDiv);

    // 初始化 flatpickr
    flatpickr(recordDiv.querySelector('.training-start'), {
        dateFormat: 'Z',
        altInput: true,
        altFormat: 'Y/m/d',
        minDate: '2011-01-01', // 民國 100
        maxDate: '2031-12-31', // 民國 120
        onChange: function(selectedDates, dateStr, instance) {
            const date = selectedDates[0];
            if (date) {
                const minguoYear = date.getFullYear() - 1911;
                instance.altInput.value = `${minguoYear}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
            }
        }
    });
    flatpickr(recordDiv.querySelector('.training-end'), {
        dateFormat: 'Z',
        altInput: true,
        altFormat: 'Y/m/d',
        minDate: '2011-01-01',
        maxDate: '2031-12-31',
        onChange: function(selectedDates, dateStr, instance) {
            const date = selectedDates[0];
            if (date) {
                const minguoYear = date.getFullYear() - 1911;
                instance.altInput.value = `${minguoYear}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
            }
        }
    });
}

function validateDate(dateStr) {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
}

function parseDate(dateStr) {
    const date = new Date(dateStr);
    return {
        year: date.getFullYear() - 1911, // 民國年份
        month: date.getMonth() + 1,
        day: date.getDate(),
        gregorianYear: date.getFullYear()
    };
}

function formatDate(date) {
    const mYear = date.getFullYear() - 1911;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${mYear}/${month}/${day}`;
}

function calculateAge(birthDate, leaveYear) {
    const birth = parseDate(birthDate);
    const birthGregorianYear = birth.gregorianYear;
    const birthMonth = birth.month;
    const birthDay = birth.day;
    const leaveGregorianYear = leaveYear + 1911;
    
    let age = leaveGregorianYear - birthGregorianYear;
    const today = new Date(leaveGregorianYear, 11, 31); // 以慰休年度年底為基準
    const birthThisYear = new Date(leaveGregorianYear, birthMonth - 1, birthDay);
    
    if (today < birthThisYear) {
        age--; // 未過生日，減 1
    }
    return age;
}

function getFitnessStandards(age, gender) {
    let ageGroup;
    if (age >= 19 && age <= 29) ageGroup = '19-29';
    else if (age >= 30 && age <= 44) ageGroup = '30-44';
    else if (age >= 45 && age <= 59) ageGroup = '45-59';
    else return null; // 年齡不在範圍內

    const standards = {
        male: { // 上肢肌力
            '19-29': {
                '俯臥撐': { pass: '40 下', good: '21 下', excellent: '5 下' },
                '掌上壓': { pass: '55 下', good: '35 下', excellent: '5 下' },
                '學力訓練': { pass: '20 秒', good: '14 秒', excellent: '8 秒' }
            },
            '30-44': {
                '俯臥撐': { pass: '30 下', good: '15 下', excellent: '3 下' },
                '掌上壓': { pass: '45 下', good: '30 下', excellent: '3 下' },
                '學力訓練': { pass: '14 秒', good: '10 秒', excellent: '6 秒' }
            },
            '45-59': {
                '俯臥撐': { pass: '20 下', good: '8 下', excellent: '2 下' },
                '掌上壓': { pass: '30 下', good: '20 下', excellent: '2 下' },
                '學力訓練': { pass: '8 秒', good: '6 秒', excellent: '4 秒' }
            }
        },
        female: { // 腹部核心肌力
            '19-29': {
                '平板撐體': { pass: '1 分 50 秒', good: '1 分 40 秒', excellent: '1 分 20 秒' },
                '仰臥起坐': { pass: '20 下', good: '12 下', excellent: '8 下' },
                '仰臥抬腿': { pass: '14 分 45 秒', good: '16 分 30 秒', excellent: '18 分 00 秒' },
                '5 分鐘 跳繩': { pass: '530 下', good: '430 下', excellent: '330 下' },
                '5 分鐘 跑步': { pass: '40 分 20 秒', good: '44 分 20 秒', excellent: '25 分 30 秒' },
                '2000 公尺 衝刺': { pass: '72 趟', good: '53 趟', excellent: '30 趟' }
            },
            '30-44': {
                '平板撐體': { pass: '1 分 40 秒', good: '1 分 20 秒', excellent: '1 分 15 秒' },
                '仰臥起坐': { pass: '17 下', good: '10 下', excellent: '6 下' },
                '仰臥抬腿': { pass: '19 分 00 秒', good: '21 分 00 秒', excellent: '22 分 00 秒' },
                '5 分鐘 跳繩': { pass: '499 下', good: '399 下', excellent: '299 下' },
                '5 分鐘 跑步': { pass: '41 分 40 秒', good: '45 分 50 秒', excellent: '27 分 00 秒' },
                '2000 公尺 衝刺': { pass: '61 趟', good: '45 趟', excellent: '25 趟' }
            },
            '45-59': {
                '平板撐體': { pass: '1 分 20 秒', good: '1 分 15 秒', excellent: '1 分 10 秒' },
                '仰臥起坐': { pass: '15 下', good: '8 下', excellent: '4 下' },
                '仰臥抬腿': { pass: '21 分 00 秒', good: '22 分 00 秒', excellent: '23 分 00 秒' },
                '5 分鐘 跳繩': { pass: '462 下', good: '362 下', excellent: '262 下' },
                '5 分鐘 跑步': { pass: '45 分 00 秒', good: '49 分 00 秒', excellent: '28 分 30 秒' },
                '2000 公尺 衝刺': { pass: '40 趟', good: '30 趟', excellent: '20 趟' }
            }
        }
    };

    return standards[gender][ageGroup] || null;
}

function getClothingPoints(seniority) {
    const years = Math.floor(seniority / 12); // 取整數年份
    if (years >= 3) return 9860;
    else if (years === 2) return 6470;
    else if (years === 1) return 4134;
    else return 0; // 未滿 1 年為 0 點
}

function calculateAll() {
    const leaveYear = parseInt(document.getElementById('leave-year').value);
    const birthDate = document.getElementById('birth-date').value;
    const gender = document.getElementById('gender').value;
    const arrivalDate = document.getElementById('arrival-date').value;
    const appointDate = document.getElementById('appoint-date').value;
    const isReenlist = document.getElementById('is-reenlist').checked;
    const reenlistDate = isReenlist ? document.getElementById('reenlist-date').value : null;
    const firstRetireDate = isReenlist ? document.getElementById('first-retire-date').value : null;
    const trainingRecords = Array.from(document.querySelectorAll('.training-record')).map(record => ({
        start: record.querySelector('.training-start').value,
        end: record.querySelector('.training-end').value
    }));
    const resultDiv = document.getElementById('result');

    // 驗證輸入
    if (!leaveYear || !birthDate || !gender || !arrivalDate || !appointDate) {
        resultDiv.innerHTML = '<p class="error">請填寫所有必填欄位！</p>';
        return;
    }
    if (isReenlist && (!reenlistDate || !firstRetireDate)) {
        resultDiv.innerHTML = '<p class="error">請填寫所有再入營相關欄位！</p>';
        return;
    }
    if (!validateDate(birthDate) || !validateDate(arrivalDate) || !validateDate(appointDate) || (isReenlist && (!validateDate(reenlistDate) || !validateDate(firstRetireDate)))) {
        resultDiv.innerHTML = '<p class="error">請輸入有效的日期！</p>';
        return;
    }
    for (let record of trainingRecords) {
        if (!record.start || !record.end || !validateDate(record.start) || !validateDate(record.end)) {
            resultDiv.innerHTML = '<p class="error">請確保所有受訓記錄的開始和結束日期有效！</p>';
            return;
        }
    }

    // 進階日期驗證
    const leaveYearEnd = new Date(leaveYear + 1911, 11, 31);
    const birthDateObj = new Date(birthDate);
    const arrivalDateObj = new Date(arrivalDate);
    const appointDateObj = new Date(appointDate);
    const reenlistDateObj = isReenlist ? new Date(reenlistDate) : null;
    const firstRetireDateObj = isReenlist ? new Date(firstRetireDate) : null;

    if (appointDateObj > arrivalDateObj) {
        resultDiv.innerHTML = '<p class="error">任官日期應早於到部日期！</p>';
        return;
    }
    if (isReenlist && firstRetireDateObj >= reenlistDateObj) {
        resultDiv.innerHTML = '<p class="error">再入營/復職日期應晚於第一次退伍/育嬰生效日期！</p>';
        return;
    }
    if (birthDateObj > appointDateObj) {
        resultDiv.innerHTML = '<p class="error">出生日期應早於任官日期！</p>';
        return;
    }
    if (arrivalDateObj > leaveYearEnd || appointDateObj > leaveYearEnd || birthDateObj > leaveYearEnd || (isReenlist && (reenlistDateObj > leaveYearEnd || firstRetireDateObj > leaveYearEnd))) {
        resultDiv.innerHTML = '<p class="error">所有日期不得晚於慰休年度的 12 月 31 日！</p>';
        return;
    }
    for (let record of trainingRecords) {
        const startDate = new Date(record.start);
        const endDate = new Date(record.end);
        if (startDate > endDate) {
            resultDiv.innerHTML = '<p class="error">受訓記錄的結束日期應晚於開始日期！</p>';
            return;
        }
        if (startDate > leaveYearEnd || endDate > leaveYearEnd) {
            resultDiv.innerHTML = '<p class="error">受訓記錄日期不得晚於慰休年度的 12 月 31 日！</p>';
            return;
        }
    }

    // 解析日期
    const birth = parseDate(birthDate);
    const arrival = parseDate(arrivalDate);
    const appoint = parseDate(appointDate);
    const reenlist = isReenlist ? parseDate(reenlistDate) : null;
    const firstRetire = isReenlist ? parseDate(firstRetireDate) : null;
    const gregorianLeaveYear = leaveYear + 1911;

    // 計算年齡
    const age = calculateAge(birthDate, leaveYear);
    if (age < 19 || age > 59) {
        resultDiv.innerHTML = '<p class="error">年齡必須在 19 至 59 歲之間！</p>';
        return;
    }

    // 獲取體能標準
    const fitnessStandards = getFitnessStandards(age, gender);
    if (!fitnessStandards) {
        resultDiv.innerHTML = '<p class="error">無法獲取體能標準，年齡不在範圍內！</p>';
        return;
    }

    // 到部日期計算
    let resultHTML = '<h3>考核表計算結果</h3>';
    const arrivalDateObjCalc = new Date(arrival.gregorianYear, arrival.month - 1, arrival.day);

    // 計算連續三個月
    const months = [];
    let currentDate = new Date(arrivalDateObjCalc);
    for (let i = 0; i < 3; i++) {
        const startDate = new Date(currentDate);
        currentDate.setMonth(currentDate.getMonth() + 1);
        const endDate = new Date(currentDate);
        months.push(`連續第${i + 1}個月：${formatDate(startDate)} - ${formatDate(endDate)}`);
    }

    // 計算連續四季
    const quarters = [];
    const quarterEnds = [
        { month: 2, day: 31 }, // 3月31日
        { month: 5, day: 30 }, // 6月30日
        { month: 8, day: 30 }, // 9月30日
        { month: 11, day: 31 } // 12月31日
    ];

    currentDate.setDate(currentDate.getDate() + 1);
    for (let i = 0; i < 4; i++) {
        const startDate = new Date(currentDate);
        let quarterIndex = 0;
        let endYear = startDate.getFullYear();
        for (let j = 0; j < quarterEnds.length; j++) {
            const qEnd = new Date(endYear, quarterEnds[j].month, quarterEnds[j].day);
            if (startDate < qEnd) {
                quarterIndex = j;
                break;
            }
            if (j === quarterEnds.length - 1) {
                quarterIndex = 0;
                endYear++;
            }
        }
        const endDate = new Date(endYear, quarterEnds[quarterIndex].month, quarterEnds[quarterIndex].day);
        quarters.push(`連續四季第${i + 1}季：${formatDate(startDate)} - ${formatDate(endDate)}`);
        currentDate = new Date(endDate);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // 儲存第四季結束日期作為解管時間
    const quarterEndDate = new Date(currentDate);
    quarterEndDate.setDate(quarterEndDate.getDate() - 1);
    const releaseTime = formatDate(quarterEndDate);

    // 計算上下半年
    const halfYear = [];
    const isAfterJuly = quarterEndDate.getMonth() >= 6;
    if (isAfterJuly) {
        const nextYear = quarterEndDate.getFullYear() + 1;
        const halfYear1Start = new Date(nextYear, 0, 1);
        const halfYear1End = new Date(nextYear, 4, 10);
        halfYear.push(`上下半年上半年：${formatDate(halfYear1Start)} - ${formatDate(halfYear1End)}`);
        const halfYear2Start = new Date(nextYear, 6, 1);
        const halfYear2End = new Date(nextYear, 9, 10);
        halfYear.push(`上下半年下半年：${formatDate(halfYear2Start)} - ${formatDate(halfYear2End)}`);
    } else {
        const halfYear1Start = new Date(currentDate);
        let halfYear1EndYear = halfYear1Start.getFullYear();
        let halfYear1End = new Date(halfYear1EndYear, 4, 10);
        if (halfYear1Start > halfYear1End) {
            halfYear1EndYear++;
            halfYear1End = new Date(halfYear1EndYear, 4, 10);
        }
        halfYear.push(`上下半年上半年：${formatDate(halfYear1Start)} - ${formatDate(halfYear1End)}`);
        let halfYear2StartYear = halfYear1End.getFullYear();
        let halfYear2Start = new Date(halfYear2StartYear, 6, 1);
        if (halfYear1End >= halfYear2Start) {
            halfYear2StartYear++;
            halfYear2Start = new Date(halfYear2StartYear, 6, 1);
        }
        const halfYear2End = new Date(halfYear2StartYear, 9, 10);
        halfYear.push(`上下半年下半年：${formatDate(halfYear2Start)} - ${formatDate(halfYear2End)}`);
    }

    resultHTML += `
        <h4>連續三個月</h4>
        <p>${months.join('<br>')}</p>
        <h4>連續四季</h4>
        <p>${quarters.join('<br>')}</p>
        <h4>上下半年</h4>
        <p>${halfYear.join('<br>')}</p>
        <div class="release-time">解管時間：${releaseTime}</div>
    `;

    // 慰勞假計算
    resultHTML += '<h3>慰勞假計算結果</h3>';
    let totalSeniority = 0;
    if (isReenlist) {
        totalSeniority = 
            ((leaveYear - 1 - reenlist.year) * 12 + 12 - reenlist.month) +
            ((firstRetire.year - appoint.year) * 12 + (firstRetire.month - appoint.month));
    } else {
        totalSeniority = (leaveYear - 1 - appoint.year) * 12 + 12 - appoint.month;
    }

    function getLeaveDays(seniority) {
        const years = seniority / 12;
        if (years >= 14) return 30;
        else if (years >= 9) return 28;
        else if (years >= 6) return 21;
        else if (years >= 3) return 14;
        else return 7;
    }
    let leaveDays = getLeaveDays(totalSeniority);

    const isFirstYear = leaveYear === appoint.year + 1 && appoint.month > 1;
    const adat = Array(13).fill().map(() => Array(32).fill(1));
    let inServiceMonths = 12;

    if (isFirstYear) {
        inServiceMonths = 0;
        for (let i = 1; i <= 12; i++) {
            adat[i].fill(0);
            if (i >= appoint.month) {
                const startDay = i === appoint.month ? appoint.day : 1;
                const daysInMonth = new Date(gregorianLeaveYear, i, 0).getDate();
                for (let j = startDay; j <= daysInMonth; j++) {
                    adat[i][j] = 1;
                }
                inServiceMonths++;
            }
        }
    }

    if (isReenlist) {
        for (let i = 1; i <= 12; i++) {
            const daysInMonth = new Date(gregorianLeaveYear, i, 0).getDate();
            for (let j = 1; j <= daysInMonth; j++) {
                const currentDate = new Date(gregorianLeaveYear, i - 1, j);
                const retireDate = new Date(firstRetire.gregorianYear, firstRetire.month - 1, firstRetire.day);
                const reenlistDate = new Date(reenlist.gregorianYear, reenlist.month - 1, reenlist.day);
                if (currentDate >= retireDate && currentDate < reenlistDate) {
                    adat[i][j] = 0;
                }
            }
        }
    }

    trainingRecords.forEach(record => {
        const startDate = new Date(record.start);
        const endDate = new Date(record.end);
        if (startDate.getFullYear() === gregorianLeaveYear) {
            if (startDate.getMonth() === endDate.getMonth()) {
                for (let j = startDate.getDate(); j <= endDate.getDate(); j++) {
                    adat[startDate.getMonth() + 1][j] = 0;
                }
            } else {
                for (let i = startDate.getMonth() + 1; i <= endDate.getMonth() + 1; i++) {
                    const startDay = i === startDate.getMonth() + 1 ? startDate.getDate() : 1;
                    const endDay = i === endDate.getMonth() + 1 ? endDate.getDate() : new Date(gregorianLeaveYear, i, 0).getDate();
                    for (let j = startDay; j <= endDay; j++) {
                        adat[i][j] = 0;
                    }
                }
            }
        }
    });

    inServiceMonths = 0;
    const monthlyStatus = [];
    for (let i = 1; i <= 12; i++) {
        let isInService = false;
        const daysInMonth = new Date(gregorianLeaveYear, i, 0).getDate();
        for (let j = 1; j <= daysInMonth; j++) {
            if (adat[i][j] === 1) {
                isInService = true;
                inServiceMonths++;
                break;
            }
        }
        monthlyStatus.push({ month: i, inService: isInService });
    }

    let actualLeaveDays = leaveDays * (inServiceMonths / 12);
    actualLeaveDays = Math.round(actualLeaveDays * 100) / 100;

    function roundHalfDay(days) {
        if (days % 1 > 0.5) {
            return Math.floor(days) + 1;
        } else if (days % 1 > 0) {
            return Math.floor(days) + 0.5;
        }
        return Math.floor(days);
    }
    actualLeaveDays = roundHalfDay(actualLeaveDays);

    function calculateAllowance(days) {
        if (days >= 14) return 16000;
        else if (days === 10.5) return 12000;
        else if (days === 7) return 8000;
        else if (days === 3.5) return 4000;
        else {
            let money = days * 1143;
            return Math.round(money);
        }
    }
    const allowance = calculateAllowance(actualLeaveDays);

    // 計算服裝APP核配點數
    const clothingPoints = getClothingPoints(totalSeniority);

    resultHTML += `
        <table class="result-table">
            <tr><th>總年資</th><td>${(totalSeniority / 12).toFixed(2)} 年（${totalSeniority} 個月）</td></tr>
            <tr><th>應得慰勞假</th><td>${leaveDays} 天</td></tr>
            <tr><th>在職月數</th><td>${inServiceMonths} 個月</td></tr>
            <tr><th>實際慰勞假</th><td>${actualLeaveDays} 天</td></tr>
            <tr><th>休假補助費</th><td>${allowance} 元</td></tr>
            <tr><th>服裝APP年度核配點數</th><td>${clothingPoints} 點</td></tr>
            <tr><th>出生日期</th><td>${formatDate(new Date(birthDate))}</td></tr>
            <tr><th>年齡</th><td>${age} 歲</td></tr>
            <tr><th>性別</th><td>${gender === 'male' ? '男' : '女'}</td></tr>
            <tr><th>到部日期</th><td>${formatDate(new Date(arrivalDate))}</td></tr>
            <tr><th>任官日期</th><td>${formatDate(new Date(appointDate))}</td></tr>
            ${isReenlist ? `
                <tr><th>再入營/復職日期</th><td>${formatDate(new Date(reenlistDate))}</td></tr>
                <tr><th>第一次退伍/育嬰生效日期</th><td>${formatDate(new Date(firstRetireDate))}</td></tr>
            ` : ''}
        </table>
        <h4>每月在職狀態</h4>
        <ul class="list-group">
    `;
    monthlyStatus.forEach(status => {
        const className = status.inService ? 'list-group-item-success' : 'list-group-item-danger';
        const text = status.inService ? `${status.month}月 在職` : `${status.month}月 不在職`;
        resultHTML += `<li class="list-group-item ${className}">${text}</li>`;
    });
    resultHTML += '</ul>';
    if (trainingRecords.length > 0) {
        resultHTML += `
            <h4>受訓記錄</h4>
            <ul class="list-group">
        `;
        trainingRecords.forEach(record => {
            resultHTML += `<li class="list-group-item">${formatDate(new Date(record.start))} 至 ${formatDate(new Date(record.end))}</li>`;
        });
        resultHTML += '</ul>';
    }

    // 體能標準結果
    resultHTML += `
        <h3>體能多元標準（${age} 歲，${gender === 'male' ? '上肢肌力（男）' : '腹部核心肌力（女）'}）</h3>
        <table class="result-table">
            <tr><th>項目</th><th>合格</th><th>優秀</th><th>傑出</th></tr>
    `;
    for (let test in fitnessStandards) {
        resultHTML += `
            <tr>
                <td>${test}</td>
                <td>${fitnessStandards[test].pass}</td>
                <td>${fitnessStandards[test].good}</td>
                <td>${fitnessStandards[test].excellent}</td>
            </tr>
        `;
    }
    resultHTML += '</table>';

    resultDiv.innerHTML = resultHTML;
}

// 初始化 flatpickr 和慰休年度下拉選單
document.addEventListener('DOMContentLoaded', () => {
    // 初始化日期選擇器
    document.querySelectorAll('.date-picker').forEach(picker => {
        flatpickr(picker, {
            dateFormat: 'Z',
            altInput: true,
            altFormat: 'Y/m/d',
            minDate: '2011-01-01', // 民國 100
            maxDate: '2031-12-31', // 民國 120
            onChange: function(selectedDates, dateStr, instance) {
                const date = selectedDates[0];
                if (date) {
                    const minguoYear = date.getFullYear() - 1911;
                    instance.altInput.value = `${minguoYear}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
                }
            }
        });
    });

    // 初始化慰休年度下拉選單
    const leaveYearSelect = document.getElementById('leave-year');
    for (let year = 100; year <= 120; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        leaveYearSelect.appendChild(option);
    }

    // 初始化一筆受訓記錄
    addTrainingRecord();
});

// 動態顯示再入營輸入欄位
document.getElementById('is-reenlist').addEventListener('change', function() {
    const reenlistDetails = document.getElementById('reenlist-details');
    reenlistDetails.style.display = this.checked ? 'block' : 'none';
    if (this.checked) {
        flatpickr('#reenlist-date', {
            dateFormat: 'Z',
            altInput: true,
            altFormat: 'Y/m/d',
            minDate: '2011-01-01',
            maxDate: '2031-12-31',
            onChange: function(selectedDates, dateStr, instance) {
                const date = selectedDates[0];
                if (date) {
                    const minguoYear = date.getFullYear() - 1911;
                    instance.altInput.value = `${minguoYear}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
                }
            }
        });
        flatpickr('#first-retire-date', {
            dateFormat: 'Z',
            altInput: true,
            altFormat: 'Y/m/d',
            minDate: '2011-01-01',
            maxDate: '2031-12-31',
            onChange: function(selectedDates, dateStr, instance) {
                const date = selectedDates[0];
                if (date) {
                    const minguoYear = date.getFullYear() - 1911;
                    instance.altInput.value = `${minguoYear}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
                }
            }
        });
    }
});

function populateDateOptions(yearSelect, monthSelect, daySelect, minYear, maxYear) {
    for (let year = minYear; year <= maxYear; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        monthSelect.appendChild(option);
    }
    function updateDays() {
        const year = parseInt(yearSelect.value);
        const month = parseInt(monthSelect.value);
        daySelect.innerHTML = '<option value="">日</option>';
        if (year && month) {
            const gregorianYear = year + 1911;
            const daysInMonth = new Date(gregorianYear, month, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const option = document.createElement('option');
                option.value = day;
                option.textContent = day;
                daySelect.appendChild(option);
            }
        }
    }
    yearSelect.addEventListener('change', updateDays);
    monthSelect.addEventListener('change', updateDays);
}

function addTrainingRecord() {
    const trainingList = document.getElementById('training-list');
    const recordDiv = document.createElement('div');
    recordDiv.className = 'training-record';
    const uniqueId = Date.now();
    recordDiv.innerHTML = `
        <div class="date-input">
            <select class="training-start-year" id="training-start-year-${uniqueId}">
                <option value="">年</option>
            </select>
            <select class="training-start-month" id="training-start-month-${uniqueId}">
                <option value="">月</option>
            </select>
            <select class="training-start-day" id="training-start-day-${uniqueId}">
                <option value="">日</option>
            </select>
        </div>
        <span>至</span>
        <div class="date-input">
            <select class="training-end-year" id="training-end-year-${uniqueId}">
                <option value="">年</option>
            </select>
            <select class="training-end-month" id="training-end-month-${uniqueId}">
                <option value="">月</option>
            </select>
            <select class="training-end-day" id="training-end-day-${uniqueId}">
                <option value="">日</option>
            </select>
        </div>
        <button type="button" onclick="this.parentElement.remove()">刪除</button>
        <small>年份範圍：80-118</small>
    `;
    trainingList.appendChild(recordDiv);
    const startYearSelect = recordDiv.querySelector(`#training-start-year-${uniqueId}`);
    const startMonthSelect = recordDiv.querySelector(`#training-start-month-${uniqueId}`);
    const startDaySelect = recordDiv.querySelector(`#training-start-day-${uniqueId}`);
    const endYearSelect = recordDiv.querySelector(`#training-end-year-${uniqueId}`);
    const endMonthSelect = recordDiv.querySelector(`#training-end-month-${uniqueId}`);
    const endDaySelect = recordDiv.querySelector(`#training-end-day-${uniqueId}`);
    populateDateOptions(startYearSelect, startMonthSelect, startDaySelect, 80, 118);
    populateDateOptions(endYearSelect, endMonthSelect, endDaySelect, 80, 118);
}

function numberToChinese(num) {
    const chineseNumbers = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
    const units = ['', '拾', '佰', '仟', '萬', '拾萬', '佰萬', '仟萬'];
    if (num === 0) return '零元整';
    let str = '';
    let numStr = num.toString();
    let len = numStr.length;
    for (let i = 0; i < len; i++) {
        let digit = parseInt(numStr[i]);
        let unit = units[len - 1 - i];
        if (digit === 0) {
            if (str[str.length - 1] !== '零') str += '零';
        } else {
            str += chineseNumbers[digit] + unit;
        }
    }
    str = str.replace(/零+/g, '零').replace(/零$/, '');
    if (str.endsWith('萬')) str = str.replace('萬', '');
    return str + '元整';
}

function parseDate(year, month, day) {
    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);
    const gregorianYear = year + 1911;
    return new Date(gregorianYear, month - 1, day);
}

function formatDate(date) {
    const mYear = date.getFullYear() - 1911;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${mYear}/${month}/${day}`;
}

function calculateAge(birthDate, leaveYear) {
    const birthGregorianYear = birthDate.getFullYear();
    const birthMonth = birthDate.getMonth() + 1;
    const birthDay = birthDate.getDate();
    const leaveGregorianYear = leaveYear + 1911;
    let age = leaveGregorianYear - birthGregorianYear;
    const today = new Date(leaveGregorianYear, 11, 31);
    const birthThisYear = new Date(leaveGregorianYear, birthMonth - 1, birthDay);
    if (today < birthThisYear) {
        age--;
    }
    return age;
}

function getFitnessStandards(age, gender) {
    let ageGroup;
    if (age >= 19 && age <= 29) ageGroup = '19-29';
    else if (age >= 30 && age <= 44) ageGroup = '30-44';
    else if (age >= 45 && age <= 59) ageGroup = '45-59';
    else return null;

    const standards = {
        male: {
            '19-29': {
                '上肢肌群 - 伏地挺身': { pass: '40 下', good: '', excellent: '' },
                '上肢肌群 - 壺鈴平舉': { pass: '55 下', good: '', excellent: '' },
                '上肢肌群 - 引體向上': { pass: '5 下', good: '', excellent: '' },
                '腹部核心肌群 - 平板撐體': { pass: "1'50\"", good: '', excellent: '' },
                '腹部核心肌群 - 仰臥捲腹': { pass: '20 下', good: '', excellent: '' },
                '下肢肌力 - 3000 公尺跑步': { pass: "14'45\"", good: '', excellent: '' },
                '下肢肌力 - 5000 公尺健走': { pass: "40'20\"", good: '', excellent: '' },
                '下肢肌力 - 800 公尺游走': { pass: "25'30\"", good: '', excellent: '' },
                '下肢肌力 - 20 公尺折返跑': { pass: '72 趟', good: '', excellent: '' },
                '下肢肌力 - 5 分鐘跳繩': { pass: '530 下', good: '', excellent: '' }
            },
            '30-44': {
                '上肢肌群 - 伏地挺身': { pass: '30 下', good: '', excellent: '' },
                '上肢肌群 - 壺鈴平舉': { pass: '45 下', good: '', excellent: '' },
                '上肢肌群 - 引體向上': { pass: '3 下', good: '', excellent: '' },
                '腹部核心肌群 - 平板撐體': { pass: "1'40\"", good: '', excellent: '' },
                '腹部核心肌群 - 仰臥捲腹': { pass: '17 下', good: '', excellent: '' },
                '下肢肌力 - 3000 公尺跑步': { pass: "16'30\"", good: '', excellent: '' },
                '下肢肌力 - 5000 公尺健走': { pass: "41'40\"", good: '', excellent: '' },
                '下肢肌力 - 800 公尺游走': { pass: "27'00\"", good: '', excellent: '' },
                '下肢肌力 - 20 公尺折返跑': { pass: '61 趟', good: '', excellent: '' },
                '下肢肌力 - 5 分鐘跳繩': { pass: '499 下', good: '', excellent: '' }
            },
            '45-59': {
                '上肢肌群 - 伏地挺身': { pass: '20 下', good: '', excellent: '' },
                '上肢肌群 - 壺鈴平舉': { pass: '30 下', good: '', excellent: '' },
                '上肢肌群 - 引體向上': { pass: '2 下', good: '', excellent: '' },
                '腹部核心肌群 - 平板撐體': { pass: "1'20\"", good: '', excellent: '' },
                '腹部核心肌群 - 仰臥捲腹': { pass: '15 下', good: '', excellent: '' },
                '下肢肌力 - 3000 公尺跑步': { pass: "18'00\"", good: '', excellent: '' },
                '下肢肌力 - 5000 公尺健走': { pass: "45'00\"", good: '', excellent: '' },
                '下肢肌力 - 800 公尺游走': { pass: "28'30\"", good: '', excellent: '' },
                '下肢肌力 - 20 公尺折返跑': { pass: '40 趟', good: '', excellent: '' },
                '下肢肌力 - 5 分鐘跳繩': { pass: '462 下', good: '', excellent: '' }
            }
        },
        female: {
            '19-29': {
                '上肢肌群 - 伏地挺身': { pass: '21 下', good: '', excellent: '' },
                '上肢肌群 - 壺鈴平舉': { pass: '35 下', good: '', excellent: '' },
                '上肢肌群 - 屈臂懸垂': { pass: '20 秒', good: '', excellent: '' },
                '腹部核心肌群 - 平板撐體': { pass: "1'40\"", good: '', excellent: '' },
                '腹部核心肌群 - 仰臥捲腹': { pass: '12 下', good: '', excellent: '' },
                '下肢肌力 - 3000 公尺跑步': { pass: "17'35\"", good: '', excellent: '' },
                '下肢肌力 - 5000 公尺健走': { pass: "44'20\"", good: '', excellent: '' },
                '下肢肌力 - 800 公尺游走': { pass: "28'30\"", good: '', excellent: '' },
                '下肢肌力 - 20 公尺折返跑': { pass: '53 趟', good: '', excellent: '' },
                '下肢肌力 - 5 分鐘跳繩': { pass: '430 下', good: '', excellent: '' }
            },
            '30-44': {
                '上肢肌群 - 伏地挺身': { pass: '15 下', good: '', excellent: '' },
                '上肢肌群 - 壺鈴平舉': { pass: '30 下', good: '', excellent: '' },
                '上肢肌群 - 屈臂懸垂': { pass: '14 秒', good: '', excellent: '' },
                '腹部核心肌群 - 平板撐體': { pass: "1'20\"", good: '', excellent: '' },
                '腹部核心肌群 - 仰臥捲腹': { pass: '10 下', good: '', excellent: '' },
                '下肢肌力 - 3000 公尺跑步': { pass: "19'00\"", good: '', excellent: '' },
                '下肢肌力 - 5000 公尺健走': { pass: "45'50\"", good: '', excellent: '' },
                '下肢肌力 - 800 公尺游走': { pass: "30'00\"", good: '', excellent: '' },
                '下肢肌力 - 20 公尺折返跑': { pass: '45 趟', good: '', excellent: '' },
                '下肢肌力 - 5 分鐘跳繩': { pass: '399 下', good: '', excellent: '' }
            },
            '45-59': {
                '上肢肌群 - 伏地挺身': { pass: '8 下', good: '', excellent: '' },
                '上肢肌群 - 壺鈴平舉': { pass: '20 下', good: '', excellent: '' },
                '上肢肌群 - 屈臂懸垂': { pass: '8 秒', good: '', excellent: '' },
                '腹部核心肌群 - 平板撐體': { pass: "1'15\"", good: '', excellent: '' },
                '腹部核心肌群 - 仰臥捲腹': { pass: '8 下', good: '', excellent: '' },
                '下肢肌力 - 3000 公尺跑步': { pass: "21'00\"", good: '', excellent: '' },
                '下肢肌力 - 5000 公尺健走': { pass: "49'00\"", good: '', excellent: '' },
                '下肢肌力 - 800 公尺游走': { pass: "31'30\"", good: '', excellent: '' },
                '下肢肌力 - 20 公尺折返跑': { pass: '30 趟', good: '', excellent: '' },
                '下肢肌力 - 5 分鐘跳繩': { pass: '362 下', good: '', excellent: '' }
            }
        }
    };

    return standards[gender][ageGroup] || null;
}

function getClothingPoints(seniority) {
    const years = Math.floor(seniority / 12);
    if (years >= 3) return 9860;
    else if (years === 2) return 6470;
    else if (years === 1) return 4134;
    else return 0;
}

function calculateAllowance(days) {
    const effectiveDays = Math.min(days, 10);
    const allowance = effectiveDays * 1600;
    const invoiceAmount = effectiveDays * 800;
    return { allowance, invoiceAmount };
}

function clearAll() {
    if (window.confirm('確定要清除所有內容嗎？此操作將刪除所有填寫的資料和計算結果！')) {
        document.getElementById('leave-year').value = '';
        document.getElementById('birth-year').value = '';
        document.getElementById('birth-month').value = '';
        document.getElementById('birth-day').value = '';
        document.getElementById('gender').value = '';
        document.getElementById('use-volunteer-date').checked = true;
        document.getElementById('volunteer-year').value = '';
        document.getElementById('volunteer-month').value = '';
        document.getElementById('volunteer-day').value = '';
        document.getElementById('use-transfer-date').checked = false;
        document.getElementById('transfer-year').value = '';
        document.getElementById('transfer-month').value = '';
        document.getElementById('transfer-day').value = '';
        document.getElementById('is-reenlist').checked = false;
        document.getElementById('reenlist-details').style.display = 'none';
        document.getElementById('reenlist-year').value = '';
        document.getElementById('reenlist-month').value = '';
        document.getElementById('reenlist-day').value = '';
        document.getElementById('first-retire-year').value = '';
        document.getElementById('first-retire-month').value = '';
        document.getElementById('first-retire-day').value = '';
        document.getElementById('has-training').checked = false;
        document.getElementById('training-section').style.display = 'none';
        const trainingList = document.getElementById('training-list');
        trainingList.innerHTML = '';
        addTrainingRecord();
        document.getElementById('result').innerHTML = '';
    }
}

function calculateAll() {
    const leaveYear = parseInt(document.getElementById('leave-year').value);
    const birthYear = document.getElementById('birth-year').value;
    const birthMonth = document.getElementById('birth-month').value;
    const birthDay = document.getElementById('birth-day').value;
    const gender = document.getElementById('gender').value;
    const useVolunteerDate = document.getElementById('use-volunteer-date').checked;
    const volunteerYear = document.getElementById('volunteer-year').value;
    const volunteerMonth = document.getElementById('volunteer-month').value;
    const volunteerDay = document.getElementById('volunteer-day').value;
    const useTransferDate = document.getElementById('use-transfer-date').checked;
    const transferYear = document.getElementById('transfer-year').value;
    const transferMonth = document.getElementById('transfer-month').value;
    const transferDay = document.getElementById('transfer-day').value;
    const isReenlist = document.getElementById('is-reenlist').checked;
    const reenlistYear = isReenlist ? document.getElementById('reenlist-year').value : null;
    const reenlistMonth = isReenlist ? document.getElementById('reenlist-month').value : null;
    const reenlistDay = isReenlist ? document.getElementById('reenlist-day').value : null;
    const firstRetireYear = isReenlist ? document.getElementById('first-retire-year').value : null;
    const firstRetireMonth = isReenlist ? document.getElementById('first-retire-month').value : null;
    const firstRetireDay = isReenlist ? document.getElementById('first-retire-day').value : null;
    const hasTraining = document.getElementById('has-training').checked;
    const trainingRecords = hasTraining ? Array.from(document.querySelectorAll('.training-record')).map(record => ({
        startYear: record.querySelector('.training-start-year').value,
        startMonth: record.querySelector('.training-start-month').value,
        startDay: record.querySelector('.training-start-day').value,
        endYear: record.querySelector('.training-end-year').value,
        endMonth: record.querySelector('.training-end-month').value,
        endDay: record.querySelector('.training-end-day').value
    })) : [];
    const resultDiv = document.getElementById('result');

    if (!leaveYear || !birthYear || !birthMonth || !birthDay || !gender) {
        resultDiv.innerHTML = '<p class="error">請填寫所有基本資料必填欄位！</p>';
        return;
    }
    if (!useVolunteerDate && !useTransferDate) {
        resultDiv.innerHTML = '<p class="error">請至少勾選一個日期選項（志願役生效日期或調任職報到日期）！</p>';
        return;
    }
    if (useVolunteerDate && (!volunteerYear || !volunteerMonth || !volunteerDay)) {
        resultDiv.innerHTML = '<p class="error">請填寫志願役生效日期！</p>';
        return;
    }
    if (useTransferDate && (!transferYear || !transferMonth || !transferDay)) {
        resultDiv.innerHTML = '<p class="error">請填寫調任職報到日期！</p>';
        return;
    }
    if (isReenlist && (!reenlistYear || !reenlistMonth || !reenlistDay || !firstRetireYear || !firstRetireMonth || !firstRetireDay)) {
        resultDiv.innerHTML = '<p class="error">請填寫所有再入營相關欄位！</p>';
        return;
    }
    if (hasTraining) {
        for (let i = 0; i < trainingRecords.length; i++) {
            const record = trainingRecords[i];
            const isEmpty = !record.startYear && !record.startMonth && !record.startDay && !record.endYear && !record.endMonth && !record.endDay;
            const isComplete = record.startYear && record.startMonth && record.startDay && record.endYear && record.endMonth && record.endDay;
            if (!isEmpty && !isComplete) {
                resultDiv.innerHTML = `<p class="error">請確保受訓記錄 ${i + 1} 的開始和結束日期已完整填寫！</p>`;
                return;
            }
        }
    }

    const birthDate = parseDate(birthYear, birthMonth, birthDay);
    const volunteerDate = useVolunteerDate ? parseDate(volunteerYear, volunteerMonth, volunteerDay) : null;
    const transferDate = useTransferDate ? parseDate(transferYear, transferMonth, transferDay) : null;
    const reenlistDate = isReenlist && reenlistYear ? parseDate(reenlistYear, reenlistMonth, reenlistDay) : null;
    const firstRetireDate = isReenlist && firstRetireYear ? parseDate(firstRetireYear, firstRetireMonth, firstRetireDay) : null;
    const trainingDates = hasTraining ? trainingRecords
        .filter(record => record.startYear && record.endYear)
        .map(record => ({
            start: parseDate(record.startYear, record.startMonth, record.startDay),
            end: parseDate(record.endYear, record.endMonth, record.endDay)
        })) : [];

    const gregorianLeaveYear = leaveYear + 1911;
    const leaveYearEnd = new Date(gregorianLeaveYear, 11, 31);

    if (useVolunteerDate) {
        if (birthDate > volunteerDate) {
            resultDiv.innerHTML = '<p class="error">出生日期應早於志願役生效日期！</p>';
            return;
        }
        if (volunteerDate > leaveYearEnd) {
            resultDiv.innerHTML = '<p class="error">志願役生效日期不得晚於慰休年度的 12 月 31 日！</p>';
            return;
        }
    }
    if (useTransferDate) {
        if (birthDate > transferDate) {
            resultDiv.innerHTML = '<p class="error">出生日期應早於調任職報到日期！</p>';
            return;
        }
        if (transferDate > leaveYearEnd) {
            resultDiv.innerHTML = '<p class="error">調任職報到日期不得晚於慰休年度的 12 月 31 日！</p>';
            return;
        }
    }
    if (useVolunteerDate && useTransferDate && volunteerDate > transferDate) {
        resultDiv.innerHTML = '<p class="error">志願役生效日期應早於調任職報到日期！</p>';
        return;
    }
    if (isReenlist && firstRetireDate >= reenlistDate) {
        resultDiv.innerHTML = '<p class="error">再入營/復職日期應晚於第一次退伍/育嬰生效日期！</p>';
        return;
    }
    if (isReenlist && (reenlistDate > leaveYearEnd || firstRetireDate > leaveYearEnd)) {
        resultDiv.innerHTML = '<p class="error">再入營相關日期不得晚於慰休年度的 12 月 31 日！</p>';
        return;
    }
    for (let i = 0; i < trainingDates.length; i++) {
        const record = trainingDates[i];
        if (record.start > record.end) {
            resultDiv.innerHTML = `<p class="error">受訓記錄 ${i + 1} 的結束日期應晚於開始日期！</p>`;
            return;
        }
        if (record.start > leaveYearEnd || record.end > leaveYearEnd) {
            resultDiv.innerHTML = `<p class="error">受訓記錄 ${i + 1} 日期不得晚於慰休年度的 12 月 31 日！</p>`;
            return;
        }
    }

    const age = calculateAge(birthDate, leaveYear);
    if (age < 19 || age > 59) {
        resultDiv.innerHTML = '<p class="error">年齡必須在 19 至 59 歲之間！</p>';
        return;
    }

    const fitnessStandards = getFitnessStandards(age, gender);
    if (!fitnessStandards) {
        resultDiv.innerHTML = '<p class="error">無法獲取體能標準，年齡不在範圍內！</p>';
        return;
    }

    let resultHTML = '';

    let calculateAssessment = false;
    let assessmentDate;
    if (useTransferDate) {
        calculateAssessment = true;
        assessmentDate = transferDate;
    } else if (useVolunteerDate) {
        calculateAssessment = true;
        assessmentDate = volunteerDate;
    }

    if (calculateAssessment) {
        resultHTML += '<div class="card">';
        resultHTML += '<div class="card-header">考核表計算結果</div>';
        resultHTML += '<div class="card-body">';

        // 計算連續三個月
        const months = [];
        let currentDate = new Date(assessmentDate);
        const startYear = currentDate.getFullYear();
        const startMonth = currentDate.getMonth();
        const startDay = currentDate.getDate();
        const daysInStartMonth = new Date(startYear, startMonth + 1, 0).getDate();
        const remainingDays = daysInStartMonth - startDay + 1;

        if (remainingDays >= 5) {
            // 足夠天數：當月到月底 + 下兩個整月
            let endDate = new Date(startYear, startMonth, daysInStartMonth);
            months.push(`連續第1個月：${formatDate(currentDate)} - ${formatDate(endDate)}`);
            currentDate = new Date(startYear, startMonth + 1, 1);
            endDate = new Date(startYear, startMonth + 2, 0);
            months.push(`連續第2個月：${formatDate(currentDate)} - ${formatDate(endDate)}`);
            currentDate = new Date(startYear, startMonth + 2, 1);
            endDate = new Date(startYear, startMonth + 3, 0);
            months.push(`連續第3個月：${formatDate(currentDate)} - ${formatDate(endDate)}`);
            currentDate = new Date(startYear, startMonth + 3, 1); // 下一步的起始日期
        } else {
            // 少於5天：當月到下月底 + 下兩個整月
            let endDate = new Date(startYear, startMonth + 1, 0);
            months.push(`連續第1個月：${formatDate(currentDate)} - ${formatDate(endDate)}`);
            currentDate = new Date(startYear, startMonth + 1, 1);
            endDate = new Date(startYear, startMonth + 2, 0);
            months.push(`連續第2個月：${formatDate(currentDate)} - ${formatDate(endDate)}`);
            currentDate = new Date(startYear, startMonth + 2, 1);
            endDate = new Date(startYear, startMonth + 3, 0);
            months.push(`連續第3個月：${formatDate(currentDate)} - ${formatDate(endDate)}`);
            currentDate = new Date(startYear, startMonth + 3, 1); // 下一步的起始日期
        }

        // 計算連續四季
        const quarters = [];
        const quarterEnds = [
            { month: 2, day: 31 }, // 3/31
            { month: 5, day: 30 }, // 6/30
            { month: 8, day: 30 }, // 9/30
            { month: 11, day: 31 } // 12/31
        ];
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

        // 計算上下半年
        const quarterEndDate = new Date(currentDate);
        quarterEndDate.setDate(quarterEndDate.getDate() - 1);
        const releaseTime = formatDate(quarterEndDate);
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
            <div class="card-content">
                <div class="card-row">
                    <span class="card-label">連續三個月</span>
                    <span class="card-value">${months.join('<br>')}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">連續四季</span>
                    <span class="card-value">${quarters.join('<br>')}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">上下半年</span>
                    <span class="card-value">${halfYear.join('<br>')}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">解管時間</span>
                    <span class="card-value" style="color: red;">${releaseTime}</span>
                </div>
            </div>
        `;
        resultHTML += '</div></div>';
    }

    if (useVolunteerDate) {
        resultHTML += '<div class="card"><div class="card-header">慰勞假計算結果</div><div class="card-body">';

        let totalSeniority = 0;
        if (isReenlist) {
            totalSeniority = 
                ((leaveYear - 1 - parseInt(reenlistYear)) * 12 + 12 - parseInt(reenlistMonth)) +
                ((parseInt(firstRetireYear) - parseInt(volunteerYear)) * 12 + (parseInt(firstRetireMonth) - parseInt(volunteerMonth)));
        } else {
            totalSeniority = (leaveYear - 1 - parseInt(volunteerYear)) * 12 + 12 - parseInt(volunteerMonth);
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

        const isFirstYear = leaveYear === parseInt(volunteerYear) + 1 && parseInt(volunteerMonth) > 1;
        const prevYear = gregorianLeaveYear - 1;
        const adat = Array(13).fill().map(() => Array(32).fill({ status: 1, reason: '' }));

        if (isFirstYear) {
            for (let i = 1; i <= 12; i++) {
                for (let j = 1; j <= 31; j++) {
                    adat[i][j] = { status: 0, reason: '未入職' };
                }
                if (i >= parseInt(volunteerMonth)) {
                    const startDay = i === parseInt(volunteerMonth) ? parseInt(volunteerDay) : 1;
                    const daysInMonth = new Date(gregorianLeaveYear, i, 0).getDate();
                    for (let j = startDay; j <= daysInMonth; j++) {
                        adat[i][j] = { status: 1, reason: '' };
                    }
                }
            }
        }

        if (isReenlist) {
            for (let i = 1; i <= 12; i++) {
                const daysInMonth = new Date(prevYear, i, 0).getDate();
                for (let j = 1; j <= daysInMonth; j++) {
                    const currentDate = new Date(prevYear, i - 1, j);
                    const retireDate = firstRetireDate;
                    const reenlistDate = reenlistDate;
                    if (currentDate >= retireDate && currentDate < reenlistDate) {
                        adat[i][j] = { status: 0, reason: '退伍/育嬰' };
                    }
                }
            }
        }

        trainingDates.forEach(record => {
            if (record.start.getFullYear() === prevYear) {
                if (record.start.getMonth() === record.end.getMonth()) {
                    for (let j = record.start.getDate(); j <= record.end.getDate(); j++) {
                        adat[record.start.getMonth() + 1][j] = { status: 0, reason: '受訓' };
                    }
                } else {
                    for (let i = record.start.getMonth() + 1; i <= record.end.getMonth() + 1; i++) {
                        const startDay = i === record.start.getMonth() + 1 ? record.start.getDate() : 1;
                        const endDay = i === record.end.getMonth() + 1 ? record.end.getDate() : new Date(prevYear, i, 0).getDate();
                        for (let j = startDay; j <= endDay; j++) {
                            adat[i][j] = { status: 0, reason: '受訓' };
                        }
                    }
                }
            }
        });

        let inServiceMonths = 0;
        const monthlyStatus = [];
        for (let i = 1; i <= 12; i++) {
            let isInService = false;
            let monthReason = '';
            const daysInMonth = new Date(prevYear, i, 0).getDate();
            let inServiceDays = 0;

            for (let j = 1; j <= daysInMonth; j++) {
                if (adat[i][j].status === 1) {
                    inServiceDays++;
                } else if (!monthReason) {
                    monthReason = adat[i][j].reason;
                }
            }

            if (inServiceDays > 0) {
                isInService = true;
                inServiceMonths++;
            }

            monthlyStatus.push({ month: i, inService: isInService, reason: monthReason });
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

        const { allowance, invoiceAmount } = calculateAllowance(actualLeaveDays);
        const allowanceChinese = numberToChinese(allowance);
        const invoiceAmountChinese = numberToChinese(invoiceAmount);

        const clothingPoints = getClothingPoints(totalSeniority);

        resultHTML += `
            <div class="card-content">
                <div class="card-row">
                    <span class="card-label">總年資</span>
                    <span class="card-value">${(totalSeniority / 12).toFixed(2)} 年（${totalSeniority} 個月）</span>
                </div>
                <div class="card-row">
                    <span class="card-label">應得慰勞假</span>
                    <span class="card-value">${leaveDays} 天</span>
                </div>
                <div class="card-row">
                    <span class="card-label">在職月數（${leaveYear - 1}年）</span>
                    <span class="card-value">${inServiceMonths} 個月</span>
                </div>
                <div class="card-row">
                    <span class="card-label">實際慰勞假</span>
                    <span class="card-value">${actualLeaveDays} 天</span>
                </div>
                <div class="card-row">
                    <span class="card-label">休假補助費</span>
                    <span class="card-value">${allowance} 元（${allowanceChinese}）</span>
                </div>
                <div class="card-row">
                    <span class="card-label">應繳發票金額</span>
                    <span class="card-value">${invoiceAmount} 元（${invoiceAmountChinese}）</span>
                </div>
                <div class="card-row">
                    <span class="card-label">服裝APP年度核配點數</span>
                    <span class="card-value">${clothingPoints} 點</span>
                </div>
                <div class="card-row">
                    <span class="card-label">出生日期</span>
                    <span class="card-value">${formatDate(birthDate)}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">年齡</span>
                    <span class="card-value">${age} 歲</span>
                </div>
                <div class="card-row">
                    <span class="card-label">性別</span>
                    <span class="card-value">${gender === 'male' ? '男' : '女'}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">志願役生效日期</span>
                    <span class="card-value">${formatDate(volunteerDate)}</span>
                </div>
                ${isReenlist ? `
                    <div class="card-row">
                        <span class="card-label">再入營/復職日期</span>
                        <span class="card-value">${formatDate(reenlistDate)}</span>
                    </div>
                    <div class="card-row">
                        <span class="card-label">第一次退伍/育嬰生效日期</span>
                        <span class="card-value">${formatDate(firstRetireDate)}</span>
                    </div>
                ` : ''}
            </div>
        `;

        resultHTML += `
            <div class="card-content">
                <div class="card-row">
                    <span class="card-label">每月在職狀態（${leaveYear - 1}年）</span>
                </div>
                <div class="status-list">
        `;
        monthlyStatus.forEach(status => {
            let className, text;
            if (status.inService) {
                className = 'status-item status-item-success';
                text = `${status.month}月 在職 👍`;
            } else {
                className = 'status-item status-item-danger';
                if (status.reason === '受訓') {
                    text = `${status.month}月 受訓 📚`;
                } else if (status.reason === '退伍/育嬰') {
                    text = `${status.month}月 退伍/育嬰 👶`;
                } else {
                    text = `${status.month}月 不在職 👎`;
                }
            }
            resultHTML += `<div class="${className}">${text}</div>`;
        });
        resultHTML += '</div></div>';

        if (hasTraining && trainingDates.length > 0) {
            resultHTML += `
                <div class="card-content">
                    <div class="card-row">
                        <span class="card-label">受訓記錄</span>
                    </div>
                    <div class="training-list">
            `;
            trainingDates.forEach(record => {
                if (record.start.getFullYear() === prevYear) {
                    resultHTML += `<div class="training-item">${formatDate(record.start)} 至 ${formatDate(record.end)}</div>`;
                }
            });
            resultHTML += '</div></div>';
        }

        resultHTML += '</div></div>';
    }

    resultHTML += `
        <div class="card">
            <div class="card-header">體能多元標準（${age} 歲）</div>
            <div class="card-body">
                <div class="card-content">
                    <div class="card-row">
                        <span class="card-label">上肢肌群</span>
                    </div>
                    <div class="fitness-list">
    `;
    for (let test in fitnessStandards) {
        if (test.includes('上肢肌群')) {
            resultHTML += `<div class="fitness-item">${test.split(' - ')[1]}：${fitnessStandards[test].pass}</div>`;
        }
    }
    resultHTML += '</div></div>';

    resultHTML += `
        <div class="card-content">
            <div class="card-row">
                <span class="card-label">腹部核心肌群</span>
            </div>
            <div class="fitness-list">
    `;
    for (let test in fitnessStandards) {
        if (test.includes('腹部核心肌群')) {
            resultHTML += `<div class="fitness-item">${test.split(' - ')[1]}：${fitnessStandards[test].pass}</div>`;
        }
    }
    resultHTML += '</div></div>';

    resultHTML += `
        <div class="card-content">
            <div class="card-row">
                <span class="card-label">下肢肌力</span>
            </div>
            <div class="fitness-list">
    `;
    for (let test in fitnessStandards) {
        if (test.includes('下肢肌力')) {
            resultHTML += `<div class="fitness-item">${test.split(' - ')[1]}：${fitnessStandards[test].pass}</div>`;
        }
    }
    resultHTML += '</div></div></div></div>';

    resultDiv.innerHTML = resultHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    const leaveYearSelect = document.getElementById('leave-year');
    for (let year = 112; year <= 118; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        leaveYearSelect.appendChild(option);
    }
    populateDateOptions(
        document.getElementById('birth-year'),
        document.getElementById('birth-month'),
        document.getElementById('birth-day'),
        65, 118
    );
    populateDateOptions(
        document.getElementById('volunteer-year'),
        document.getElementById('volunteer-month'),
        document.getElementById('volunteer-day'),
        80, 118
    );
    populateDateOptions(
        document.getElementById('transfer-year'),
        document.getElementById('transfer-month'),
        document.getElementById('transfer-day'),
        80, 118
    );
    populateDateOptions(
        document.getElementById('reenlist-year'),
        document.getElementById('reenlist-month'),
        document.getElementById('reenlist-day'),
        80, 118
    );
    populateDateOptions(
        document.getElementById('first-retire-year'),
        document.getElementById('first-retire-month'),
        document.getElementById('first-retire-day'),
        80, 118
    );
    addTrainingRecord();
    const calculateButton = document.querySelector('.button-group button[onclick="calculateAll()"]');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateAll);
    }
});

document.getElementById('is-reenlist').addEventListener('change', function() {
    const reenlistDetails = document.getElementById('reenlist-details');
    reenlistDetails.style.display = this.checked ? 'block' : 'none';
});

document.getElementById('has-training').addEventListener('change', function() {
    const trainingSection = document.getElementById('training-section');
    trainingSection.style.display = this.checked ? 'block' : 'none';
});

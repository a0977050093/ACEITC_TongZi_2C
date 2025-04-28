function addTrainingRecord() {
    const trainingList = document.getElementById('training-list');
    const recordDiv = document.createElement('div');
    recordDiv.className = 'training-record';
    recordDiv.innerHTML = `
        <div class="date-input">
            <input type="number" class="training-start-year" placeholder="年，例如 114" min="80" max="118" required>
            <input type="number" class="training-start-month" placeholder="月" min="1" max="12" required>
            <input type="number" class="training-start-day" placeholder="日" min="1" max="31" required>
        </div>
        <span>至</span>
        <div class="date-input">
            <input type="number" class="training-end-year" placeholder="年，例如 114" min="80" max="118" required>
            <input type="number" class="training-end-month" placeholder="月" min="1" max="12" required>
            <input type="number" class="training-end-day" placeholder="日" min="1" max="31" required>
        </div>
        <button type="button" onclick="this.parentElement.remove()">刪除</button>
        <small>年份範圍：80-118</small>
    `;
    trainingList.appendChild(recordDiv);
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
    
    // 移除多餘的「零」
    str = str.replace(/零+/g, '零').replace(/零$/, '');
    if (str.endsWith('萬')) str = str.replace('萬', '');
    
    return str + '元整';
}

function validateDateInput(year, month, day, minYear, maxYear, errorPrefix) {
    if (!year || !month || !day) {
        return `${errorPrefix}：請填寫完整的年、月、日！`;
    }
    year = parseInt(year);
    month = parseInt(month);
    day = parseInt(day);

    // 驗證年份範圍
    if (year < minYear || year > maxYear) {
        return `${errorPrefix}：年份必須在民國 ${minYear}-${maxYear} 之間！`;
    }

    // 驗證月份範圍
    if (month < 1 || month > 12) {
        return `${errorPrefix}：月份必須在 1-12 之間！`;
    }

    // 驗證日期範圍（考慮閏年）
    const gregorianYear = year + 1911;
    const daysInMonth = new Date(gregorianYear, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
        return `${errorPrefix}：日期必須在 1-${daysInMonth} 之間！`;
    }

    // 驗證日期有效性
    const date = new Date(gregorianYear, month - 1, day);
    if (date.getFullYear() !== gregorianYear || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return `${errorPrefix}：日期無效！`;
    }

    return null; // 無錯誤
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

function calculateAllowance(days) {
    // 根據新表格，補助費 = 天數 × 1600 元，發票金額 = 天數 × 800 元
    const allowance = days * 1600;
    const invoiceAmount = days * 800;
    return { allowance, invoiceAmount };
}

function clearAll() {
    if (window.confirm('確定要清除所有內容嗎？此操作將刪除所有填寫的資料和計算結果！')) {
        // 清除輸入欄位
        document.getElementById('leave-year').value = '';
        document.getElementById('birth-year').value = '';
        document.getElementById('birth-month').value = '';
        document.getElementById('birth-day').value = '';
        document.getElementById('gender').value = '';
        document.getElementById('arrival-year').value = '';
        document.getElementById('arrival-month').value = '';
        document.getElementById('arrival-day').value = '';
        document.getElementById('appoint-year').value = '';
        document.getElementById('appoint-month').value = '';
        document.getElementById('appoint-day').value = '';
        document.getElementById('is-reenlist').checked = false;
        document.getElementById('reenlist-details').style.display = 'none';
        document.getElementById('reenlist-year').value = '';
        document.getElementById('reenlist-month').value = '';
        document.getElementById('reenlist-day').value = '';
        document.getElementById('first-retire-year').value = '';
        document.getElementById('first-retire-month').value = '';
        document.getElementById('first-retire-day').value = '';

        // 清除受訓記錄
        const trainingList = document.getElementById('training-list');
        trainingList.innerHTML = '';
        addTrainingRecord(); // 重新添加一筆空白受訓記錄

        // 清除結果顯示
        document.getElementById('result').innerHTML = '';
    }
}

function calculateAll() {
    const leaveYear = parseInt(document.getElementById('leave-year').value);
    const birthYear = document.getElementById('birth-year').value;
    const birthMonth = document.getElementById('birth-month').value;
    const birthDay = document.getElementById('birth-day').value;
    const gender = document.getElementById('gender').value;
    const arrivalYear = document.getElementById('arrival-year').value;
    const arrivalMonth = document.getElementById('arrival-month').value;
    const arrivalDay = document.getElementById('arrival-day').value;
    const appointYear = document.getElementById('appoint-year').value;
    const appointMonth = document.getElementById('appoint-month').value;
    const appointDay = document.getElementById('appoint-day').value;
    const isReenlist = document.getElementById('is-reenlist').checked;
    const reenlistYear = isReenlist ? document.getElementById('reenlist-year').value : null;
    const reenlistMonth = isReenlist ? document.getElementById('reenlist-month').value : null;
    const reenlistDay = isReenlist ? document.getElementById('reenlist-day').value : null;
    const firstRetireYear = isReenlist ? document.getElementById('first-retire-year').value : null;
    const firstRetireMonth = isReenlist ? document.getElementById('first-retire-month').value : null;
    const firstRetireDay = isReenlist ? document.getElementById('first-retire-day').value : null;
    const trainingRecords = Array.from(document.querySelectorAll('.training-record')).map(record => ({
        startYear: record.querySelector('.training-start-year').value,
        startMonth: record.querySelector('.training-start-month').value,
        startDay: record.querySelector('.training-start-day').value,
        endYear: record.querySelector('.training-end-year').value,
        endMonth: record.querySelector('.training-end-month').value,
        endDay: record.querySelector('.training-end-day').value
    }));
    const resultDiv = document.getElementById('result');

    // 驗證輸入
    if (!leaveYear || !birthYear || !birthMonth || !birthDay || !gender || !arrivalYear || !arrivalMonth || !arrivalDay || !appointYear || !appointMonth || !appointDay) {
        resultDiv.innerHTML = '<p class="error">請填寫所有必填欄位！</p>';
        return;
    }
    if (isReenlist && (!reenlistYear || !reenlistMonth || !reenlistDay || !firstRetireYear || !firstRetireMonth || !firstRetireDay)) {
        resultDiv.innerHTML = '<p class="error">請填寫所有再入營相關欄位！</p>';
        return;
    }
    for (let record of trainingRecords) {
        if (!record.startYear || !record.startMonth || !record.startDay || !record.endYear || !record.endMonth || !record.endDay) {
            resultDiv.innerHTML = '<p class="error">請確保所有受訓記錄的開始和結束日期已填寫！</p>';
            return;
        }
    }

    // 驗證日期格式和範圍
    let error = validateDateInput(birthYear, birthMonth, birthDay, 65, 118, '出生日期');
    if (error) {
        resultDiv.innerHTML = `<p class="error">${error}</p>`;
        return;
    }
    error = validateDateInput(arrivalYear, arrivalMonth, arrivalDay, 80, 118, '到部日期');
    if (error) {
        resultDiv.innerHTML = `<p class="error">${error}</p>`;
        return;
    }
    error = validateDateInput(appointYear, appointMonth, appointDay, 80, 118, '任官日期');
    if (error) {
        resultDiv.innerHTML = `<p class="error">${error}</p>`;
        return;
    }
    if (isReenlist) {
        error = validateDateInput(reenlistYear, reenlistMonth, reenlistDay, 80, 118, '再入營/復職日期');
        if (error) {
            resultDiv.innerHTML = `<p class="error">${error}</p>`;
            return;
        }
        error = validateDateInput(firstRetireYear, firstRetireMonth, firstRetireDay, 80, 118, '第一次退伍/育嬰生效日期');
        if (error) {
            resultDiv.innerHTML = `<p class="error">${error}</p>`;
            return;
        }
    }
    for (let i = 0; i < trainingRecords.length; i++) {
        const record = trainingRecords[i];
        error = validateDateInput(record.startYear, record.startMonth, record.startDay, 80, 118, `受訓記錄 ${i + 1} 開始日期`);
        if (error) {
            resultDiv.innerHTML = `<p class="error">${error}</p>`;
            return;
        }
        error = validateDateInput(record.endYear, record.endMonth, record.endDay, 80, 118, `受訓記錄 ${i + 1} 結束日期`);
        if (error) {
            resultDiv.innerHTML = `<p class="error">${error}</p>`;
            return;
        }
    }

    // 解析日期
    const birthDate = parseDate(birthYear, birthMonth, birthDay);
    const arrivalDate = parseDate(arrivalYear, arrivalMonth, arrivalDay);
    const appointDate = parseDate(appointYear, appointMonth, appointDay);
    const reenlistDate = isReenlist ? parseDate(reenlistYear, reenlistMonth, reenlistDay) : null;
    const firstRetireDate = isReenlist ? parseDate(firstRetireYear, firstRetireMonth, firstRetireDay) : null;
    const trainingDates = trainingRecords.map(record => ({
        start: parseDate(record.startYear, record.startMonth, record.startDay),
        end: parseDate(record.endYear, record.endMonth, record.endDay)
    }));

    const gregorianLeaveYear = leaveYear + 1911;
    const leaveYearEnd = new Date(gregorianLeaveYear, 11, 31);

    // 進階日期驗證
    if (appointDate > arrivalDate) {
        resultDiv.innerHTML = '<p class="error">任官日期應早於到部日期！</p>';
        return;
    }
    if (isReenlist && firstRetireDate >= reenlistDate) {
        resultDiv.innerHTML = '<p class="error">再入營/復職日期應晚於第一次退伍/育嬰生效日期！</p>';
        return;
    }
    if (birthDate > appointDate) {
        resultDiv.innerHTML = '<p class="error">出生日期應早於任官日期！</p>';
        return;
    }
    if (arrivalDate > leaveYearEnd || appointDate > leaveYearEnd || birthDate > leaveYearEnd || (isReenlist && (reenlistDate > leaveYearEnd || firstRetireDate > leaveYearEnd))) {
        resultDiv.innerHTML = '<p class="error">所有日期不得晚於慰休年度的 12 月 31 日！</p>';
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
    const arrivalDateObjCalc = arrivalDate;

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
                const retireDate = firstRetireDate;
                const reenlistDate = reenlistDate;
                if (currentDate >= retireDate && currentDate < reenlistDate) {
                    adat[i][j] = 0;
                }
            }
        }
    }

    trainingDates.forEach(record => {
        if (record.start.getFullYear() === gregorianLeaveYear) {
            if (record.start.getMonth() === record.end.getMonth()) {
                for (let j = record.start.getDate(); j <= record.end.getDate(); j++) {
                    adat[record.start.getMonth() + 1][j] = 0;
                }
            } else {
                for (let i = record.start.getMonth() + 1; i <= record.end.getMonth() + 1; i++) {
                    const startDay = i === record.start.getMonth() + 1 ? record.start.getDate() : 1;
                    const endDay = i === record.end.getMonth() + 1 ? record.end.getDate() : new Date(gregorianLeaveYear, i, 0).getDate();
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

    // 計算慰勞補助費和應繳發票金額
    const { allowance, invoiceAmount } = calculateAllowance(actualLeaveDays);
    const allowanceChinese = numberToChinese(allowance);
    const invoiceAmountChinese = numberToChinese(invoiceAmount);

    // 計算服裝APP核配點數
    const clothingPoints = getClothingPoints(totalSeniority);

    resultHTML += `
        <table class="result-table">
            <tr><th>總年資</th><td>${(totalSeniority / 12).toFixed(2)} 年（${totalSeniority} 個月）</td></tr>
            <tr><th>應得慰勞假</th><td>${leaveDays} 天</td></tr>
            <tr><th>在職月數</th><td>${inServiceMonths} 個月</td></tr>
            <tr><th>實際慰勞假</th><td>${actualLeaveDays} 天</td></tr>
            <tr><th>休假補助費</th><td>${allowance} 元（${allowanceChinese}）</td></tr>
            <tr><th>應繳發票金額</th><td>${invoiceAmount} 元（${invoiceAmountChinese}）</td></tr>
            <tr><th>服裝APP年度核配點數</th><td>${clothingPoints} 點</td></tr>
            <tr><th>出生日期</th><td>${formatDate(birthDate)}</td></tr>
            <tr><th>年齡</th><td>${age} 歲</td></tr>
            <tr><th>性別</th><td>${gender === 'male' ? '男' : '女'}</td></tr>
            <tr><th>到部日期</th><td>${formatDate(arrivalDate)}</td></tr>
            <tr><th>任官日期</th><td>${formatDate(appointDate)}</td></tr>
            ${isReenlist ? `
                <tr><th>再入營/復職日期</th><td>${formatDate(reenlistDate)}</td></tr>
                <tr><th>第一次退伍/育嬰生效日期</th><td>${formatDate(firstRetireDate)}</td></tr>
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
    if (trainingDates.length > 0) {
        resultHTML += `
            <h4>受訓記錄</h4>
            <ul class="list-group">
        `;
        trainingDates.forEach(record => {
            resultHTML += `<li class="list-group-item">${formatDate(record.start)} 至 ${formatDate(record.end)}</li>`;
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

// 初始化慰休年度下拉選單和一筆受訓記錄
document.addEventListener('DOMContentLoaded', () => {
    // 初始化慰休年度下拉選單（民國 112-118，對應西元 2023-2029）
    const leaveYearSelect = document.getElementById('leave-year');
    for (let year = 112; year <= 118; year++) {
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
});

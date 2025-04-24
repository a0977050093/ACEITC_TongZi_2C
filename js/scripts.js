// 側邊欄展開/收起
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    sidebar.classList.toggle('expanded');
    mainContent.classList.toggle('expanded');
}

// 滾動到指定部分
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// 動態調整日期範圍
function updateDayRange() {
    const yearInput = document.getElementById('year').value;
    const monthInput = document.getElementById('month').value;
    const dayInput = document.getElementById('day');

    if (yearInput && monthInput) {
        const year = parseInt(yearInput) + 1911;
        const month = parseInt(monthInput);
        const daysInMonth = new Date(year, month, 0).getDate();
        dayInput.max = daysInMonth;

        if (dayInput.value && parseInt(dayInput.value) > daysInMonth) {
            dayInput.value = daysInMonth;
        }
    }
}

function calculateDateRanges() {
    const yearInput = document.getElementById('year').value;
    const monthInput = document.getElementById('month').value;
    const dayInput = document.getElementById('day').value;
    const resultDiv = document.getElementById('result');

    // 驗證輸入
    if (!yearInput || !monthInput || !dayInput) {
        resultDiv.innerHTML = '<p class="error">請填寫所有欄位！</p>';
        return;
    }

    const year = parseInt(yearInput);
    const month = parseInt(monthInput);
    const day = parseInt(dayInput);

    // 驗證日期有效性（包含閏年檢查）
    const gregorianYear = year + 1911;
    const inputDate = new Date(gregorianYear, month - 1, day);
    const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const daysInMonth = new Date(gregorianYear, month, 0).getDate();

    if (inputDate.getFullYear() !== gregorianYear || inputDate.getMonth() !== month - 1 || inputDate.getDate() !== day) {
        resultDiv.innerHTML = '<p class="error">請輸入有效的日期！</p>';
        return;
    }

    // 格式化日期函數
    function formatDate(date) {
        const gYear = date.getFullYear();
        const mYear = gYear - 1911;
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${mYear}.${month}.${day}`;
    }

    // 計算連續三個月
    const months = [];
    let currentDate = new Date(gregorianYear, month - 1, day);
    for (let i = 0; i < 3; i++) {
        const startDate = new Date(currentDate);
        currentDate.setMonth(currentDate.getMonth() + 1);
        const endDate = new Date(currentDate);
        months.push(`連續第${i + 1}個月：${formatDate(startDate)} - ${formatDate(endDate)}`);
    }

    // 計算連續四季（第一季從三個月結束日期的次日開始）
    const quarters = [];
    const quarterEnds = [
        { month: 2, day: 31 }, // 3月31日
        { month: 5, day: 30 }, // 6月30日
        { month: 8, day: 30 }, // 9月30日
        { month: 11, day: 31 } // 12月31日
    ];

    // 將 currentDate 設為三個月結束日期的次日
    currentDate.setDate(currentDate.getDate() + 1);

    for (let i = 0; i < 4; i++) {
        const startDate = new Date(currentDate);

        // 找到下一個季度的結束日期
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

        // 更新 currentDate 為下一個季度的開始日期（結束日期的次日）
        currentDate = new Date(endDate);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // 儲存第四季的結束日期作為解管時間
    const quarterEndDate = new Date(currentDate);
    quarterEndDate.setDate(quarterEndDate.getDate() - 1); // 第四季的最後一天
    const releaseTime = formatDate(quarterEndDate);

    // 計算上下半年
    const halfYear = [];
    let halfYear1Start, halfYear1End, halfYear2Start, halfYear2End;

    // 檢查四季結束日期是否在 7 月之後
    const isAfterJuly = quarterEndDate.getMonth() >= 6; // 7月之後 (0-11，6 表示 7月)

    if (isAfterJuly) {
        // 如果四季結束在 7 月之後，上半年從次年 1 月 1 日開始
        const nextYear = quarterEndDate.getFullYear() + 1;
        halfYear1Start = new Date(nextYear, 0, 1); // 次年 1月1日
        halfYear1End = new Date(nextYear, 4, 10); // 次年 5月10日
        halfYear.push(`上下半年上半年：${formatDate(halfYear1Start)} - ${formatDate(halfYear1End)}`);

        // 下半年從次年 7 月 1 日開始
        halfYear2Start = new Date(nextYear, 6, 1); // 次年 7月1日
        halfYear2End = new Date(nextYear, 9, 10); // 次年 10月10日
        halfYear.push(`上下半年下半年：${formatDate(halfYear2Start)} - ${formatDate(halfYear2End)}`);
    } else {
        // 如果四季結束在 7 月之前，上半年從四季結束的次日開始
        halfYear1Start = new Date(currentDate);
        let halfYear1EndYear = halfYear1Start.getFullYear();
        halfYear1End = new Date(halfYear1EndYear, 4, 10); // 5月10日
        if (halfYear1Start > halfYear1End) {
            halfYear1EndYear++;
            halfYear1End = new Date(halfYear1EndYear, 4, 10);
        }
        halfYear.push(`上下半年上半年：${formatDate(halfYear1Start)} - ${formatDate(halfYear1End)}`);

        // 下半年從 7 月 1 日開始
        let halfYear2StartYear = halfYear1End.getFullYear();
        halfYear2Start = new Date(halfYear2StartYear, 6, 1); // 7月1日
        if (halfYear1End >= halfYear2Start) {
            halfYear2StartYear++;
            halfYear2Start = new Date(halfYear2StartYear, 6, 1);
        }
        halfYear2End = new Date(halfYear2StartYear, 9, 10); // 10月10日
        halfYear.push(`上下半年下半年：${formatDate(halfYear2Start)} - ${formatDate(halfYear2End)}`);
    }

    // 顯示結果
    resultDiv.innerHTML = `
        <h2>人員考核表計算日期如下</h2>
        <h3 id="months-section">連續三個月</h3>
        <p>${months.join('<br>')}</p>
        <h3 id="quarters-section">連續四季</h3>
        <p>${quarters.join('<br>')}</p>
        <h3 id="half-year-section">上下半年</h3>
        <p>${halfYear.join('<br>')}</p>
        <div id="release-time-section" class="release-time">解管時間：${releaseTime}</div>
    `;
}

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

        // 檢查當前的日是否大於允許的最大小
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

    if (
        inputDate.getFullYear() !== gregorianYear || 
        inputDate.getMonth() !== month - 1 || 
        inputDate.getDate() !== day
    ) {
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

    // 計算連續四季
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

    // 儲存第四季的結束日期作為解管時間
    const quarterEndDate = new Date(currentDate);
    quarterEndDate.setDate(quarterEndDate.getDate() - 1); // 第四季的最後一天
    const releaseTime = formatDate(quarterEndDate);

    // 計算上下半年
    const halfYear = [];
    let halfYear1Start, halfYear1End, halfYear2Start, halfYear2End;

    const isAfterJuly = quarterEndDate.getMonth() >= 6; // 7月之後 (0-11，6 表示 7月)

    if (isAfterJuly) {
        const nextYear = quarterEndDate.getFullYear() + 1;
        halfYear1Start = new Date(nextYear, 0, 1); // 次年 1月1日
        halfYear1End = new Date(nextYear, 4, 10); // 次年 5月10日
        halfYear.push(`上下半年上半年：${formatDate(halfYear1Start)} - ${formatDate(halfYear1End)}`);

        halfYear2Start = new Date(nextYear, 6, 1); // 次年 7月1日
        halfYear2End = new Date(nextYear, 9, 10); // 次年 10月10日
        halfYear.push(`上下半年下半年：${formatDate(halfYear2Start)} - ${formatDate(halfYear2End)}`);
    } else {
        halfYear1Start = new Date(currentDate);
        let halfYear1EndYear = halfYear1Start.getFullYear();
        halfYear1End = new Date(halfYear1EndYear, 4, 10); // 5月10日

        if (halfYear1Start > halfYear1End) {
            halfYear1EndYear++;
            halfYear1End = new Date(halfYear1EndYear, 4, 10);
        }
        halfYear.push(`上下半年上半年：${formatDate(halfYear1Start)} - ${formatDate(halfYear1End)}`);

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

// 加載指定頁面
function loadPage(page) {
    const contentFrame = document.getElementById('contentFrame');
    if (contentFrame) {
        contentFrame.src = page;
    }
}

// 事件監聽器
document.addEventListener("DOMContentLoaded", function() {
    // 可以在這裡加載初始數據或設定事件處理程序
});









document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const modal = document.getElementById('modal');
    const modalIframe = document.getElementById('modal-iframe');
    const closeButton = document.querySelector('.close-button');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggleButton');
    let isDarkMode = localStorage.getItem('darkMode') === 'enabled';

    // 初始設定夜間模式
    const applyDarkMode = () => {
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> 護瞳'; // 更新按鈕圖標
        } else {
            document.body.classList.remove('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> 護瞳'; // 更新按鈕圖標
        }
    };
    applyDarkMode();

    // 夜間模式切換
    darkModeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
        applyDarkMode();
    });

    // 標籤切換
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
        });
    });

    // 全螢幕彈出視窗
    document.querySelectorAll('.expand-button').forEach(button => {
        button.addEventListener('click', () => {
            const iframe = button.parentElement.querySelector('iframe');
            modalIframe.src = iframe.src;
            modal.style.display = 'block'; // 顯示模態框
        });
    });

    // 關閉模態框
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        modalIframe.src = ''; // 清空 iframe
    });

    // 點擊外部關閉模態框
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            modalIframe.src = ''; // 清空 iframe
        }
    });

    // 側邊欄切換
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
});


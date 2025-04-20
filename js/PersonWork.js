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

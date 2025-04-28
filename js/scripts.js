// scripts.js

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

// 加載指定頁面
function loadPage(page) {
    const contentFrame = document.getElementById('contentFrame');
    if (contentFrame) {
        contentFrame.src = page;
    }
}

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
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> 護瞳';
        } else {
            document.body.classList.remove('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> 護瞳';
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
            modal.style.display = 'block';
        });
    });

    // 關閉模態框
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
        modalIframe.src = '';
    });

    // 點擊外部關閉模態框
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            modalIframe.src = '';
        }
    });

    // 側邊欄切換
    toggleButton.addEventListener('click', () => {
        const isOpen = sidebar.classList.toggle('open');
        toggleButton.setAttribute('aria-expanded', isOpen);
    });

    // 可折疊側邊欄功能
    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isActive = content.classList.toggle('active');
            header.classList.toggle('active');
            header.setAttribute('aria-expanded', isActive);
        });
    });
});

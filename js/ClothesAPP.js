// 切換側邊選單的顯示與隱藏
document.getElementById('toggle-btn').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    const menu = document.getElementById('sidebar-menu');
    
    if (sidebar.style.width === '50px') {
        sidebar.style.width = '100px';
        menu.style.display = 'block';
    } else {
        sidebar.style.width = '50px';
        menu.style.display = 'none';
    }
});

// 滾動到頂部的功能
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 當頁面滾動時顯示或隱藏返回頂部按鈕
window.onscroll = function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollButton.style.display = "block";
    } else {
        scrollButton.style.display = "none";
    }
};
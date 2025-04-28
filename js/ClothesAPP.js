// ClothesAPP.js

// 下拉選單導航（建議 2）
function navigateToCategory() {
    const select = document.getElementById('category-select');
    const targetId = select.value;
    if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

document.getElementById('category-select').addEventListener('change', navigateToCategory);

// 購物車模態框（建議 2）
const cart = [];
document.querySelectorAll('.product-card button').forEach(button => {
    button.addEventListener('click', () => {
        const itemName = button.getAttribute('data-item');
        cart.push(itemName);
        const modal = document.getElementById('cart-modal');
        const message = document.getElementById('cart-message');
        message.textContent = `${itemName} 已加入購物車！`;
        modal.style.display = 'block';
    });
});

function closeCartModal() {
    document.getElementById('cart-modal').style.display = 'none';
}

document.querySelector('#cart-modal .close-button').addEventListener('click', closeCartModal);

// 返回頂部
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 當頁面滾動時顯示或隱藏返回頂部按鈕
window.onscroll = function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollButton.style.display = 'block';
    } else {
        scrollButton.style.display = 'none';
    }
};

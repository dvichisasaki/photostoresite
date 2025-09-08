document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.shop-item-button');
    buttons.forEach(button => button.addEventListener('click', addToCart));

    function addToCart(event) {
        const item = event.target.closest('.shop-item');
        const title = item.querySelector('.shop-item-title').innerText;
        const image = item.querySelector('.shop-item-image').src;
        const select = item.querySelector('.shop-item-size');
        const size = select.options[select.selectedIndex].text;
        const price = parseFloat(select.value);

        // ローカルストレージに保存
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(c => c.title === title && c.size === size);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ title, image, size, price, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Added to cart');
    }
});

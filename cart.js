document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.cart-items');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderCart() {
        // 既存のアイテム行を削除
        cartContainer.querySelectorAll('.cart-row:not(.cart-titles)').forEach(row => row.remove());

        cart.forEach((item, index) => {
            const row = document.createElement('div');
            row.classList.add('cart-row');
            row.innerHTML = `
                <div class="cart-item cart-column">
                    <img src="${item.image}" width="100">
                    <span class="cart-item-title">${item.title}</span>
                </div>
                <span class="cart-size cart-column">${item.size}</span>
                <span class="cart-price cart-column">$${item.price}</span>
                <input class="cart-quantity cart-column" type="number" value="${item.quantity}" min="1">
                <button class="btn btn-danger cart-remove">Remove</button>
            `;
            cartContainer.appendChild(row);

            // 変更イベント
            row.querySelector('.cart-quantity').addEventListener('change', e => {
                let val = parseInt(e.target.value);
                if (isNaN(val) || val < 1) val = 1;
                item.quantity = val;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateTotal();
            });

            row.querySelector('.cart-remove').addEventListener('click', () => {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                updateTotal();
            });
        });
        updateTotal();
    }

    function updateTotal() {
        const totalEl = document.querySelector('.cart-total-price');
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        totalEl.innerText = `$${total}`;
    }

    document.querySelector('.btn-checkout').addEventListener('click', () => {
        alert('Thank you for your purchase!');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    });

    renderCart();
});

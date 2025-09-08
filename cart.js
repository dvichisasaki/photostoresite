document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add to Cart
    document.querySelectorAll('.shop-item-button').forEach(button => {
        button.addEventListener('click', e => {
            const itemDiv = e.target.closest('.shop-item');
            const title = itemDiv.querySelector('.shop-item-title').innerText;
            const sizeSelect = itemDiv.querySelector('.shop-item-size');
            const price = parseInt(sizeSelect.options[sizeSelect.selectedIndex].value);
            const image = itemDiv.querySelector('img').src;

            cart.push({ title, price, image });
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Added to cart!');
        });
    });

    // Cart page
    const cartContainer = document.querySelector('.cart-items');
    if (cartContainer) {
        cart.forEach((item, index) => {
            const row = document.createElement('div');
            row.className = 'cart-row';
            row.innerHTML = `
                <div class="cart-item cart-column">
                    <img class="cart-item-image" src="${item.image}" width="100">
                    <span class="cart-item-title">${item.title}</span>
                </div>
                <span class="cart-price cart-column">$${item.price}</span>
                <div class="cart-quantity cart-column">
                    <input type="number" value="1" min="1" class="cart-quantity-input">
                    <button class="btn btn-danger">Remove</button>
                </div>`;
            cartContainer.appendChild(row);

            // Remove button
            row.querySelector('.btn-danger').addEventListener('click', () => {
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                row.remove();
                updateCartTotal();
            });

            // Quantity change
            row.querySelector('.cart-quantity-input').addEventListener('change', e => {
                if (e.target.value < 1) e.target.value = 1;
                updateCartTotal();
            });
        });

        // Checkout
        document.querySelector('.btn-checkout').addEventListener('click', () => {
            alert('Thank you for your purchase!');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            cartContainer.innerHTML = '';
            updateCartTotal();
        });

        updateCartTotal();
    }

    function updateCartTotal() {
        const cartRows = document.querySelectorAll('.cart-row');
        let total = 0;
        cartRows.forEach(row => {
            const price = parseInt(row.querySelector('.cart-price').innerText.replace('$', ''));
            const quantity = parseInt(row.querySelector('.cart-quantity-input').value);
            total += price * quantity;
        });
        document.querySelector('.cart-total-price').innerText = '$' + total;
    }
});


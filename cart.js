document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', purchaseClicked);
    }
});

function loadCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cartItemsContainer.innerHTML = `<div class="cart-row cart-titles">
        <span class="cart-item cart-column cart-header">Item</span>
        <span class="cart-quantity cart-column cart-header">Quantity</span>
        <span class="cart-price cart-column cart-header">Price</span>
    </div>`;

    for (let item of cart) {
        const cartRow = document.createElement('div');
        cartRow.classList.add('cart-row');
        cartRow.innerHTML = `
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${item.imageSrc}" width="100">
                <span class="cart-item-title">${item.title}</span>
            </div>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="${item.quantity}" min="1">
                <button class="btn btn-danger" type="button">Remove</button>
            </div>
            <span class="cart-price cart-column">$${item.price}</span>
        `;
        cartItemsContainer.append(cartRow);

        cartRow.querySelector('.btn-danger').addEventListener('click', removeCartItem);
        cartRow.querySelector('.cart-quantity-input').addEventListener('change', quantityChanged);
    }

    updateCartTotal();
}

function removeCartItem(event) {
    const buttonClicked = event.target;
    const row = buttonClicked.closest('.cart-row');
    row.remove();
    updateCartTotal();
}

function quantityChanged(event) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}

function updateCartTotal() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartRows = cartItemsContainer.querySelectorAll('.cart-row:not(.cart-titles)');
    let total = 0;
    let updatedCart = [];

    cartRows.forEach(row => {
        const title = row.querySelector('.cart-item-title').innerText;
        const price = parseFloat(row.querySelector('.cart-price').innerText.replace('$', ''));
        const quantity = parseInt(row.querySelector('.cart-quantity-input').value);

        total += price * quantity;

        updatedCart.push({
            title,
            price,
            imageSrc: row.querySelector('.cart-item-image').src,
            quantity
        });
    });

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    document.querySelector('.cart-total-price').innerText = '$' + total.toFixed(2);
}

function purchaseClicked() {
    alert('Thank you for your purchase!');
    localStorage.removeItem('cart');
    loadCart();
}


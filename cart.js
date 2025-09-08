if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    // Remove cart items
    const removeButtons = document.getElementsByClassName('btn-danger')
    for (let btn of removeButtons) {
        btn.addEventListener('click', removeCartItem)
    }

    // Change quantity
    const quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (let input of quantityInputs) {
        input.addEventListener('change', quantityChanged)
    }

    // Add to cart
    const addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (let button of addToCartButtons) {
        button.addEventListener('click', addToCartClicked)
    }

    // Checkout
    const checkoutButton = document.getElementsByClassName('btn-checkout')[0]
    if (checkoutButton) checkoutButton.addEventListener('click', purchaseClicked)
}

function purchaseClicked() {
    alert('Thank you for your purchase!')
    const cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems && cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function removeCartItem(event) {
    const buttonClicked = event.target
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    const input = event.target
    if (isNaN(input.value) || input.value <= 0) input.value = 1
    updateCartTotal()
}

function addToCartClicked(event) {
    const button = event.target
    const shopItem = button.parentElement
    const title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    const imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    const select = shopItem.getElementsByClassName('shop-item-size')[0]
    const price = select.value
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc) {
    const cartItems = document.getElementsByClassName('cart-items')[0]
    const cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (let name of cartItemNames) {
        if (name.innerText === title) {
            alert('This item is already added to the cart')
            return
        }
    }

    const cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.innerHTML = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">$${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">Remove</button>
        </div>
    `
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    const cartItems = document.getElementsByClassName('cart-items')[0]
    const cartRows = cartItems.getElementsByClassName('cart-row')
    let total = 0
    for (let row of cartRows) {
        const priceElement = row.getElementsByClassName('cart-price')[0]
        const quantityElement = row.getElementsByClassName('cart-quantity-input')[0]
        const price = parseFloat(priceElement.innerText.replace('$', ''))
        const quantity = quantityElement.value
        total += price * quantity
    }
    const totalPriceElement = document.getElementsByClassName('cart-total-price')[0]
    if (totalPriceElement) totalPriceElement.innerText = '$' + total
}

document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.getElementsByClassName('shop-item-button')
    for (let btn of addButtons) {
        btn.addEventListener('click', addToCartClicked)
    }

    if (document.getElementsByClassName('cart-items').length > 0) {
        loadCart()
        document.getElementsByClassName('btn-checkout')[0].addEventListener('click', purchaseClicked)
    }
})

// store.html: カートに追加
function addToCartClicked(event) {
    const button = event.target
    const shopItem = button.parentElement
    const title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    const imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    const select = shopItem.getElementsByClassName('shop-item-size')[0]
    const price = parseFloat(select.value)

    let cart = JSON.parse(localStorage.getItem('cart')) || []

    if (cart.some(item => item.title === title)) {
        alert('This item is already in the cart')
        return
    }

    cart.push({ title, price, imageSrc, quantity: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Item added to cart!')
}

// cart.html: カート読み込み
function loadCart() {
    const cartItemsContainer = document.getElementsByClassName('cart-items')[0]
    const cart = JSON.parse(localStorage.getItem('cart')) || []

    cartItemsContainer.innerHTML = `<div class="cart-row cart-titles">
        <span class="cart-item cart-column cart-header">Item</span>
        <span class="cart-quantity cart-column cart-header">Quantity</span>
        <span class="cart-price cart-column cart-header">Price</span>
    </div>`

    for (let item of cart) {
        const cartRow = document.createElement('div')
        cartRow.classList.add('cart-row')
        cartRow.innerHTML = `
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${item.imageSrc}" width="100" height="100">
                <span class="cart-item-title">${item.title}</span>
            </div>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value="${item.quantity}">
                <button class="btn btn-danger" type="button">Remove</button>
            </div>
            <span class="cart-price cart-column">$${item.price}</span>
        `
        cartItemsContainer.append(cartRow)

        cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
        cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
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
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function updateCartTotal() {
    const cartItemsContainer = document.getElementsByClassName('cart-items')[0]
    const cartRows = cartItemsContainer.getElementsByClassName('cart-row')
    let total = 0
    let updatedCart = []

    for (let row of cartRows) {
        if (!row.classList.contains('cart-titles')) {
            const title = row.getElementsByClassName('cart-item-title')[0].innerText
            const price = parseFloat(row.getElementsByClassName('cart-price')[0].innerText.replace('$', ''))
            const quantityInput = row.getElementsByClassName('cart-quantity-input')[0]
            const quantity = parseInt(quantityInput.value)
            total += price * quantity
            updatedCart.push({
                title,
                price,
                imageSrc: row.getElementsByClassName('cart-item-image')[0].src,
                quantity
            })
        }
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart))
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total.toFixed(2)
}

function purchaseClicked() {
    alert('Thank you for your purchase!')
    localStorage.removeItem('cart')
    loadCart()
}

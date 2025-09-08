document.addEventListener('DOMContentLoaded', () => {
    // Store ページ用: Add to Cart ボタン
    const addButtons = document.getElementsByClassName('shop-item-button')
    for (let btn of addButtons) {
        btn.addEventListener('click', addToCartClicked)
    }

    // Cart ページ用: カート読み込み
    if (document.getElementsByClassName('cart-items').length > 0) {
        loadCart()
        const checkoutBtn = document.getElementsByClassName('btn-checkout')[0]
        if (checkoutBtn) checkoutBtn.addEventListener('click', purchaseClicked)
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
    const size = select.options[select.selectedIndex].text

    let cart = JSON.parse(localStorage.getItem('cart')) || []

    // 同じタイトルかつ同じサイズの商品がある場合は quantity を増やす
    const existingItem = cart.find(item => item.title === title && item.size === size)
    if (existingItem) {
        existingItem.quantity += 1
    } else {
        cart.push({ title, price, imageSrc, quantity: 1, size })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Item added to cart!')
}

// cart.html: カート読み込み
function loadCart() {
    const cartItemsContainer = document.getElementsByClassName('cart-items')[0]
    if (!cartItemsContainer) return

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
                <img class="cart-item-image" src="${item.imageSrc}">
                <span class="cart-item-title">${item.title} (${item.size})</span>
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
    const row = buttonClicked.parentElement.parentElement
    row.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    const input = event.target
    if (isNaN(input.value) || input.value <= 0) input.value = 1
    updateCartTotal()
}

function updateCartTotal() {
    const cartItemsContainer = document.getElementsByClassName('cart-items')[0]
    if (!cartItemsContainer) return

    const cartRows = cartItemsContainer.getElementsByClassName('cart-row')
    let total = 0
    let updatedCart = []

    for (let row of cartRows) {
        if (!row.classList.contains('cart-titles')) {
            const titleSize = row.getElementsByClassName('cart-item-title')[0].innerText
            const price = parseFloat(row.getElementsByClassName('cart-price')[0].innerText.replace('$', ''))
            const quantityInput = row.getElementsByClassName('cart-quantity-input')[0]
            const quantity = parseInt(quantityInput.value)
            total += price * quantity
            updatedCart.push({
                title: titleSize.split(' (')[0],
                size: titleSize.match(/\((.*)\)/)[1],
                price,
                imageSrc: row.getElementsByClassName('cart-item-image')[0].src,
                quantity
            })
        }
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart))
    const totalElem = document.getElementsByClassName('cart-total-price')[0]
    if (totalElem) totalElem.innerText = '$' + total.toFixed(2)
}

function purchaseClicked() {
    alert('Thank you for your purchase!')
    localStorage.removeItem('cart')
    loadCart()
}

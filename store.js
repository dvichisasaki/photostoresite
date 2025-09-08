if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    // Add to Cart ボタン
    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    // Cartページがある場合、カートを表示
    if (document.getElementsByClassName('cart-items').length > 0) {
        renderCartFromStorage()
    }

    // 数量変更や削除イベント
    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        quantityInputs[i].addEventListener('change', quantityChanged)
    }

    var removeButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener('click', removeCartItem)
    }

    var checkoutBtn = document.getElementsByClassName('btn-checkout')[0]
    if (checkoutBtn) checkoutBtn.addEventListener('click', purchaseClicked)
}

// Cartに追加
function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src

    // localStorageに保存
    addItemToStorage({ title, price, imageSrc })
    alert('Item added to cart!')
}

// localStorageに保存
function addItemToStorage(item) {
    var cart = JSON.parse(localStorage.getItem('cart')) || []
    // 同じ商品は追加しない
    var exists = cart.find(i => i.title === item.title)
    if (!exists) {
        cart.push(item)
        localStorage.setItem('cart', JSON.stringify(cart))
    }
}

// Cartページで表示
function renderCartFromStorage() {
    var cartItemsContainer = document.getElementsByClassName('cart-items')[0]
    var cart = JSON.parse(localStorage.getItem('cart')) || []
    cartItemsContainer.innerHTML = `
        <div class="cart-row cart-titles">
            <span class="cart-item cart-column cart-header">Shopping Cart</span>
            <span class="cart-quantity cart-column cart-header">Quantity</span>
            <span class="cart-price cart-column cart-header">Price</span>
        </div>
    `
    cart.forEach(item => {
        var cartRow = document.createElement('div')
        cartRow.classList.add('cart-row')
        cartRow.innerHTML = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${item.imageSrc}" width="100" height="100">
            <span class="cart-item-title">${item.title}</span>
        </div>
        <span class="cart-price cart-column">${item.price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">Remove</button>
        </div>
        `
        cartItemsContainer.append(cartRow)

        // イベント
        cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
        cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
    })

    updateCartTotal()
}

// 削除
function removeCartItem(event) {
    var button = event.target
    var row = button.parentElement.parentElement
    var title = row.getElementsByClassName('cart-item-title')[0].innerText

    // localStorageから削除
    var cart = JSON.parse(localStorage.getItem('cart')) || []
    cart = cart.filter(i => i.title !== title)
    localStorage.setItem('cart', JSON.stringify(cart))

    row.remove()
    updateCartTotal()
}

// 数量変更
function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

// チェックアウト
function purchaseClicked() {
    alert('Thank you for your purchase!')
    localStorage.removeItem('cart')
    renderCartFromStorage()
}

// 合計更新
function updateCartTotal() {
    var cartRows = document.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 1; i < cartRows.length; i++) { // 0はヘッダー
        var row = cartRows[i]
        var price = parseFloat(row.getElementsByClassName('cart-price')[0].innerText.replace('$', ''))
        var quantity = row.getElementsByClassName('cart-quantity-input')[0].value
        total += price * quantity
    }
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total.toFixed(2)
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    // カート内のアイテム削除ボタン
    const removeCartItemButtons = document.getElementsByClassName('btn-danger');
    for (let button of removeCartItemButtons) {
        button.addEventListener('click', removeCartItem);
    }

    // 数量変更イベント
    const quantityInputs = document.getElementsByClassName('cart-quantity-input');
    for (let input of quantityInputs) {
        input.addEventListener('change', quantityChanged);
    }

    // 商品追加ボタン
    const addToCartButtons = document.getElementsByClassName('shop-item-button');
    for (let button of addToCartButtons) {
        button.addEventListener('click', addToCartClicked);
    }

    // チェックアウトボタン
    document.getElementsByClassName('btn-checkout')[0]?.addEventListener('click', purchaseClicked);
}

// チェックアウト処理
function purchaseClicked() {
    alert('Thank you for your purchase!');
    const cartItems = document.getElementsByClassName('cart-items')[0];
    while (cartItems?.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild);
    }
    updateCartTotal();
}

// カート内アイテム削除
function removeCartItem(event) {
    const buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

// 数量変更処理
function quantityChanged(event) {
    const input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}

// 商品追加
function addToCartClicked(event) {
    const button = event.target;
    const shopItem = button.closest('.shop-item');
    const title = shopItem.getElementsByClassName('shop-item-title')[0]?.innerText || "Item";
    const price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    const imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;

    addItemToCart(title, price, imageSrc);
    updateCartTotal();
}

// カートにアイテムを追加
function addItemToCart(title, price, imageSrc) {
    const cartItemContainer = document.getElementsByClassName('cart-items')[0];
    const cartItemNames = cartItemContainer.getElementsByClassName('cart-item-title');

    for (let i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText === title) {
            alert('This item is already added to the cart');
            return;
        }
    }

    const cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');

    const cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">Remove</button>
        </div>
    `;

    cartRow.innerHTML = cartRowContents;
    cartItemContainer.append(cartRow);

    // 新しい要素にイベントを追加
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged);
}

// カート合計計算
function updateCartTotal() {
    const cartItemContainer = document.getElementsByClassName('cart-items')[0];
    const cartRows = cartItemContainer.getElementsByClassName('cart-row');
    let total = 0;

    for (let cartRow of cartRows) {
        const priceElement = cartRow.getElementsByClassName('cart-price')[0];
        const quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        const price = parseFloat(priceElement.innerText.replace('$', ''));
        const quantity = quantityElement.value;
        total += price * quantity;
    }

    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total.toFixed(2);
}

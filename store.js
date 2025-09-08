document.addEventListener('DOMContentLoaded', () => {
    const addButtons = document.getElementsByClassName('shop-item-button');
    for (let btn of addButtons) {
        btn.addEventListener('click', addToCartClicked);
    }
});

// カートに商品を追加
function addToCartClicked(event) {
    const button = event.target;
    const shopItem = button.parentElement;
    const title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    const imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;
    const select = shopItem.getElementsByClassName('shop-item-size')[0];
    const price = parseFloat(select.value);

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

   
    const existingItem = cart.find(item => item.title === title && item.price === price);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ title, price, imageSrc, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Item added to cart!');
}

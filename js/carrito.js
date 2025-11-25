// ------ MOSTRAR CARRITO Y CONTADOR ------
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartCount = document.getElementById('cart-count');
const cartItemsList = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

function getCart() {
    return JSON.parse(localStorage.getItem('cart_bonanza')) || [];
}
function setCart(cart) {
    localStorage.setItem('cart_bonanza', JSON.stringify(cart));
    updateCartCount();
}
function updateCartCount() {
    const cart = getCart();
    cartCount.textContent = cart.reduce((acc, item) => acc + item.cantidad, 0);
}

// ------ AGREGAR AL CARRITO DESDE LOS BOTONES ------
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', e => {
        const id = btn.dataset.id;
        const nombre = btn.dataset.nombre;
        const precio = Number(btn.dataset.precio);
        const img = btn.dataset.img;
        let cart = getCart();

        const exists = cart.find(item => item.id === id);
        if (exists) {
            exists.cantidad += 1;
        } else {
            cart.push({id, nombre, precio, img, cantidad: 1});
        }
        setCart(cart);
        updateCartModal();
    });
});

// ------ MODAL FUNCIONALIDAD ------
cartBtn.onclick = () => {
    updateCartModal();
    cartModal.style.display = 'flex';
}
closeCart.onclick = () => cartModal.style.display = 'none';
window.onclick = (e) => {
    if (e.target === cartModal) cartModal.style.display = 'none';
}

function updateCartModal() {
    const cart = getCart();
    cartItemsList.innerHTML = cart.length === 0
        ? "<p>El carrito está vacío.</p>"
        : cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}" width="40" height="40" style="border-radius:10px;"> ${item.nombre}
                <span>x${item.cantidad}</span>
                <span>S/ ${(item.precio * item.cantidad).toFixed(2)}</span>
                <button class="remove-btn" data-id="${item.id}">🗑️</button>
            </div>
        `).join("");
    cartTotal.textContent = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2);
    checkoutBtn.disabled = cart.length === 0;
}
// Eliminar items desde el carrito
cartItemsList.onclick = function(e) {
    if (e.target.classList.contains('remove-btn')) {
        let cart = getCart();
        const id = e.target.dataset.id;
        cart = cart.filter(item => item.id !== id);
        setCart(cart);
        updateCartModal();
    }
}
updateCartCount();

// ------ CHECKOUT DEMO CON STRIPE ------
checkoutBtn.onclick = function() {
    // PARA PRUEBAS: Redirige a Stripe TEST Checkout página básica
    // Cambia el URL por tu enlace de Stripe predefinido o genera desde backend en producción
    window.location.href = 'https://buy.stripe.com/test_4gwcPOfSp3YOfFKbII'; // Stripe TEST LINK
    // Limpia carrito si deseas:
    // localStorage.removeItem('cart_bonanza');
    // cartModal.style.display = 'none';
};

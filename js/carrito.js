// ===== CARRITO DE COMPRAS SIMPLE =====

const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartCount = document.getElementById('cart-count');
const cartItemsList = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Obtener carrito
function getCart() {
    return JSON.parse(localStorage.getItem('cart_bonanza')) || [];
}

// Guardar carrito
function setCart(cart) {
    localStorage.setItem('cart_bonanza', JSON.stringify(cart));
    updateCartCount();
}

// Actualizar contador
function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((acc, item) => acc + item.cantidad, 0);
    cartCount.textContent = total;
}

// Agregar al carrito
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
        const id = this.dataset.id;
        const nombre = this.dataset.nombre;
        const precio = parseFloat(this.dataset.precio);
        const img = this.dataset.img;
        
        let cart = getCart();
        const exists = cart.find(item => item.id === id);
        
        if (exists) {
            exists.cantidad += 1;
        } else {
            cart.push({ id, nombre, precio, img, cantidad: 1 });
        }
        
        setCart(cart);
        updateCartModal();
        
        // Animación visual
        this.textContent = '✓ Agregado';
        this.style.background = '#4caf50';
        setTimeout(() => {
            this.textContent = 'Añadir al carrito';
            this.style.background = '';
        }, 1500);
    });
});

// Abrir modal
if (cartBtn) {
    cartBtn.addEventListener('click', function() {
        updateCartModal();
        cartModal.style.display = 'flex';
    });
}

// Cerrar modal
if (closeCart) {
    closeCart.addEventListener('click', function() {
        cartModal.style.display = 'none';
    });
}

// Cerrar al hacer click fuera
window.addEventListener('click', function(e) {
    if (e.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Actualizar modal del carrito
function updateCartModal() {
    const cart = getCart();
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p style="text-align:center; color:#999; padding:2rem;">Tu carrito está vacío</p>';
        cartTotal.textContent = '0.00';
        checkoutBtn.disabled = true;
        return;
    }
    
    cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item" style="display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid #f0f0f0;">
            <img src="${item.img}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            <div style="flex: 1;">
                <strong>${item.nombre}</strong>
                <p style="color: #666; font-size: 0.9rem;">S/ ${item.precio.toFixed(2)} × ${item.cantidad}</p>
            </div>
            <strong style="color: var(--primary-color);">S/ ${(item.precio * item.cantidad).toFixed(2)}</strong>
            <button class="remove-btn" data-id="${item.id}" style="background: #dc3545; color: white; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer;">🗑️</button>
        </div>
    `).join('');
    
    const total = cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    cartTotal.textContent = total.toFixed(2);
    checkoutBtn.disabled = false;
}

// Eliminar item del carrito
if (cartItemsList) {
    cartItemsList.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-btn') || e.target.closest('.remove-btn')) {
            const id = e.target.dataset.id || e.target.closest('.remove-btn').dataset.id;
            let cart = getCart();
            cart = cart.filter(item => item.id !== id);
            setCart(cart);
            updateCartModal();
        }
    });
}

// Ir al checkout
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        window.location.href = 'checkout.html';
    });
}

// Inicializar
updateCartCount();

console.log('✅ Carrito cargado correctamente');

// ===== CHECKOUT =====

function getCart() {
    return JSON.parse(localStorage.getItem('cart_bonanza')) || [];
}

function calcularSubtotal() {
    const cart = getCart();
    return cart.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
}

function mostrarResumenPedido() {
    const cart = getCart();
    const cartSummary = document.getElementById('cart-summary-items');
    const subtotalEl = document.getElementById('subtotal');
    
    if (cart.length === 0) {
        cartSummary.innerHTML = '<p style="text-align:center; color:#999;">Tu carrito está vacío</p>';
        subtotalEl.textContent = '0.00';
        actualizarTotal();
        return;
    }
    
    cartSummary.innerHTML = cart.map(item => `
        <div style="display: flex; gap: 1rem; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #f0f0f0;">
            <img src="${item.img}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            <div style="flex: 1;">
                <strong>${item.nombre}</strong>
                <p style="color: #666; font-size: 0.9rem;">${item.cantidad} × S/ ${item.precio.toFixed(2)}</p>
            </div>
            <strong>S/ ${(item.precio * item.cantidad).toFixed(2)}</strong>
        </div>
    `).join('');
    
    const subtotal = calcularSubtotal();
    subtotalEl.textContent = subtotal.toFixed(2);
    actualizarTotal();
}

function actualizarTotal() {
    const subtotal = calcularSubtotal();
    const envioSeleccionado = document.querySelector('input[name="envio"]:checked');
    const envio = envioSeleccionado ? parseFloat(envioSeleccionado.value) : 15;
    
    document.getElementById('envio-total').textContent = envio.toFixed(2);
    document.getElementById('total-final').textContent = (subtotal + envio).toFixed(2);
}

// Cambiar método de envío
document.querySelectorAll('input[name="envio"]').forEach(radio => {
    radio.addEventListener('change', actualizarTotal);
});

// Cambiar método de pago
const paymentBtns = document.querySelectorAll('.payment-btn');
let metodoSeleccionado = 'stripe';

paymentBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        paymentBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        metodoSeleccionado = this.dataset.method;
    });
});

// Procesar checkout
document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const cart = getCart();
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const datosCliente = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        dni: document.getElementById('dni').value,
        direccion: document.getElementById('direccion').value,
        ciudad: document.getElementById('ciudad').value,
        distrito: document.getElementById('distrito').value,
        envio: parseFloat(document.querySelector('input[name="envio"]:checked').value),
        metodoPago: metodoSeleccionado,
        productos: cart,
        subtotal: calcularSubtotal(),
        total: calcularSubtotal() + parseFloat(document.querySelector('input[name="envio"]:checked').value),
        fecha: new Date().toISOString(),
        estado: 'Pendiente',
        id: Date.now()
    };
    
    // Guardar pedido en localStorage
    const pedidos = JSON.parse(localStorage.getItem('pedidos_bonanza') || '[]');
    pedidos.push(datosCliente);
    localStorage.setItem('pedidos_bonanza', JSON.stringify(pedidos));
    
    // Limpiar carrito
    localStorage.removeItem('cart_bonanza');
    
    // Redirigir a confirmación
    alert('✅ ¡Pedido realizado con éxito!\n\nPedido #' + datosCliente.id);
    window.location.href = 'index.html';
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    mostrarResumenPedido();
    actualizarTotal();
});

console.log('✅ Checkout cargado');

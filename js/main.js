// ===== NAVEGACIÓN SUAVE =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== FORMULARIO DE NEWSLETTER =====
const newsletterForm = document.getElementById('newsletter-form');
const mensajeSuscripcion = document.getElementById('mensaje-suscripcion');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        
        if (!validarEmail(email)) {
            mostrarMensaje('Por favor ingresa un correo válido', 'error');
            return;
        }
        
        console.log('Email a suscribir:', email);
        mostrarMensaje('¡Gracias por suscribirte! Recibirás nuestros consejos nutricionales.', 'exito');
        newsletterForm.reset();
        
        // IMPORTANTE: Cuando tengas tu backend, usa fetch() aquí
        /*
        fetch('https://tu-backend.railway.app/api/newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                mostrarMensaje('¡Gracias por suscribirte!', 'exito');
                newsletterForm.reset();
            }
        });
        */
    });
}

// ===== FUNCIÓN PARA VALIDAR EMAIL =====
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ===== FUNCIÓN PARA MOSTRAR MENSAJES =====
function mostrarMensaje(mensaje, tipo) {
    if (mensajeSuscripcion) {
        mensajeSuscripcion.textContent = mensaje;
        mensajeSuscripcion.style.color = tipo === 'exito' ? '#97c93d' : '#ff6b35';
        
        setTimeout(() => {
            mensajeSuscripcion.textContent = '';
        }, 5000);
    }
}

// ===== BOTONES "VER MÁS" DE PRODUCTOS =====
const botonesProducto = document.querySelectorAll('.btn-secondary');

botonesProducto.forEach(boton => {
    boton.addEventListener('click', function() {
        const nombreProducto = this.parentElement.querySelector('h3').textContent;
        alert(`Más información sobre: ${nombreProducto}\n\nPróximamente podrás ver detalles completos del producto.`);
        console.log('Producto seleccionado:', nombreProducto);
    });
});

// ===== ANIMACIÓN AL SCROLL =====
const observador = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.producto-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `all 0.5s ease ${index * 0.1}s`;
    observador.observe(card);
});

// ===== EFECTO HEADER AL SCROLL =====
const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', () => {
        const scrollActual = window.pageYOffset;
        
        if (scrollActual > 100) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
}

// ===== VERIFICAR SESIÓN =====
function verificarSesion() {
    const sesion = localStorage.getItem('sesion') || sessionStorage.getItem('sesion');
    return sesion ? JSON.parse(sesion) : null;
}

// ===== MOSTRAR/OCULTAR BOTONES SEGÚN SESIÓN =====
function actualizarInterfazUsuario() {
    const usuario = verificarSesion();
    const header = document.querySelector('.header .nav ul');
    
    if (!header) return;
    
    // Buscar si ya existe el menú de usuario
    const menuUsuarioExistente = document.querySelector('.user-menu');
    if (menuUsuarioExistente) {
        menuUsuarioExistente.remove();
    }
    
    if (usuario) {
        // Usuario logueado - Mostrar nombre y botón de cerrar sesión
        const userMenu = document.createElement('li');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
            <div class="user-dropdown">
                <button class="user-btn">
                    <span class="user-icon">👤</span>
                    <span>${usuario.name}</span>
                </button>
                <div class="dropdown-content">
                    <a href="#" id="mi-cuenta">Mi Cuenta</a>
                    <a href="#" id="mis-pedidos">Mis Pedidos</a>
                    <a href="#" id="cerrar-sesion">Cerrar Sesión</a>
                </div>
            </div>
        `;
        header.appendChild(userMenu);
        
        // Evento para cerrar sesión
        document.getElementById('cerrar-sesion').addEventListener('click', (e) => {
            e.preventDefault();
            cerrarSesion();
        });
        
    } else {
        // Usuario no logueado - Mostrar botón de login
        const loginLink = document.createElement('li');
        loginLink.innerHTML = '<a href="login.html" class="login-link">🔐 Iniciar Sesión</a>';
        header.appendChild(loginLink);
    }
}

// ===== CERRAR SESIÓN =====
function cerrarSesion() {
    localStorage.removeItem('sesion');
    sessionStorage.removeItem('sesion');
    
    alert('Sesión cerrada exitosamente');
    window.location.reload();
}

// ===== EJECUTAR AL CARGAR LA PÁGINA =====
document.addEventListener('DOMContentLoaded', () => {
    actualizarInterfazUsuario();
    
    // Mostrar mensaje de bienvenida si es un login reciente
    const usuario = verificarSesion();
    if (usuario) {
        const loginTime = new Date(usuario.loginTime);
        const ahora = new Date();
        const diferencia = (ahora - loginTime) / 1000; // segundos
        
        // Si el login fue hace menos de 5 segundos, mostrar bienvenida
        if (diferencia < 5) {
            console.log(`¡Bienvenido ${usuario.name}!`);
        }
    }
});

console.log('✅ JavaScript cargado correctamente');
console.log('🚀 Sitio web Bonanza listo');

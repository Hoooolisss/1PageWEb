// ===== SISTEMA DE AUTENTICACIÓN =====

// Cambiar entre tabs de Login y Registro
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
});

// ===== REGISTRO DE USUARIO =====
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const acceptTerms = document.getElementById('accept-terms').checked;
    
    // Validaciones
    if (!acceptTerms) {
        mostrarMensaje('register-message', 'Debes aceptar los términos y condiciones', 'error');
        return;
    }
    
    if (password.length < 6) {
        mostrarMensaje('register-message', 'La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        mostrarMensaje('register-message', 'Las contraseñas no coinciden', 'error');
        return;
    }
    
    // Verificar si el usuario ya existe
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioExiste = usuarios.find(u => u.email === email);
    
    if (usuarioExiste) {
        mostrarMensaje('register-message', 'Este correo ya está registrado', 'error');
        return;
    }
    
    // Crear nuevo usuario
    const nuevoUsuario = {
        id: Date.now(),
        name: name,
        email: email,
        password: password, // En producción, esto debe estar encriptado
        fechaRegistro: new Date().toISOString()
    };
    
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    mostrarMensaje('register-message', '¡Cuenta creada exitosamente! Redirigiendo...', 'success');
    
    // Limpiar formulario
    registerForm.reset();
    
    // Redireccionar al login después de 2 segundos
    setTimeout(() => {
        loginTab.click();
    }, 2000);
    
    console.log('Usuario registrado:', nuevoUsuario);
});

// ===== LOGIN DE USUARIO =====
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Obtener usuarios guardados
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    // Buscar usuario
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    
    if (!usuario) {
        mostrarMensaje('login-message', 'Correo o contraseña incorrectos', 'error');
        return;
    }
    
    // Login exitoso
    const sesion = {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email,
        loginTime: new Date().toISOString()
    };
    
    // Guardar sesión
    if (rememberMe) {
        localStorage.setItem('sesion', JSON.stringify(sesion));
    } else {
        sessionStorage.setItem('sesion', JSON.stringify(sesion));
    }
    
    mostrarMensaje('login-message', '¡Bienvenido! Redirigiendo...', 'success');
    
    // Redireccionar a la página principal
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
    
    console.log('Login exitoso:', sesion);
});

// ===== FUNCIÓN PARA MOSTRAR MENSAJES =====
function mostrarMensaje(elementId, mensaje, tipo) {
    const messageElement = document.getElementById(elementId);
    messageElement.textContent = mensaje;
    messageElement.className = 'message show ' + tipo;
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 5000);
}

// ===== INDICADOR DE FORTALEZA DE CONTRASEÑA =====
const registerPassword = document.getElementById('register-password');
const strengthIndicator = document.getElementById('password-strength');

if (registerPassword) {
    registerPassword.addEventListener('input', function() {
        const password = this.value;
        let strength = '';
        
        if (password.length === 0) {
            strengthIndicator.className = 'password-strength';
            return;
        }
        
        // Calcular fortaleza
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 10) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z\d]/.test(password)) score++;
        
        if (score <= 2) {
            strength = 'weak';
        } else if (score <= 4) {
            strength = 'medium';
        } else {
            strength = 'strong';
        }
        
        strengthIndicator.className = 'password-strength ' + strength;
    });
}

console.log('✅ Sistema de autenticación cargado');

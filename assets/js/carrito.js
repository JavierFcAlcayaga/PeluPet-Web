// Funcionalidad del carrito
let carrito = [];

// Función para mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
    const notificacion = document.createElement('div');
    notificacion.className = `toast align-items-center text-white bg-${tipo} border-0 position-fixed bottom-0 end-0 m-3`;
    notificacion.setAttribute('role', 'alert');
    notificacion.setAttribute('aria-live', 'assertive');
    notificacion.setAttribute('aria-atomic', 'true');
    
    notificacion.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${mensaje}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.body.appendChild(notificacion);
    const toast = new bootstrap.Toast(notificacion);
    toast.show();
    
    // Remover después de mostrarse
    notificacion.addEventListener('hidden.bs.toast', () => {
        notificacion.remove();
    });
}

// Función para animar el contador del carrito
function animarContador(contador) {
    contador.classList.add('scale-animation');
    setTimeout(() => contador.classList.remove('scale-animation'), 300);
}

// Función para agregar un producto al carrito
function agregarAlCarrito(id, nombre, precio, imagen, boton) {
    const productoExistente = carrito.find(item => item.id === id);
    
    if (productoExistente) {
        productoExistente.cantidad++;
        mostrarNotificacion(`Se agregó otra unidad de ${nombre} al carrito`);
    } else {
        carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            cantidad: 1
        });
        mostrarNotificacion(`${nombre} agregado al carrito`);
    }
    
    // Animar el botón
    if (boton) {
        boton.classList.add('btn-success');
        boton.innerHTML = '<i class="bi bi-check2"></i> Agregado';
        setTimeout(() => {
            boton.classList.remove('btn-success');
            boton.innerHTML = '<i class="bi bi-cart-plus"></i> Agregar al Carrito';
        }, 1000);
    }
    
    actualizarContadorCarrito();
    guardarCarritoEnLocalStorage();
}

// Función para actualizar el contador del carrito en la navegación
function actualizarContadorCarrito() {
    const contador = document.querySelector('.badge');
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    contador.textContent = totalItems;
}

// Función para guardar el carrito en localStorage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para cargar el carrito desde localStorage
function cargarCarritoDeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorCarrito();
    }
}

// Funciones para la página del carrito
function mostrarCarrito() {
    const contenedorCarrito = document.querySelector('#items-carrito');
    if (!contenedorCarrito) return;

    contenedorCarrito.innerHTML = '';
    
    carrito.forEach(item => {
        const total = item.precio * item.cantidad;
        const elemento = document.createElement('div');
        elemento.className = 'row mb-3 align-items-center';
        elemento.innerHTML = `
            <div class="col-md-2">
                <img src="${item.imagen}" class="img-fluid rounded" alt="${item.nombre}">
            </div>
            <div class="col-md-4">
                <h5 class="mb-0">${item.nombre}</h5>
                <p class="text-muted mb-0">Servicio Premium</p>
            </div>
            <div class="col-md-2">
                <input type="number" class="form-control cantidad-input" 
                       value="${item.cantidad}" min="1" 
                       data-id="${item.id}">
            </div>
            <div class="col-md-2">
                <span class="fw-bold">$${total.toLocaleString()}</span>
            </div>
            <div class="col-md-2">
                <button class="btn btn-outline-danger eliminar-item" data-id="${item.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        contenedorCarrito.appendChild(elemento);
    });
    
    actualizarResumenCarrito();
}

// Función para actualizar el resumen del carrito
function actualizarResumenCarrito() {
    const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const iva = subtotal * 0.19;
    const total = subtotal + iva;
    
    document.querySelector('#subtotal').textContent = `$${subtotal.toLocaleString()}`;
    document.querySelector('#iva').textContent = `$${iva.toLocaleString()}`;
    document.querySelector('#total').textContent = `$${total.toLocaleString()}`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDeLocalStorage();
    
    // Si estamos en la página del carrito
    if (window.location.pathname.includes('carrito.html')) {
        mostrarCarrito();
        
        // Event listener para cambios en la cantidad
        document.querySelector('#items-carrito').addEventListener('change', (e) => {
            if (e.target.classList.contains('cantidad-input')) {
                const id = e.target.dataset.id;
                const nuevaCantidad = parseInt(e.target.value);
                const item = carrito.find(item => item.id === id);
                if (item) {
                    item.cantidad = nuevaCantidad;
                    guardarCarritoEnLocalStorage();
                    mostrarCarrito();
                    actualizarResumenCarrito();
                }
            }
        });
        
        // Event listener para eliminar items
        document.querySelector('#items-carrito').addEventListener('click', (e) => {
            if (e.target.closest('.eliminar-item')) {
                const id = e.target.closest('.eliminar-item').dataset.id;
                carrito = carrito.filter(item => item.id !== id);
                guardarCarritoEnLocalStorage();
                mostrarCarrito();
                actualizarContadorCarrito();
            }
        });
    }
});

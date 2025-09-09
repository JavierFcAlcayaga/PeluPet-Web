// Cargar el carrito al iniciar
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para actualizar el contador del carrito en todas las páginas
function actualizarContadorCarrito() {
    const contadores = document.querySelectorAll('.contador-carrito');
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    contadores.forEach(contador => {
        contador.textContent = totalItems;
        if (totalItems > 0) {
            contador.style.display = 'inline';
        } else {
            contador.style.display = 'none';
        }
    });
}

// Función para inicializar el carrito en cada página
function inicializarCarrito() {
    // Actualizar el contador al cargar la página
    actualizarContadorCarrito();
    
    // Agregar listeners para el hover del carrito
    const botonesCarrito = document.querySelectorAll('.btn-carrito');
    botonesCarrito.forEach(boton => {
        boton.addEventListener('mouseenter', () => {
            if (carrito.length > 0) {
                mostrarResumenCarrito(boton);
            }
        });
    });
}

// Función para mostrar el resumen rápido del carrito
function mostrarResumenCarrito(boton) {
    const resumenExistente = document.querySelector('.resumen-carrito-popup');
    if (resumenExistente) {
        resumenExistente.remove();
    }

    const resumen = document.createElement('div');
    resumen.className = 'resumen-carrito-popup';
    
    let contenido = '<div class="resumen-items">';
    carrito.forEach(item => {
        contenido += `
            <div class="resumen-item">
                <span class="item-nombre">${item.nombre}</span>
                <span class="item-cantidad">x${item.cantidad}</span>
            </div>
        `;
    });
    contenido += '</div>';
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    contenido += `
        <div class="resumen-total">
            <strong>Total: $${total.toLocaleString()}</strong>
        </div>
        <a href="carrito.html" class="btn btn-sm btn-primary w-100">Ver Carrito</a>
    `;
    
    resumen.innerHTML = contenido;
    boton.parentElement.appendChild(resumen);
    
    // Remover el popup cuando el mouse sale del área
    const removePopup = () => resumen.remove();
    resumen.addEventListener('mouseleave', removePopup);
    boton.addEventListener('mouseleave', (e) => {
        // Pequeño delay para permitir mover el mouse al popup
        setTimeout(() => {
            if (!resumen.matches(':hover')) {
                removePopup();
            }
        }, 100);
    });
}

// Inicializar el carrito cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarCarrito);

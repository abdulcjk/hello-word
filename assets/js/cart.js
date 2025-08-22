// Cart Management

// Cart state
let cartItems = [];
let cartTotal = 0;

// Initialize cart
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
});

function initializeCart() {
    // Load cart from localStorage
    loadCart();
    
    // Setup cart event listeners
    setupCartEvents();
    
    // Update cart display
    updateCartDisplay();
}

function loadCart() {
    try {
        const savedCart = localStorage.getItem('pnpshop_cart');
        if (savedCart) {
            cartItems = JSON.parse(savedCart);
            calculateCartTotal();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
        cartItems = [];
    }
}

function saveCart() {
    try {
        localStorage.setItem('pnpshop_cart', JSON.stringify(cartItems));
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

function setupCartEvents() {
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
    
    // Quantity change events
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('quantity-btn')) {
            event.preventDefault();
            const productId = parseInt(event.target.closest('.cart-item').dataset.productId);
            const action = event.target.dataset.action;
            
            if (action === 'increase') {
                updateCartItemQuantity(productId, 1);
            } else if (action === 'decrease') {
                updateCartItemQuantity(productId, -1);
            }
        }
    });
    
    // Remove item events
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('remove-item') || 
            event.target.closest('.remove-item')) {
            event.preventDefault();
            const productId = parseInt(event.target.closest('.cart-item').dataset.productId);
            removeFromCart(productId);
        }
    });
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showNotification('Product not found', 'error');
        return false;
    }
    
    // Check stock availability
    if (product.stock < quantity) {
        showNotification(`Only ${product.stock} items available in stock`, 'error');
        return false;
    }
    
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
            showNotification(`Only ${product.stock} items available in stock`, 'error');
            return false;
        }
        existingItem.quantity = newQuantity;
    } else {
        cartItems.push({
            id: productId,
            title: product.title,
            price: product.price,
            image: product.image,
            sku: product.sku,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartDisplay();
    showNotification('Product added to cart!', 'success');
    return true;
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    showNotification('Product removed from cart', 'success');
}

function updateCartItemQuantity(productId, change) {
    const item = cartItems.find(item => item.id === productId);
    if (!item) return;
    
    const product = products.find(p => p.id === productId);
    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (product && newQuantity > product.stock) {
        showNotification(`Only ${product.stock} items available in stock`, 'error');
        return;
    }
    
    item.quantity = newQuantity;
    saveCart();
    updateCartDisplay();
}

function calculateCartTotal() {
    cartTotal = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

function updateCartDisplay() {
    calculateCartTotal();
    
    // Update cart count in header
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Show/hide cart count badge
        if (totalItems > 0) {
            cartCount.style.display = 'block';
        } else {
            cartCount.style.display = 'none';
        }
    }
    
    // Update cart sidebar
    updateCartSidebar();
    
    // Update cart page if on cart page
    if (window.location.pathname.includes('cart.html')) {
        updateCartPage();
    }
}

function updateCartSidebar() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (cartItemsContainer) {
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <p>Your cart is empty</p>
                    <button class="btn btn-primary" onclick="window.location.href='products.html'">Start Shopping</button>
                </div>
            `;
        } else {
            cartItemsContainer.innerHTML = cartItems.map(item => `
                <div class="cart-item" data-product-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" data-action="decrease">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" data-action="increase">+</button>
                        </div>
                    </div>
                    <button class="remove-item" title="Remove item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            `).join('');
        }
    }
    
    if (cartTotalElement) {
        cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
    }
}

function updateCartPage() {
    const cartContainer = document.getElementById('cartContainer');
    if (!cartContainer) return;
    
    if (cartItems.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-page">
                <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <button class="btn btn-primary btn-large" onclick="window.location.href='products.html'">Start Shopping</button>
            </div>
        `;
        return;
    }
    
    cartContainer.innerHTML = `
        <div class="cart-content">
            <div class="cart-items-section">
                <h2>Shopping Cart (${cartItems.length} items)</h2>
                <div class="cart-items-list">
                    ${cartItems.map(item => `
                        <div class="cart-item-large" data-product-id="${item.id}">
                            <div class="cart-item-image">
                                <img src="${item.image}" alt="${item.title}">
                            </div>
                            <div class="cart-item-info">
                                <h3>${item.title}</h3>
                                <p class="cart-item-sku">SKU: ${item.sku}</p>
                                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            </div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn" data-action="decrease">-</button>
                                <input type="number" value="${item.quantity}" min="1" max="99" 
                                       onchange="updateCartItemQuantityDirect(${item.id}, this.value)">
                                <button class="quantity-btn" data-action="increase">+</button>
                            </div>
                            <div class="cart-item-total">
                                $${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <button class="remove-item" title="Remove item">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M18 6L6 18M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="cart-summary">
                <h3>Order Summary</h3>
                <div class="summary-item">
                    <span>Subtotal:</span>
                    <span>$${cartTotal.toFixed(2)}</span>
                </div>
                <div class="summary-item">
                    <span>Shipping:</span>
                    <span>${cartTotal > 50 ? 'Free' : '$5.99'}</span>
                </div>
                <div class="summary-item">
                    <span>Tax:</span>
                    <span>$${(cartTotal * 0.08).toFixed(2)}</span>
                </div>
                <div class="summary-total">
                    <span>Total:</span>
                    <span>$${(cartTotal + (cartTotal > 50 ? 0 : 5.99) + (cartTotal * 0.08)).toFixed(2)}</span>
                </div>
                <button class="btn btn-primary btn-full" onclick="handleCheckout()">Proceed to Checkout</button>
                <button class="btn btn-outline btn-full" onclick="window.location.href='products.html'">Continue Shopping</button>
            </div>
        </div>
    `;
}

function updateCartItemQuantityDirect(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 1) return;
    
    const item = cartItems.find(item => item.id === productId);
    if (!item) return;
    
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
        showNotification(`Only ${product.stock} items available in stock`, 'error');
        return;
    }
    
    item.quantity = quantity;
    saveCart();
    updateCartDisplay();
}

function handleCheckout() {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    if (!currentUser) {
        showNotification('Please log in to checkout', 'error');
        openModal('loginModal');
        return;
    }
    
    // In a real application, this would redirect to a checkout page
    // For demo purposes, we'll show a success message and clear the cart
    showNotification('Order placed successfully! Thank you for your purchase.', 'success');
    
    // Clear cart
    cartItems = [];
    saveCart();
    updateCartDisplay();
    
    // Close cart sidebar if open
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar && cartSidebar.classList.contains('open')) {
        cartSidebar.classList.remove('open');
    }
}

function clearCart() {
    cartItems = [];
    saveCart();
    updateCartDisplay();
    showNotification('Cart cleared', 'success');
}

function getCartItemCount() {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
    return cartTotal;
}

function isCartEmpty() {
    return cartItems.length === 0;
}

// Cart persistence across page loads
function persistCart() {
    // This function ensures cart data persists when navigating between pages
    if (typeof cart !== 'undefined') {
        cartItems = cart;
        saveCart();
        updateCartDisplay();
    }
}

// Initialize cart persistence
document.addEventListener('DOMContentLoaded', function() {
    persistCart();
});

// Global functions for use in HTML
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.updateCartItemQuantityDirect = updateCartItemQuantityDirect;
window.handleCheckout = handleCheckout;
window.clearCart = clearCart;
window.getCartItemCount = getCartItemCount;
window.getCartTotal = getCartTotal;
window.isCartEmpty = isCartEmpty;
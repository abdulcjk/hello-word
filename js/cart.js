// Shopping Cart Management
let cart = JSON.parse(localStorage.getItem('pnp_cart')) || [];

// Tax rate (8.5%)
const TAX_RATE = 0.085;

// Free shipping threshold
const FREE_SHIPPING_THRESHOLD = 50;

// Shipping cost
const SHIPPING_COST = 9.99;

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadCartItems();
    updateCartSummary();
});

// Add item to cart
function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) {
        showAlert('Product not found!', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart();
    updateCartCount();
    updateCartSummary();
    
    // Show success message
    showAlert(`${product.title} added to cart!`, 'success');
    
    // Add animation effect to cart icon
    animateCartIcon();
}

// Add to cart from product detail page
function addToCartFromDetail() {
    const productId = getCurrentProductId();
    const quantityInput = document.getElementById('quantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    if (quantity < 1 || quantity > 10) {
        showAlert('Please select a valid quantity (1-10)', 'error');
        return;
    }
    
    addToCart(productId, quantity);
}

// Remove item from cart
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
        const product = getProductById(productId);
        cart.splice(itemIndex, 1);
        saveCart();
        updateCartCount();
        loadCartItems();
        updateCartSummary();
        
        showAlert(`${product?.title || 'Item'} removed from cart`, 'info');
    }
}

// Update item quantity in cart
function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > 10) {
        showAlert('Maximum quantity is 10 per item', 'error');
        return;
    }
    
    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartCount();
        updateCartSummary();
        
        // Update the displayed price for this item
        updateCartItemDisplay(productId);
    }
}

// Update cart item display
function updateCartItemDisplay(productId) {
    const product = getProductById(productId);
    const item = cart.find(item => item.productId === productId);
    
    if (product && item) {
        const priceElement = document.querySelector(`[data-product-id="${productId}"] .cart-item-price`);
        if (priceElement) {
            priceElement.textContent = `$${(product.price * item.quantity).toFixed(2)}`;
        }
        
        const quantityInput = document.querySelector(`[data-product-id="${productId}"] .cart-quantity-input`);
        if (quantityInput) {
            quantityInput.value = item.quantity;
        }
    }
}

// Increase quantity
function increaseQuantity(productId = null) {
    if (productId) {
        // Cart page
        const item = cart.find(item => item.productId === productId);
        if (item) {
            updateCartItemQuantity(productId, item.quantity + 1);
        }
    } else {
        // Product detail page
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < 10) {
                quantityInput.value = currentValue + 1;
            }
        }
    }
}

// Decrease quantity
function decreaseQuantity(productId = null) {
    if (productId) {
        // Cart page
        const item = cart.find(item => item.productId === productId);
        if (item) {
            updateCartItemQuantity(productId, item.quantity - 1);
        }
    } else {
        // Product detail page
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        }
    }
}

// Clear entire cart
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartCount();
        loadCartItems();
        updateCartSummary();
        showAlert('Cart cleared', 'info');
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('pnp_cart', JSON.stringify(cart));
}

// Update cart count in header
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count, .cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
        element.style.display = totalItems > 0 ? 'block' : 'none';
    });
}

// Load and display cart items
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmptySection = document.getElementById('cart-empty');
    const cartItemsSection = document.getElementById('cart-items-section');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        if (cartEmptySection) cartEmptySection.style.display = 'block';
        if (cartItemsSection) cartItemsSection.style.display = 'none';
        return;
    }
    
    if (cartEmptySection) cartEmptySection.style.display = 'none';
    if (cartItemsSection) cartItemsSection.style.display = 'block';
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const product = getProductById(item.productId);
        if (product) {
            const cartItemElement = createCartItemElement(product, item);
            cartItemsContainer.appendChild(cartItemElement);
        }
    });
}

// Create cart item element
function createCartItemElement(product, item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item fade-in';
    cartItem.setAttribute('data-product-id', product.id);
    
    cartItem.innerHTML = `
        <div class="cart-item-image">
            <img src="${product.image}" alt="${product.title}" onerror="handleImageError(this)">
        </div>
        <div class="cart-item-info">
            <h3>${product.title}</h3>
            <p class="cart-item-category">${getCategoryDisplayName(product.category)}</p>
            <p class="cart-item-sku">SKU: ${product.sku}</p>
        </div>
        <div class="cart-item-price">$${(product.price * item.quantity).toFixed(2)}</div>
        <div class="cart-item-controls">
            <div class="cart-item-quantity">
                <button onclick="decreaseQuantity(${product.id})">-</button>
                <input type="number" class="cart-quantity-input" value="${item.quantity}" 
                       min="1" max="10" onchange="updateCartItemQuantity(${product.id}, parseInt(this.value))">
                <button onclick="increaseQuantity(${product.id})">+</button>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart(${product.id})">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `;
    
    return cartItem;
}

// Calculate cart totals
function calculateCartTotals() {
    const subtotal = cart.reduce((total, item) => {
        const product = getProductById(item.productId);
        return product ? total + (product.price * item.quantity) : total;
    }, 0);
    
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;
    
    return {
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        itemCount: cart.reduce((total, item) => total + item.quantity, 0)
    };
}

// Update cart summary
function updateCartSummary() {
    const totals = calculateCartTotals();
    
    // Update summary elements
    const subtotalElement = document.getElementById('cart-subtotal');
    const shippingElement = document.getElementById('cart-shipping');
    const taxElement = document.getElementById('cart-tax');
    const totalElement = document.getElementById('cart-total');
    
    if (subtotalElement) subtotalElement.textContent = `$${totals.subtotal.toFixed(2)}`;
    if (shippingElement) {
        shippingElement.textContent = totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`;
    }
    if (taxElement) taxElement.textContent = `$${totals.tax.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${totals.total.toFixed(2)}`;
    
    // Update shipping notice
    const shippingNotice = document.querySelector('.shipping-notice');
    if (shippingNotice) {
        if (totals.subtotal >= FREE_SHIPPING_THRESHOLD) {
            shippingNotice.innerHTML = '<i class="fas fa-truck"></i><span>Free shipping applied!</span>';
            shippingNotice.style.backgroundColor = 'var(--success-color)';
        } else {
            const remaining = FREE_SHIPPING_THRESHOLD - totals.subtotal;
            shippingNotice.innerHTML = `<i class="fas fa-truck"></i><span>Add $${remaining.toFixed(2)} more for free shipping!</span>`;
            shippingNotice.style.backgroundColor = 'var(--accent-color)';
        }
    }
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showAlert('Your cart is empty!', 'error');
        return;
    }
    
    // For demo purposes, show checkout summary
    const totals = calculateCartTotals();
    const checkoutSummary = `
        Checkout Summary:
        
        Items: ${totals.itemCount}
        Subtotal: $${totals.subtotal.toFixed(2)}
        Shipping: ${totals.shipping === 0 ? 'FREE' : '$' + totals.shipping.toFixed(2)}
        Tax: $${totals.tax.toFixed(2)}
        Total: $${totals.total.toFixed(2)}
        
        This is a demo store. In a real implementation, this would redirect to a payment processor.
    `;
    
    if (confirm(checkoutSummary + '\n\nProceed with demo checkout?')) {
        // Simulate successful checkout
        showAlert('Demo checkout successful! Thank you for your order.', 'success');
        
        // Clear cart after successful checkout
        setTimeout(() => {
            cart = [];
            saveCart();
            updateCartCount();
            loadCartItems();
            updateCartSummary();
        }, 2000);
    }
}

// Animate cart icon when item is added
function animateCartIcon() {
    const cartLinks = document.querySelectorAll('.cart-link');
    cartLinks.forEach(cartLink => {
        cartLink.classList.add('pulse');
        setTimeout(() => {
            cartLink.classList.remove('pulse');
        }, 1000);
    });
}

// Get cart item count
function getCartItemCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Get cart total
function getCartTotal() {
    return calculateCartTotals().total;
}

// Check if product is in cart
function isProductInCart(productId) {
    return cart.some(item => item.productId === productId);
}

// Get product quantity in cart
function getProductQuantityInCart(productId) {
    const item = cart.find(item => item.productId === productId);
    return item ? item.quantity : 0;
}

// Apply coupon code (demo functionality)
function applyCoupon() {
    const couponInput = document.getElementById('coupon-code');
    if (!couponInput) return;
    
    const couponCode = couponInput.value.trim().toUpperCase();
    
    if (couponCode === 'DEMO10') {
        showAlert('Demo coupon applied! 10% discount (feature not fully implemented in demo)', 'success');
    } else if (couponCode === 'FREESHIP') {
        showAlert('Free shipping coupon applied! (feature not fully implemented in demo)', 'success');
    } else if (couponCode) {
        showAlert('Invalid coupon code', 'error');
    }
    
    couponInput.value = '';
}

// Save cart for later (demo functionality)
function saveForLater() {
    if (cart.length === 0) {
        showAlert('Your cart is empty!', 'error');
        return;
    }
    
    localStorage.setItem('pnp_saved_cart', JSON.stringify(cart));
    showAlert('Cart saved for later!', 'success');
}

// Load saved cart (demo functionality)
function loadSavedCart() {
    const savedCart = localStorage.getItem('pnp_saved_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        saveCart();
        updateCartCount();
        loadCartItems();
        updateCartSummary();
        showAlert('Saved cart loaded!', 'success');
        localStorage.removeItem('pnp_saved_cart');
    } else {
        showAlert('No saved cart found', 'info');
    }
}

// Quick add to cart (for product cards)
function quickAddToCart(productId, event) {
    if (event) {
        event.stopPropagation();
        event.preventDefault();
    }
    
    addToCart(productId, 1);
}

// Update cart from product detail page
function updateCartFromDetail() {
    const productId = getCurrentProductId();
    const quantityInput = document.getElementById('quantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
        existingItem.quantity = quantity;
        saveCart();
        updateCartCount();
        updateCartSummary();
        showAlert('Cart updated!', 'success');
    }
}

// Initialize cart functionality on product detail page
function initializeProductDetail() {
    const productId = getCurrentProductId();
    if (productId) {
        const quantityInCart = getProductQuantityInCart(productId);
        const quantityInput = document.getElementById('quantity');
        
        if (quantityInput && quantityInCart > 0) {
            quantityInput.value = quantityInCart;
        }
    }
}

// Call initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('product-detail.html')) {
        initializeProductDetail();
    }
});

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        calculateCartTotals,
        getCartItemCount,
        getCartTotal,
        isProductInCart,
        getProductQuantityInCart
    };
}
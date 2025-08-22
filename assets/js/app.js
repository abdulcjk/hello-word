// PnPStore Main Application JavaScript

// Global Variables
let currentUser = null;
let products = [];
let cart = [];
let isAdmin = false;

// Demo Products Data
const demoProducts = [
    {
        id: 1,
        title: "Wireless Bluetooth Headphones",
        sku: "WH-001",
        barcode: "1234567890123",
        category: "electronics",
        price: 89.99,
        originalPrice: 129.99,
        stock: 25,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
        fullDescription: "Experience crystal-clear sound with our premium wireless Bluetooth headphones. Features include active noise cancellation, 30-hour battery life, quick charging, and comfortable over-ear design. Perfect for music lovers, gamers, and professionals who demand the best audio experience.",
        specifications: {
            "Battery Life": "30 hours",
            "Connectivity": "Bluetooth 5.0",
            "Noise Cancellation": "Active",
            "Weight": "250g",
            "Warranty": "2 years"
        },
        rating: 4.5,
        reviews: 128,
        featured: true
    },
    {
        id: 2,
        title: "Smart Fitness Watch",
        sku: "SFW-002",
        barcode: "1234567890124",
        category: "electronics",
        price: 199.99,
        originalPrice: 249.99,
        stock: 15,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        description: "Advanced fitness tracking with heart rate monitoring and GPS.",
        fullDescription: "Track your fitness journey with our advanced smart fitness watch. Monitor heart rate, track workouts, receive notifications, and stay connected. Features GPS, water resistance, and a vibrant AMOLED display.",
        specifications: {
            "Display": "1.4\" AMOLED",
            "Battery Life": "7 days",
            "Water Resistance": "5ATM",
            "GPS": "Built-in",
            "Heart Rate": "24/7 monitoring"
        },
        rating: 4.3,
        reviews: 89,
        featured: true
    },
    {
        id: 3,
        title: "Premium Cotton T-Shirt",
        sku: "PCT-003",
        barcode: "1234567890125",
        category: "fashion",
        price: 29.99,
        originalPrice: 39.99,
        stock: 50,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        description: "Comfortable and stylish cotton t-shirt for everyday wear.",
        fullDescription: "Made from 100% organic cotton, this premium t-shirt offers ultimate comfort and style. Perfect for casual wear, the soft fabric and modern fit make it a wardrobe essential.",
        specifications: {
            "Material": "100% Organic Cotton",
            "Fit": "Regular",
            "Care": "Machine washable",
            "Sizes": "XS-XXL",
            "Origin": "Made in USA"
        },
        rating: 4.7,
        reviews: 156,
        featured: true
    },
    {
        id: 4,
        title: "Designer Denim Jeans",
        sku: "DDJ-004",
        barcode: "1234567890126",
        category: "fashion",
        price: 79.99,
        originalPrice: 99.99,
        stock: 30,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
        description: "Classic denim jeans with modern styling and perfect fit.",
        fullDescription: "Crafted from premium denim, these designer jeans offer the perfect blend of style and comfort. Features include a modern slim fit, durable construction, and timeless design.",
        specifications: {
            "Material": "Premium Denim",
            "Fit": "Slim",
            "Rise": "Mid-rise",
            "Wash": "Medium wash",
            "Sizes": "28-36"
        },
        rating: 4.4,
        reviews: 92,
        featured: false
    },
    {
        id: 5,
        title: "Modern Coffee Table",
        sku: "MCT-005",
        barcode: "1234567890127",
        category: "home",
        price: 299.99,
        originalPrice: 399.99,
        stock: 8,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
        description: "Elegant coffee table with storage and modern design.",
        fullDescription: "Transform your living room with this elegant modern coffee table. Features include built-in storage, durable construction, and a timeless design that complements any decor style.",
        specifications: {
            "Material": "Solid Wood + Metal",
            "Dimensions": "120cm x 60cm x 45cm",
            "Weight": "25kg",
            "Assembly": "Required",
            "Warranty": "1 year"
        },
        rating: 4.6,
        reviews: 67,
        featured: true
    },
    {
        id: 6,
        title: "Smart LED Light Bulb",
        sku: "SLB-006",
        barcode: "1234567890128",
        category: "home",
        price: 24.99,
        originalPrice: 34.99,
        stock: 40,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop",
        description: "WiFi-enabled smart bulb with voice control and scheduling.",
        fullDescription: "Illuminate your home with smart technology. Control your lights with voice commands, set schedules, and create the perfect ambiance with millions of color options.",
        specifications: {
            "Power": "9W LED",
            "Brightness": "800 lumens",
            "Connectivity": "WiFi 2.4GHz",
            "Voice Control": "Alexa, Google Assistant",
            "Lifespan": "25,000 hours"
        },
        rating: 4.2,
        reviews: 134,
        featured: false
    },
    {
        id: 7,
        title: "Professional Yoga Mat",
        sku: "PYM-007",
        barcode: "1234567890129",
        category: "sports",
        price: 49.99,
        originalPrice: 69.99,
        stock: 35,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
        description: "Non-slip yoga mat perfect for all types of yoga practice.",
        fullDescription: "Enhance your yoga practice with our professional-grade yoga mat. Features include non-slip surface, perfect thickness for comfort, and eco-friendly materials.",
        specifications: {
            "Material": "Eco-friendly TPE",
            "Thickness": "6mm",
            "Dimensions": "183cm x 61cm",
            "Weight": "2.5kg",
            "Care": "Wipe clean"
        },
        rating: 4.8,
        reviews: 203,
        featured: true
    },
    {
        id: 8,
        title: "Wireless Gaming Mouse",
        sku: "WGM-008",
        barcode: "1234567890130",
        category: "electronics",
        price: 69.99,
        originalPrice: 89.99,
        stock: 20,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop",
        description: "High-precision gaming mouse with customizable RGB lighting.",
        fullDescription: "Dominate your games with our wireless gaming mouse. Features include high-precision sensor, customizable RGB lighting, programmable buttons, and ultra-fast response time.",
        specifications: {
            "Sensor": "25K DPI Optical",
            "Battery Life": "70 hours",
            "Connectivity": "2.4GHz Wireless",
            "Buttons": "7 programmable",
            "Weight": "95g"
        },
        rating: 4.4,
        reviews: 78,
        featured: false
    },
    {
        id: 9,
        title: "Ceramic Dinner Set",
        sku: "CDS-009",
        barcode: "1234567890131",
        category: "home",
        price: 89.99,
        originalPrice: 119.99,
        stock: 12,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
        description: "Beautiful ceramic dinner set for 4 people with modern design.",
        fullDescription: "Elevate your dining experience with our beautiful ceramic dinner set. Includes plates, bowls, and mugs for 4 people, all crafted from high-quality ceramic with a modern, elegant design.",
        specifications: {
            "Material": "Premium Ceramic",
            "Set Contents": "4 plates, 4 bowls, 4 mugs",
            "Microwave Safe": "Yes",
            "Dishwasher Safe": "Yes",
            "Design": "Modern minimalist"
        },
        rating: 4.5,
        reviews: 45,
        featured: false
    },
    {
        id: 10,
        title: "Running Shoes",
        sku: "RS-010",
        barcode: "1234567890132",
        category: "sports",
        price: 119.99,
        originalPrice: 149.99,
        stock: 28,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        description: "Lightweight running shoes with superior comfort and support.",
        fullDescription: "Achieve your running goals with our lightweight, comfortable running shoes. Features include superior cushioning, breathable mesh upper, and durable outsole for all types of running surfaces.",
        specifications: {
            "Weight": "280g per shoe",
            "Cushioning": "Advanced foam",
            "Upper": "Breathable mesh",
            "Outsole": "Durable rubber",
            "Sizes": "US 7-12"
        },
        rating: 4.6,
        reviews: 167,
        featured: true
    }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load data from localStorage
    loadData();
    
    // Initialize components
    initializeNavigation();
    initializeSearch();
    initializeModals();
    initializeCart();
    
    // Load products
    if (products.length === 0) {
        products = [...demoProducts];
        saveData();
    }
    
    // Load page-specific content
    loadPageContent();
}

// Data Management
function loadData() {
    try {
        const savedProducts = localStorage.getItem('pnpshop_products');
        const savedCart = localStorage.getItem('pnpshop_cart');
        const savedUser = localStorage.getItem('pnpshop_user');
        
        if (savedProducts) products = JSON.parse(savedProducts);
        if (savedCart) cart = JSON.parse(savedCart);
        if (savedUser) currentUser = JSON.parse(savedUser);
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function saveData() {
    try {
        localStorage.setItem('pnpshop_products', JSON.stringify(products));
        localStorage.setItem('pnpshop_cart', JSON.stringify(cart));
        if (currentUser) {
            localStorage.setItem('pnpshop_user', JSON.stringify(currentUser));
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Navigation
function initializeNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
            }
        }
    });
    
    // Update navigation based on user state
    updateNavigation();
}

function updateNavigation() {
    const navAuth = document.querySelector('.nav-auth');
    const adminLink = document.querySelector('.admin-link');
    
    if (currentUser) {
        if (navAuth) {
            navAuth.innerHTML = `
                <span class="user-name">Welcome, ${currentUser.name}</span>
                <button class="btn btn-outline" onclick="logout()">Logout</button>
            `;
        }
        
        // Show admin link for admin users
        if (currentUser.isAdmin && !adminLink) {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                const adminLink = document.createElement('a');
                adminLink.href = 'admin.html';
                adminLink.className = 'nav-link admin-link';
                adminLink.textContent = 'Admin';
                navMenu.insertBefore(adminLink, navMenu.querySelector('.nav-auth'));
            }
        }
    } else {
        if (navAuth) {
            navAuth.innerHTML = `
                <button id="loginBtn" class="btn btn-outline">Login</button>
                <button id="signupBtn" class="btn btn-primary">Sign Up</button>
            `;
        }
        
        // Remove admin link
        const adminLink = document.querySelector('.admin-link');
        if (adminLink) {
            adminLink.remove();
        }
    }
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput ? searchInput.value.trim() : '';
    
    if (query) {
        // Redirect to products page with search query
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
}

// Modal Management
function initializeModals() {
    // Close modals when clicking outside
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });
    
    // Close modals with close button
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('close')) {
            const modal = event.target.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="display: block"]');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Cart Management
function initializeCart() {
    const cartBtn = document.getElementById('cartBtn');
    const cartClose = document.getElementById('cartClose');
    const cartSidebar = document.getElementById('cartSidebar');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            if (cartSidebar) {
                cartSidebar.classList.add('open');
            }
        });
    }
    
    if (cartClose) {
        cartClose.addEventListener('click', function() {
            if (cartSidebar) {
                cartSidebar.classList.remove('open');
            }
        });
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', function(event) {
        if (cartSidebar && cartSidebar.classList.contains('open')) {
            if (!cartSidebar.contains(event.target) && !cartBtn.contains(event.target)) {
                cartSidebar.classList.remove('open');
            }
        }
    });
    
    updateCartDisplay();
}

function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    saveData();
    updateCartDisplay();
    showNotification('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveData();
    updateCartDisplay();
    showNotification('Product removed from cart!', 'success');
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveData();
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // Update cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                    </div>
                    <button class="action-btn delete" onclick="removeFromCart(${item.id})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            `).join('');
        }
    }
    
    // Update cart total
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

// Page Content Loading
function loadPageContent() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
        case '':
            loadHomePage();
            break;
        case 'products.html':
            loadProductsPage();
            break;
        case 'product-detail.html':
            loadProductDetailPage();
            break;
        case 'contact.html':
            loadContactPage();
            break;
        case 'admin.html':
            loadAdminPage();
            break;
    }
}

function loadHomePage() {
    const featuredProducts = document.getElementById('featuredProducts');
    if (featuredProducts) {
        const featured = products.filter(p => p.featured).slice(0, 4);
        featuredProducts.innerHTML = featured.map(product => createProductCard(product)).join('');
    }
    
    // Category card click handlers
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            window.location.href = `products.html?category=${category}`;
        });
    });
}

function loadProductsPage() {
    // This will be handled by products.js
}

function loadProductDetailPage() {
    // This will be handled by product-detail.js
}

function loadContactPage() {
    // FAQ functionality
    const faqToggles = document.querySelectorAll('.faq-toggle');
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const faqItem = this.closest('.faq-item');
            const answer = faqItem.querySelector('.faq-answer');
            const isActive = answer.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-answer').forEach(ans => {
                ans.classList.remove('active');
            });
            document.querySelectorAll('.faq-toggle').forEach(tog => {
                tog.textContent = '+';
            });
            
            // Toggle current item
            if (!isActive) {
                answer.classList.add('active');
                this.textContent = '-';
            }
        });
    });
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            this.reset();
        });
    }
}

function loadAdminPage() {
    // This will be handled by admin.js
}

// Utility Functions
function createProductCard(product) {
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    return `
        <div class="product-card" onclick="window.location.href='product-detail.html?id=${product.id}'">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${discount > 0 ? `<div class="product-badge">${discount}% OFF</div>` : ''}
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-category">${getCategoryName(product.category)}</p>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

function getCategoryName(category) {
    const categories = {
        'electronics': 'Electronics',
        'fashion': 'Fashion',
        'home': 'Home & Living',
        'sports': 'Sports & Outdoors'
    };
    return categories[category] || category;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// User Management
function logout() {
    currentUser = null;
    localStorage.removeItem('pnpshop_user');
    updateNavigation();
    showNotification('Logged out successfully!', 'success');
    
    // Redirect to home page if on admin page
    if (window.location.pathname.includes('admin.html')) {
        window.location.href = 'index.html';
    }
}

// Global functions for use in HTML
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.logout = logout;
window.performSearch = performSearch;
window.openModal = openModal;
window.closeModal = closeModal;
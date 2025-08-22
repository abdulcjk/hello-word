// PnPStore - Main JavaScript Application

// Demo data for products
const demoProducts = [
    {
        id: 1,
        title: "Wireless Bluetooth Headphones",
        sku: "WH-001",
        barcode: "1234567890123",
        description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
        price: 129.99,
        category: "electronics",
        image: "🎧",
        featured: true
    },
    {
        id: 2,
        title: "Smart Fitness Watch",
        sku: "SFW-002",
        barcode: "1234567890124",
        description: "Advanced fitness tracking with heart rate monitor and GPS.",
        price: 199.99,
        category: "electronics",
        image: "⌚",
        featured: true
    },
    {
        id: 3,
        title: "Premium Cotton T-Shirt",
        sku: "PCT-003",
        barcode: "1234567890125",
        description: "Comfortable 100% cotton t-shirt available in multiple colors.",
        price: 24.99,
        category: "fashion",
        image: "👕",
        featured: true
    },
    {
        id: 4,
        title: "Designer Jeans",
        sku: "DJ-004",
        barcode: "1234567890126",
        description: "High-quality designer jeans with perfect fit and style.",
        price: 89.99,
        category: "fashion",
        image: "👖",
        featured: false
    },
    {
        id: 5,
        title: "Modern Coffee Table",
        sku: "MCT-005",
        barcode: "1234567890127",
        description: "Elegant wooden coffee table with storage compartment.",
        price: 299.99,
        category: "home",
        image: "🪑",
        featured: true
    },
    {
        id: 6,
        title: "Smart LED Light Bulb",
        sku: "SLB-006",
        barcode: "1234567890128",
        description: "WiFi-enabled smart bulb with voice control and color options.",
        price: 39.99,
        category: "home",
        image: "💡",
        featured: false
    },
    {
        id: 7,
        title: "Yoga Mat Premium",
        sku: "YMP-007",
        barcode: "1234567890129",
        description: "Non-slip yoga mat with carrying strap and alignment lines.",
        price: 49.99,
        category: "sports",
        image: "🧘",
        featured: true
    },
    {
        id: 8,
        title: "Dumbbell Set 20kg",
        sku: "DS-008",
        barcode: "1234567890130",
        description: "Professional grade dumbbell set with storage rack.",
        price: 149.99,
        category: "sports",
        image: "🏋️",
        featured: false
    },
    {
        id: 9,
        title: "Gaming Laptop",
        sku: "GL-009",
        barcode: "1234567890131",
        description: "High-performance gaming laptop with RTX graphics.",
        price: 1299.99,
        category: "electronics",
        image: "💻",
        featured: true
    },
    {
        id: 10,
        title: "Wireless Gaming Mouse",
        sku: "WGM-010",
        barcode: "1234567890132",
        description: "Precision gaming mouse with customizable RGB lighting.",
        price: 79.99,
        category: "electronics",
        image: "🖱️",
        featured: false
    }
];

// Demo admin user
const adminUser = {
    email: "admin@pnpsstore.com",
    password: "admin123",
    name: "Admin User",
    isAdmin: true
};

// Application state
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = JSON.parse(localStorage.getItem('products')) || demoProducts;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check for existing user session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }

    // Initialize event listeners
    initializeEventListeners();
    
    // Load featured products on homepage
    if (document.getElementById('featuredProducts')) {
        loadFeaturedProducts();
    }
    
    // Load products on products page
    if (document.getElementById('productsGrid')) {
        loadProducts();
    }
    
    // Load cart on cart page
    if (document.getElementById('cartItems')) {
        loadCart();
    }
    
    // Load admin panel
    if (document.getElementById('adminPanel')) {
        loadAdminPanel();
    }
    
    // Update cart count
    updateCartCount();
}

function initializeEventListeners() {
    // User menu
    const userBtn = document.getElementById('userBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userBtn) {
        userBtn.addEventListener('click', function() {
            userDropdown.classList.toggle('show');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.user-menu')) {
            const dropdowns = document.querySelectorAll('.user-dropdown');
            dropdowns.forEach(dropdown => dropdown.classList.remove('show'));
        }
    });
    
    // Auth modal
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');
    const logoutLink = document.getElementById('logoutLink');
    const adminLink = document.getElementById('adminLink');
    const authModal = document.getElementById('authModal');
    const closeModal = document.querySelector('.close');
    
    if (loginLink) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthModal('login');
        });
    }
    
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthModal('signup');
        });
    }
    
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    if (adminLink) {
        adminLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'admin.html';
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            hideAuthModal();
        });
    }
    
    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === authModal) {
                hideAuthModal();
            }
        });
    }
    
    // Auth forms
    const loginForm = document.getElementById('loginFormElement');
    const signupForm = document.getElementById('signupFormElement');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup();
        });
    }
    
    if (showSignup) {
        showSignup.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthModal('signup');
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthModal('login');
        });
    }
    
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
    
    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            window.location.href = `products.html?category=${category}`;
        });
    });
}

// Authentication functions
function showAuthModal(type) {
    const authModal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (type === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
    
    authModal.style.display = 'block';
}

function hideAuthModal() {
    const authModal = document.getElementById('authModal');
    authModal.style.display = 'none';
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Check against admin user or demo users
    if (email === adminUser.email && password === adminUser.password) {
        currentUser = adminUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserInterface();
        hideAuthModal();
        alert('Login successful!');
    } else {
        // Check demo users
        const demoUsers = JSON.parse(localStorage.getItem('demoUsers')) || [];
        const user = demoUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUserInterface();
            hideAuthModal();
            alert('Login successful!');
        } else {
            alert('Invalid email or password');
        }
    }
}

function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Simple validation
    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Check if user already exists
    const demoUsers = JSON.parse(localStorage.getItem('demoUsers')) || [];
    const existingUser = demoUsers.find(u => u.email === email);
    
    if (existingUser) {
        alert('User with this email already exists');
        return;
    }
    
    // Create new user
    const newUser = {
        name: name,
        email: email,
        password: password,
        isAdmin: false
    };
    
    demoUsers.push(newUser);
    localStorage.setItem('demoUsers', JSON.stringify(demoUsers));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUserInterface();
    hideAuthModal();
    alert('Account created successfully!');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    alert('Logged out successfully!');
}

function updateUserInterface() {
    const userText = document.getElementById('userText');
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');
    const logoutLink = document.getElementById('logoutLink');
    const adminLink = document.getElementById('adminLink');
    
    if (currentUser) {
        userText.textContent = currentUser.name;
        loginLink.style.display = 'none';
        signupLink.style.display = 'none';
        logoutLink.style.display = 'block';
        
        if (currentUser.isAdmin) {
            adminLink.style.display = 'block';
        } else {
            adminLink.style.display = 'none';
        }
    } else {
        userText.textContent = 'Login';
        loginLink.style.display = 'block';
        signupLink.style.display = 'block';
        logoutLink.style.display = 'none';
        adminLink.style.display = 'none';
    }
}

// Product functions
function loadFeaturedProducts() {
    const featuredProducts = products.filter(product => product.featured);
    const container = document.getElementById('featuredProducts');
    
    if (container) {
        container.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
    }
}

function loadProducts() {
    const container = document.getElementById('productsGrid');
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    
    let filteredProducts = products;
    
    if (category) {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    if (search) {
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(search.toLowerCase()) ||
            product.description.toLowerCase().includes(search.toLowerCase())
        );
    }
    
    if (container) {
        container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    }
}

function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image">
                ${product.image}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

function performSearch(query) {
    if (query.trim()) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
}

// Cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Product added to cart!');
}

function loadCart() {
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    
    if (container) {
        if (cart.length === 0) {
            container.innerHTML = '<p>Your cart is empty</p>';
            if (totalElement) totalElement.textContent = '$0.00';
            return;
        }
        
        container.innerHTML = cart.map(item => createCartItem(item)).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    }
}

function createCartItem(item) {
    return `
        <div class="cart-item">
            <div class="cart-item-image">
                ${item.image}
            </div>
            <div class="cart-item-info">
                <h3>${item.title}</h3>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div class="cart-item-total">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            loadCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCart();
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCart();
}

// Admin functions
function loadAdminPanel() {
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'index.html';
        return;
    }
    
    const container = document.getElementById('adminPanel');
    if (container) {
        container.innerHTML = `
            <div class="admin-section">
                <h2>Add New Product</h2>
                <form id="addProductForm">
                    <div class="form-group">
                        <label for="productTitle">Title</label>
                        <input type="text" id="productTitle" required>
                    </div>
                    <div class="form-group">
                        <label for="productSku">SKU</label>
                        <input type="text" id="productSku" required>
                    </div>
                    <div class="form-group">
                        <label for="productBarcode">Barcode</label>
                        <input type="text" id="productBarcode" required>
                    </div>
                    <div class="form-group">
                        <label for="productDescription">Description</label>
                        <textarea id="productDescription" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="productPrice">Price</label>
                        <input type="number" id="productPrice" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label for="productCategory">Category</label>
                        <select id="productCategory" required>
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion</option>
                            <option value="home">Home & Living</option>
                            <option value="sports">Sports & Fitness</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="productImage">Image Emoji</label>
                        <input type="text" id="productImage" placeholder="🎧" required>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" id="productFeatured"> Featured Product
                        </label>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Product</button>
                </form>
            </div>
            
            <div class="admin-section">
                <h2>Bulk Import</h2>
                <div class="form-group">
                    <label for="bulkImport">Paste JSON array of products</label>
                    <textarea id="bulkImport" rows="10" placeholder='[{"title":"Product","sku":"SKU-001",...}]'></textarea>
                </div>
                <button onclick="bulkImport()" class="btn btn-secondary">Import Products</button>
            </div>
            
            <div class="admin-section">
                <h2>Manage Products</h2>
                <div id="productsList">
                    ${createProductsList()}
                </div>
            </div>
        `;
        
        // Add event listener for add product form
        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            addProductForm.addEventListener('submit', function(e) {
                e.preventDefault();
                addProduct();
            });
        }
    }
}

function addProduct() {
    const title = document.getElementById('productTitle').value;
    const sku = document.getElementById('productSku').value;
    const barcode = document.getElementById('productBarcode').value;
    const description = document.getElementById('productDescription').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const category = document.getElementById('productCategory').value;
    const image = document.getElementById('productImage').value;
    const featured = document.getElementById('productFeatured').checked;
    
    const newProduct = {
        id: Date.now(),
        title,
        sku,
        barcode,
        description,
        price,
        category,
        image,
        featured
    };
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    // Reset form
    document.getElementById('addProductForm').reset();
    
    // Update products list
    document.getElementById('productsList').innerHTML = createProductsList();
    
    alert('Product added successfully!');
}

function bulkImport() {
    const jsonData = document.getElementById('bulkImport').value;
    
    try {
        const importedProducts = JSON.parse(jsonData);
        
        if (!Array.isArray(importedProducts)) {
            alert('Please provide a valid JSON array');
            return;
        }
        
        importedProducts.forEach(product => {
            product.id = Date.now() + Math.random();
            products.push(product);
        });
        
        localStorage.setItem('products', JSON.stringify(products));
        document.getElementById('bulkImport').value = '';
        document.getElementById('productsList').innerHTML = createProductsList();
        
        alert(`${importedProducts.length} products imported successfully!`);
    } catch (error) {
        alert('Invalid JSON format');
    }
}

function createProductsList() {
    return products.map(product => `
        <div class="product-item">
            <div class="product-item-info">
                <h3>${product.title}</h3>
                <p>SKU: ${product.sku} | Price: $${product.price}</p>
                <p>Category: ${product.category}</p>
            </div>
            <div class="product-item-actions">
                <button onclick="editProduct(${product.id})" class="btn btn-secondary">Edit</button>
                <button onclick="deleteProduct(${product.id})" class="btn btn-danger">Delete</button>
            </div>
        </div>
    `).join('');
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Simple edit - you can enhance this with a modal
    const newTitle = prompt('Enter new title:', product.title);
    if (newTitle) {
        product.title = newTitle;
        localStorage.setItem('products', JSON.stringify(products));
        document.getElementById('productsList').innerHTML = createProductsList();
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        document.getElementById('productsList').innerHTML = createProductsList();
    }
}

// Utility functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function showNotification(message, type = 'info') {
    // Simple notification - you can enhance this
    alert(message);
}
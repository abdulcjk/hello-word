// Admin Panel Management

let adminData = {
    products: [],
    orders: [],
    users: [],
    stats: {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0
    }
};

let currentAdminTab = 'dashboard';
let editingProduct = null;

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin.html')) {
        initializeAdminPanel();
    }
});

function initializeAdminPanel() {
    // Check if admin is already logged in
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
        showAdminDashboard();
    } else {
        showAdminLoginScreen();
    }
    
    // Setup admin login
    setupAdminLogin();
    
    // Setup auto logout
    setupAutoLogout();
}

function setupAdminLogin() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAdminLogin();
        });
    }
}

function handleAdminLogin() {
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    // Simple admin authentication (in real app, this would be server-side)
    if (username === 'admin' && password === 'admin123') {
        // Store admin session
        localStorage.setItem('adminUser', JSON.stringify({
            username: username,
            loginTime: new Date().toISOString()
        }));
        
        showAdminDashboard();
        showNotification('Admin login successful!', 'success');
    } else {
        showNotification('Invalid admin credentials', 'error');
    }
}

function showAdminLoginScreen() {
    const loginScreen = document.getElementById('adminLoginScreen');
    const dashboard = document.getElementById('adminDashboard');
    
    if (loginScreen) loginScreen.style.display = 'flex';
    if (dashboard) dashboard.style.display = 'none';
}

function showAdminDashboard() {
    const loginScreen = document.getElementById('adminLoginScreen');
    const dashboard = document.getElementById('adminDashboard');
    
    if (loginScreen) loginScreen.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';
    
    // Initialize dashboard
    initializeAdminDashboard();
}

function initializeAdminDashboard() {
    // Load admin data
    loadAdminData();
    
    // Setup admin navigation
    setupAdminNavigation();
    
    // Load initial tab
    showAdminTab('dashboard');
    
    // Setup logout
    setupAdminLogout();
}

function loadAdminData() {
    // Load products from main app
    adminData.products = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Generate demo orders
    adminData.orders = generateDemoOrders();
    
    // Generate demo users
    adminData.users = generateDemoUsers();
    
    // Calculate stats
    calculateAdminStats();
}

function generateDemoOrders() {
    const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const orders = [];
    
    for (let i = 1; i <= 25; i++) {
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));
        
        orders.push({
            id: `ORD-${String(i).padStart(4, '0')}`,
            customerName: `Customer ${i}`,
            customerEmail: `customer${i}@example.com`,
            total: parseFloat((Math.random() * 500 + 50).toFixed(2)),
            status: orderStatuses[Math.floor(Math.random() * orderStatuses.length)],
            date: orderDate.toISOString(),
            items: Math.floor(Math.random() * 5) + 1
        });
    }
    
    return orders.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function generateDemoUsers() {
    const users = [];
    
    for (let i = 1; i <= 50; i++) {
        const joinDate = new Date();
        joinDate.setDate(joinDate.getDate() - Math.floor(Math.random() * 365));
        
        users.push({
            id: i,
            name: `User ${i}`,
            email: `user${i}@example.com`,
            joinDate: joinDate.toISOString(),
            status: Math.random() > 0.1 ? 'active' : 'inactive',
            orders: Math.floor(Math.random() * 10)
        });
    }
    
    return users.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
}

function calculateAdminStats() {
    adminData.stats = {
        totalProducts: adminData.products.length,
        totalOrders: adminData.orders.length,
        totalRevenue: adminData.orders.reduce((sum, order) => sum + order.total, 0),
        totalUsers: adminData.users.length
    };
}

function setupAdminNavigation() {
    const navButtons = document.querySelectorAll('.admin-nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            showAdminTab(tabName);
        });
    });
}

function showAdminTab(tabName) {
    currentAdminTab = tabName;
    
    // Update navigation
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Hide all tab content
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.style.display = 'block';
        
        // Load tab-specific content
        switch (tabName) {
            case 'dashboard':
                loadDashboardTab();
                break;
            case 'products':
                loadProductsTab();
                break;
            case 'orders':
                loadOrdersTab();
                break;
            case 'users':
                loadUsersTab();
                break;
        }
    }
}

function loadDashboardTab() {
    updateDashboardStats();
    loadRecentActivity();
    loadChartData();
}

function updateDashboardStats() {
    const statsContainer = document.getElementById('statsGrid');
    if (!statsContainer) return;
    
    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
            </div>
            <div class="stat-content">
                <h3>${adminData.stats.totalProducts}</h3>
                <p>Total Products</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <div class="stat-content">
                <h3>${adminData.stats.totalOrders}</h3>
                <p>Total Orders</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                </svg>
            </div>
            <div class="stat-content">
                <h3>$${adminData.stats.totalRevenue.toFixed(2)}</h3>
                <p>Total Revenue</p>
            </div>
        </div>
        <div class="stat-card">
            <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                    <path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
            </div>
            <div class="stat-content">
                <h3>${adminData.stats.totalUsers}</h3>
                <p>Total Users</p>
            </div>
        </div>
    `;
}

function loadRecentActivity() {
    const activityContainer = document.getElementById('recentActivity');
    if (!activityContainer) return;
    
    // Get recent orders
    const recentOrders = adminData.orders.slice(0, 5);
    
    activityContainer.innerHTML = recentOrders.map(order => `
        <div class="activity-item">
            <div class="activity-icon">
                ${getActivityIcon(order.status)}
            </div>
            <div class="activity-content">
                <h4>Order ${order.id}</h4>
                <p>${order.customerName} - $${order.total.toFixed(2)}</p>
                <span class="activity-time">${formatDate(order.date)}</span>
            </div>
            <div class="activity-status">
                <span class="status-badge ${order.status}">${order.status}</span>
            </div>
        </div>
    `).join('');
}

function getActivityIcon(status) {
    const icons = {
        pending: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>',
        processing: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>',
        shipped: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
        delivered: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
        cancelled: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
    };
    
    return icons[status] || icons.pending;
}

function loadChartData() {
    // This would integrate with a charting library in a real app
    // For demo purposes, we'll just show placeholder
    const chartContainer = document.getElementById('chartContainer');
    if (chartContainer) {
        chartContainer.innerHTML = `
            <div class="chart-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 3v18h18"/>
                    <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
                </svg>
                <p>Sales Analytics Chart</p>
                <small>Chart data would be displayed here</small>
            </div>
        `;
    }
}

function loadProductsTab() {
    const productsContainer = document.getElementById('productsTable');
    if (!productsContainer) return;
    
    // Setup product actions
    setupProductActions();
    
    // Display products
    displayProductsTable();
}

function setupProductActions() {
    // Add product button
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            openAddProductModal();
        });
    }
    
    // Bulk import button
    const bulkImportBtn = document.getElementById('bulkImportBtn');
    if (bulkImportBtn) {
        bulkImportBtn.addEventListener('click', function() {
            openBulkImportModal();
        });
    }
    
    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportProducts();
        });
    }
    
    // Product search
    const productSearch = document.getElementById('productSearch');
    if (productSearch) {
        productSearch.addEventListener('input', function() {
            filterProductsTable(this.value);
        });
    }
}

function displayProductsTable() {
    const productsContainer = document.getElementById('productsTable');
    if (!productsContainer) return;
    
    productsContainer.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${adminData.products.map(product => `
                    <tr>
                        <td>
                            <img src="${product.image}" alt="${product.title}" class="product-thumb">
                        </td>
                        <td>${product.title}</td>
                        <td>${product.sku}</td>
                        <td>${getCategoryName(product.category)}</td>
                        <td>$${product.price.toFixed(2)}</td>
                        <td>${product.stock}</td>
                        <td>
                            <span class="status-badge ${product.stock > 0 ? 'active' : 'inactive'}">
                                ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </td>
                        <td>
                            <div class="table-actions">
                                <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})">
                                    Edit
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function filterProductsTable(searchTerm) {
    const rows = document.querySelectorAll('#productsTable tbody tr');
    
    rows.forEach(row => {
        const title = row.cells[1].textContent.toLowerCase();
        const sku = row.cells[2].textContent.toLowerCase();
        const category = row.cells[3].textContent.toLowerCase();
        
        if (title.includes(searchTerm.toLowerCase()) || 
            sku.includes(searchTerm.toLowerCase()) || 
            category.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.style.display = 'flex';
        setupAddProductForm();
    }
}

function setupAddProductForm() {
    const form = document.getElementById('addProductForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleAddProduct();
    });
    
    // Reset form
    form.reset();
}

function handleAddProduct() {
    const form = document.getElementById('addProductForm');
    const formData = new FormData(form);
    
    const newProduct = {
        id: Date.now(),
        title: formData.get('title'),
        sku: formData.get('sku'),
        barcode: formData.get('barcode'),
        description: formData.get('description'),
        fullDescription: formData.get('fullDescription'),
        price: parseFloat(formData.get('price')),
        originalPrice: formData.get('originalPrice') ? parseFloat(formData.get('originalPrice')) : null,
        category: formData.get('category'),
        stock: parseInt(formData.get('stock')),
        image: formData.get('image') || 'https://via.placeholder.com/300x300?text=Product',
        featured: formData.get('featured') === 'on',
        specifications: {}
    };
    
    // Add to products array
    adminData.products.push(newProduct);
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(adminData.products));
    
    // Update main app products
    if (typeof products !== 'undefined') {
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    // Close modal and refresh
    closeModal('addProductModal');
    displayProductsTable();
    updateDashboardStats();
    
    showNotification('Product added successfully!', 'success');
}

function editProduct(productId) {
    const product = adminData.products.find(p => p.id === productId);
    if (!product) return;
    
    editingProduct = product;
    openEditProductModal(product);
}

function openEditProductModal(product) {
    const modal = document.getElementById('editProductModal');
    if (!modal) return;
    
    // Populate form
    const form = document.getElementById('editProductForm');
    if (form) {
        form.querySelector('[name="title"]').value = product.title;
        form.querySelector('[name="sku"]').value = product.sku;
        form.querySelector('[name="barcode"]').value = product.barcode || '';
        form.querySelector('[name="description"]').value = product.description;
        form.querySelector('[name="fullDescription"]').value = product.fullDescription || '';
        form.querySelector('[name="price"]').value = product.price;
        form.querySelector('[name="originalPrice"]').value = product.originalPrice || '';
        form.querySelector('[name="category"]').value = product.category;
        form.querySelector('[name="stock"]').value = product.stock;
        form.querySelector('[name="image"]').value = product.image;
        form.querySelector('[name="featured"]').checked = product.featured;
    }
    
    modal.style.display = 'flex';
    setupEditProductForm();
}

function setupEditProductForm() {
    const form = document.getElementById('editProductForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleEditProduct();
    });
}

function handleEditProduct() {
    if (!editingProduct) return;
    
    const form = document.getElementById('editProductForm');
    const formData = new FormData(form);
    
    // Update product
    editingProduct.title = formData.get('title');
    editingProduct.sku = formData.get('sku');
    editingProduct.barcode = formData.get('barcode');
    editingProduct.description = formData.get('description');
    editingProduct.fullDescription = formData.get('fullDescription');
    editingProduct.price = parseFloat(formData.get('price'));
    editingProduct.originalPrice = formData.get('originalPrice') ? parseFloat(formData.get('originalPrice')) : null;
    editingProduct.category = formData.get('category');
    editingProduct.stock = parseInt(formData.get('stock'));
    editingProduct.image = formData.get('image');
    editingProduct.featured = formData.get('featured') === 'on';
    
    // Update in admin data
    const index = adminData.products.findIndex(p => p.id === editingProduct.id);
    if (index !== -1) {
        adminData.products[index] = editingProduct;
    }
    
    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(adminData.products));
    
    // Update main app products
    if (typeof products !== 'undefined') {
        const mainIndex = products.findIndex(p => p.id === editingProduct.id);
        if (mainIndex !== -1) {
            products[mainIndex] = editingProduct;
            localStorage.setItem('products', JSON.stringify(products));
        }
    }
    
    // Close modal and refresh
    closeModal('editProductModal');
    displayProductsTable();
    
    editingProduct = null;
    showNotification('Product updated successfully!', 'success');
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        // Remove from admin data
        adminData.products = adminData.products.filter(p => p.id !== productId);
        
        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(adminData.products));
        
        // Update main app products
        if (typeof products !== 'undefined') {
            products = products.filter(p => p.id !== productId);
            localStorage.setItem('products', JSON.stringify(products));
        }
        
        // Refresh display
        displayProductsTable();
        updateDashboardStats();
        
        showNotification('Product deleted successfully!', 'success');
    }
}

function openBulkImportModal() {
    const modal = document.getElementById('bulkImportModal');
    if (modal) {
        modal.style.display = 'flex';
        setupBulkImportForm();
    }
}

function setupBulkImportForm() {
    const form = document.getElementById('bulkImportForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleBulkImport();
    });
}

function handleBulkImport() {
    const form = document.getElementById('bulkImportForm');
    const formData = new FormData(form);
    const importType = formData.get('importType');
    const importData = formData.get('importData');
    
    if (!importData.trim()) {
        showNotification('Please enter import data', 'error');
        return;
    }
    
    try {
        let importedProducts = [];
        
        if (importType === 'json') {
            importedProducts = JSON.parse(importData);
        } else if (importType === 'csv') {
            importedProducts = parseCSV(importData);
        }
        
        // Process imported products
        importedProducts.forEach(product => {
            product.id = Date.now() + Math.random();
            product.image = product.image || 'https://via.placeholder.com/300x300?text=Product';
            adminData.products.push(product);
        });
        
        // Save to localStorage
        localStorage.setItem('products', JSON.stringify(adminData.products));
        
        // Update main app products
        if (typeof products !== 'undefined') {
            products.push(...importedProducts);
            localStorage.setItem('products', JSON.stringify(products));
        }
        
        // Close modal and refresh
        closeModal('bulkImportModal');
        displayProductsTable();
        updateDashboardStats();
        
        showNotification(`${importedProducts.length} products imported successfully!`, 'success');
        
    } catch (error) {
        showNotification('Error parsing import data. Please check the format.', 'error');
    }
}

function parseCSV(csvData) {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const products = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const product = {};
        
        headers.forEach((header, index) => {
            let value = values[index];
            
            // Parse numeric values
            if (header === 'price' || header === 'originalPrice') {
                value = parseFloat(value) || 0;
            } else if (header === 'stock') {
                value = parseInt(value) || 0;
            } else if (header === 'featured') {
                value = value.toLowerCase() === 'true';
            }
            
            product[header] = value;
        });
        
        products.push(product);
    }
    
    return products;
}

function exportProducts() {
    const dataStr = JSON.stringify(adminData.products, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'products-export.json';
    link.click();
    
    showNotification('Products exported successfully!', 'success');
}

function loadOrdersTab() {
    const ordersContainer = document.getElementById('ordersTable');
    if (!ordersContainer) return;
    
    ordersContainer.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${adminData.orders.map(order => `
                    <tr>
                        <td>${order.id}</td>
                        <td>
                            <div>
                                <strong>${order.customerName}</strong><br>
                                <small>${order.customerEmail}</small>
                            </div>
                        </td>
                        <td>$${order.total.toFixed(2)}</td>
                        <td>
                            <span class="status-badge ${order.status}">${order.status}</span>
                        </td>
                        <td>${formatDate(order.date)}</td>
                        <td>
                            <div class="table-actions">
                                <button class="btn btn-sm btn-primary" onclick="viewOrder('${order.id}')">
                                    View
                                </button>
                                <button class="btn btn-sm btn-secondary" onclick="updateOrderStatus('${order.id}')">
                                    Update
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadUsersTab() {
    const usersContainer = document.getElementById('usersTable');
    if (!usersContainer) return;
    
    usersContainer.innerHTML = `
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th>Orders</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${adminData.users.map(user => `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${formatDate(user.joinDate)}</td>
                        <td>
                            <span class="status-badge ${user.status}">${user.status}</span>
                        </td>
                        <td>${user.orders}</td>
                        <td>
                            <div class="table-actions">
                                <button class="btn btn-sm btn-primary" onclick="viewUser(${user.id})">
                                    View
                                </button>
                                <button class="btn btn-sm btn-secondary" onclick="toggleUserStatus(${user.id})">
                                    ${user.status === 'active' ? 'Deactivate' : 'Activate'}
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function setupAdminLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('adminUser');
                showAdminLoginScreen();
                showNotification('Logged out successfully', 'success');
            }
        });
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
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

// Global functions for use in HTML
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.viewOrder = function(orderId) {
    showNotification(`Viewing order ${orderId}`, 'info');
};
window.updateOrderStatus = function(orderId) {
    showNotification(`Updating order ${orderId}`, 'info');
};
window.viewUser = function(userId) {
    showNotification(`Viewing user ${userId}`, 'info');
};
window.toggleUserStatus = function(userId) {
    const user = adminData.users.find(u => u.id === userId);
    if (user) {
        user.status = user.status === 'active' ? 'inactive' : 'active';
        loadUsersTab();
        showNotification(`User ${user.name} ${user.status}`, 'success');
    }
};
window.closeModal = closeModal;
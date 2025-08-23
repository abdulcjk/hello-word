// Admin Panel Management
let currentAdminSection = 'dashboard';
let importData = [];

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin.html')) {
        initializeAdmin();
    }
});

// Initialize admin functionality
function initializeAdmin() {
    loadAdminProducts();
    updateDashboardStats();
    showAdminSection('dashboard');
}

// Show admin section
function showAdminSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update navigation
    const navItems = document.querySelectorAll('.admin-nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[onclick="showAdminSection('${sectionName}')"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Update page title
    const pageTitle = document.getElementById('admin-page-title');
    if (pageTitle) {
        const titles = {
            'dashboard': 'Dashboard',
            'products': 'Manage Products',
            'add-product': 'Add New Product',
            'bulk-import': 'Bulk Import Products'
        };
        pageTitle.textContent = titles[sectionName] || 'Admin Panel';
    }
    
    currentAdminSection = sectionName;
    
    // Load section-specific data
    if (sectionName === 'products') {
        loadAdminProducts();
    } else if (sectionName === 'dashboard') {
        updateDashboardStats();
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    const totalProductsElement = document.getElementById('total-products');
    if (totalProductsElement) {
        totalProductsElement.textContent = products.length;
    }
    
    // Update other stats (demo data)
    const stats = {
        orders: Math.floor(Math.random() * 50),
        customers: Math.floor(Math.random() * 200) + 100,
        revenue: Math.floor(Math.random() * 5000) + 1000
    };
    
    // These would be updated with real data in a production app
    console.log('Dashboard stats updated:', stats);
}

// Load products for admin table
function loadAdminProducts() {
    const tableBody = document.getElementById('admin-products-table');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (products.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <p>No products found. <a href="#" onclick="showAdminSection('add-product')">Add your first product</a></p>
                </td>
            </tr>
        `;
        return;
    }
    
    products.forEach(product => {
        const row = createProductTableRow(product);
        tableBody.appendChild(row);
    });
}

// Create product table row
function createProductTableRow(product) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <img src="${product.image}" alt="${product.title}" class="product-table-image" onerror="handleImageError(this)">
        </td>
        <td>
            <strong>${product.title}</strong><br>
            <small>${product.description.substring(0, 50)}...</small>
        </td>
        <td>${product.sku}</td>
        <td>${getCategoryDisplayName(product.category)}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>
            <div class="table-actions">
                <button class="btn-edit" onclick="editProduct(${product.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    return row;
}

// Add new product
function addProduct(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateProductForm(form)) {
        return;
    }
    
    // Create new product object
    const newProduct = {
        id: Math.max(...products.map(p => p.id), 0) + 1,
        title: formData.get('title').trim(),
        sku: formData.get('sku').trim(),
        barcode: formData.get('barcode').trim() || '',
        category: formData.get('category'),
        description: formData.get('description').trim(),
        price: parseFloat(formData.get('price')),
        image: formData.get('image').trim()
    };
    
    // Check for duplicate SKU
    if (products.some(p => p.sku === newProduct.sku)) {
        showAlert('A product with this SKU already exists', 'error');
        return;
    }
    
    // Add to products array
    products.push(newProduct);
    
    // Save to localStorage
    localStorage.setItem('pnp_products', JSON.stringify(products));
    
    // Show success message
    showAlert('Product added successfully!', 'success');
    
    // Reset form
    form.reset();
    
    // Update product list if on products page
    if (currentAdminSection === 'products') {
        loadAdminProducts();
    }
    
    // Update dashboard stats
    updateDashboardStats();
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showAlert('Product not found', 'error');
        return;
    }
    
    // Populate edit form
    document.getElementById('edit-product-id').value = product.id;
    document.getElementById('edit-product-title').value = product.title;
    document.getElementById('edit-product-sku').value = product.sku;
    document.getElementById('edit-product-barcode').value = product.barcode || '';
    document.getElementById('edit-product-category').value = product.category;
    document.getElementById('edit-product-description').value = product.description;
    document.getElementById('edit-product-price').value = product.price;
    document.getElementById('edit-product-image').value = product.image;
    
    // Show modal
    const modal = document.getElementById('edit-product-modal');
    if (modal) {
        modal.classList.add('active');
    }
}

// Update product
function updateProduct(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const productId = parseInt(formData.get('id'));
    
    // Validate form
    if (!validateProductForm(form)) {
        return;
    }
    
    // Find product index
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) {
        showAlert('Product not found', 'error');
        return;
    }
    
    // Check for duplicate SKU (excluding current product)
    const newSku = formData.get('sku').trim();
    if (products.some(p => p.sku === newSku && p.id !== productId)) {
        showAlert('A product with this SKU already exists', 'error');
        return;
    }
    
    // Update product
    products[productIndex] = {
        ...products[productIndex],
        title: formData.get('title').trim(),
        sku: newSku,
        barcode: formData.get('barcode').trim() || '',
        category: formData.get('category'),
        description: formData.get('description').trim(),
        price: parseFloat(formData.get('price')),
        image: formData.get('image').trim()
    };
    
    // Save to localStorage
    localStorage.setItem('pnp_products', JSON.stringify(products));
    
    // Show success message
    showAlert('Product updated successfully!', 'success');
    
    // Close modal
    closeEditModal();
    
    // Reload products table
    loadAdminProducts();
}

// Delete product
function deleteProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showAlert('Product not found', 'error');
        return;
    }
    
    if (confirm(`Are you sure you want to delete "${product.title}"?`)) {
        // Remove from products array
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex > -1) {
            products.splice(productIndex, 1);
            
            // Save to localStorage
            localStorage.setItem('pnp_products', JSON.stringify(products));
            
            // Show success message
            showAlert('Product deleted successfully!', 'success');
            
            // Reload products table
            loadAdminProducts();
            
            // Update dashboard stats
            updateDashboardStats();
        }
    }
}

// Validate product form
function validateProductForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Additional validation
    const price = parseFloat(form.querySelector('[name="price"]').value);
    if (isNaN(price) || price < 0) {
        showAlert('Please enter a valid price', 'error');
        isValid = false;
    }
    
    const imageUrl = form.querySelector('[name="image"]').value.trim();
    if (imageUrl && !isValidURL(imageUrl)) {
        showAlert('Please enter a valid image URL', 'error');
        isValid = false;
    }
    
    if (!isValid) {
        showAlert('Please fill in all required fields correctly', 'error');
    }
    
    return isValid;
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('edit-product-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Handle CSV file upload
function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        showAlert('Please select a valid CSV file', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n');
            const headers = lines[0].split(',').map(h => h.trim());
            
            // Validate headers
            const requiredHeaders = ['title', 'sku', 'category', 'description', 'price', 'image'];
            const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
            
            if (missingHeaders.length > 0) {
                showAlert(`Missing required columns: ${missingHeaders.join(', ')}`, 'error');
                return;
            }
            
            // Parse data
            importData = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
                const product = {};
                
                headers.forEach((header, index) => {
                    product[header] = values[index] || '';
                });
                
                // Validate required fields
                if (product.title && product.sku && product.category && product.price) {
                    product.price = parseFloat(product.price);
                    if (!isNaN(product.price)) {
                        importData.push(product);
                    }
                }
            }
            
            if (importData.length === 0) {
                showAlert('No valid products found in CSV file', 'error');
                return;
            }
            
            showImportPreview();
            
        } catch (error) {
            console.error('Error parsing CSV:', error);
            showAlert('Error parsing CSV file', 'error');
        }
    };
    
    reader.readAsText(file);
}

// Handle JSON file upload
function handleJSONUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        showAlert('Please select a valid JSON file', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            
            // Validate JSON structure
            if (!Array.isArray(jsonData)) {
                showAlert('JSON file must contain an array of products', 'error');
                return;
            }
            
            // Validate products
            importData = [];
            jsonData.forEach(product => {
                if (product.title && product.sku && product.category && product.price) {
                    product.price = parseFloat(product.price);
                    if (!isNaN(product.price)) {
                        importData.push(product);
                    }
                }
            });
            
            if (importData.length === 0) {
                showAlert('No valid products found in JSON file', 'error');
                return;
            }
            
            showImportPreview();
            
        } catch (error) {
            console.error('Error parsing JSON:', error);
            showAlert('Error parsing JSON file', 'error');
        }
    };
    
    reader.readAsText(file);
}

// Show import preview
function showImportPreview() {
    const previewContainer = document.getElementById('import-preview');
    const previewContent = document.getElementById('preview-content');
    
    if (!previewContainer || !previewContent) return;
    
    previewContent.innerHTML = `
        <p><strong>${importData.length} products</strong> ready to import:</p>
        <div class="import-preview-list">
            ${importData.slice(0, 5).map(product => `
                <div class="import-preview-item">
                    <strong>${product.title}</strong> - ${product.sku} - $${product.price}
                </div>
            `).join('')}
            ${importData.length > 5 ? `<div class="import-preview-more">... and ${importData.length - 5} more</div>` : ''}
        </div>
    `;
    
    previewContainer.style.display = 'block';
}

// Confirm import
function confirmImport() {
    if (importData.length === 0) {
        showAlert('No data to import', 'error');
        return;
    }
    
    let importedCount = 0;
    let skippedCount = 0;
    
    importData.forEach(productData => {
        // Check for duplicate SKU
        if (products.some(p => p.sku === productData.sku)) {
            skippedCount++;
            return;
        }
        
        // Create new product
        const newProduct = {
            id: Math.max(...products.map(p => p.id), 0) + 1 + importedCount,
            title: productData.title,
            sku: productData.sku,
            barcode: productData.barcode || '',
            category: productData.category,
            description: productData.description || '',
            price: productData.price,
            image: productData.image || 'https://via.placeholder.com/500x400?text=No+Image'
        };
        
        products.push(newProduct);
        importedCount++;
    });
    
    // Save to localStorage
    localStorage.setItem('pnp_products', JSON.stringify(products));
    
    // Show results
    let message = `Import completed! ${importedCount} products imported.`;
    if (skippedCount > 0) {
        message += ` ${skippedCount} products skipped (duplicate SKUs).`;
    }
    
    showAlert(message, 'success');
    
    // Reset import
    cancelImport();
    
    // Reload products table
    loadAdminProducts();
    
    // Update dashboard stats
    updateDashboardStats();
}

// Cancel import
function cancelImport() {
    importData = [];
    
    const previewContainer = document.getElementById('import-preview');
    if (previewContainer) {
        previewContainer.style.display = 'none';
    }
    
    // Reset file inputs
    const csvInput = document.getElementById('csv-file');
    const jsonInput = document.getElementById('json-file');
    
    if (csvInput) csvInput.value = '';
    if (jsonInput) jsonInput.value = '';
}

// Export products to CSV
function exportProductsCSV() {
    if (products.length === 0) {
        showAlert('No products to export', 'error');
        return;
    }
    
    const headers = ['title', 'sku', 'barcode', 'category', 'description', 'price', 'image'];
    const csvContent = [
        headers.join(','),
        ...products.map(product => 
            headers.map(header => {
                const value = product[header] || '';
                return `"${value.toString().replace(/"/g, '""')}"`;
            }).join(',')
        )
    ].join('\n');
    
    downloadFile('products.csv', csvContent, 'text/csv');
    showAlert('Products exported to CSV', 'success');
}

// Export products to JSON
function exportProductsJSON() {
    if (products.length === 0) {
        showAlert('No products to export', 'error');
        return;
    }
    
    const jsonContent = JSON.stringify(products, null, 2);
    downloadFile('products.json', jsonContent, 'application/json');
    showAlert('Products exported to JSON', 'success');
}

// Download file helper
function downloadFile(filename, content, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
}

// Backup all data
function backupData() {
    const backupData = {
        products: products,
        users: JSON.parse(localStorage.getItem('pnp_users') || '[]'),
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    const jsonContent = JSON.stringify(backupData, null, 2);
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    downloadFile(`pnpstore-backup-${timestamp}.json`, jsonContent, 'application/json');
    
    showAlert('Data backup created successfully', 'success');
}

// Restore data from backup
function restoreData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const backupData = JSON.parse(e.target.result);
            
            if (!backupData.products || !Array.isArray(backupData.products)) {
                showAlert('Invalid backup file format', 'error');
                return;
            }
            
            if (confirm('This will replace all current data. Are you sure?')) {
                // Restore products
                products.length = 0;
                products.push(...backupData.products);
                localStorage.setItem('pnp_products', JSON.stringify(products));
                
                // Restore users if available
                if (backupData.users) {
                    localStorage.setItem('pnp_users', JSON.stringify(backupData.users));
                }
                
                showAlert('Data restored successfully', 'success');
                
                // Reload admin interface
                loadAdminProducts();
                updateDashboardStats();
            }
            
        } catch (error) {
            console.error('Error restoring backup:', error);
            showAlert('Error reading backup file', 'error');
        }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

// Initialize products from localStorage if available
document.addEventListener('DOMContentLoaded', function() {
    const savedProducts = localStorage.getItem('pnp_products');
    if (savedProducts) {
        try {
            const parsedProducts = JSON.parse(savedProducts);
            if (Array.isArray(parsedProducts)) {
                products.length = 0;
                products.push(...parsedProducts);
            }
        } catch (error) {
            console.error('Error loading saved products:', error);
        }
    }
});

// Add export buttons to admin interface
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin.html')) {
        // Add export functionality to products section
        const productsSection = document.getElementById('products-section');
        if (productsSection) {
            const sectionHeader = productsSection.querySelector('.section-header');
            if (sectionHeader) {
                const exportButtons = document.createElement('div');
                exportButtons.innerHTML = `
                    <button class="btn btn-secondary" onclick="exportProductsCSV()" style="margin-left: 10px;">
                        <i class="fas fa-download"></i> Export CSV
                    </button>
                    <button class="btn btn-secondary" onclick="exportProductsJSON()">
                        <i class="fas fa-download"></i> Export JSON
                    </button>
                `;
                sectionHeader.appendChild(exportButtons);
            }
        }
    }
});
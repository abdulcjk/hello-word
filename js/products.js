// Products Database with Demo Data
let products = [
    {
        id: 1,
        title: "Wireless Bluetooth Headphones",
        sku: "WBH-001",
        barcode: "1234567890123",
        category: "electronics",
        description: "Premium wireless headphones with noise cancellation, 30-hour battery life, and crystal-clear audio quality. Perfect for music lovers and professionals.",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop"
    },
    {
        id: 2,
        title: "Smart Fitness Watch",
        sku: "SFW-002",
        barcode: "2345678901234",
        category: "electronics",
        description: "Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Compatible with iOS and Android.",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400&fit=crop"
    },
    {
        id: 3,
        title: "Organic Cotton T-Shirt",
        sku: "OCT-003",
        barcode: "3456789012345",
        category: "fashion",
        description: "Soft, comfortable, and sustainable organic cotton t-shirt. Available in multiple colors and sizes. Perfect for everyday wear.",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=400&fit=crop"
    },
    {
        id: 4,
        title: "Professional Coffee Maker",
        sku: "PCM-004",
        barcode: "4567890123456",
        category: "home",
        description: "Programmable coffee maker with built-in grinder, thermal carafe, and customizable brewing strength. Makes the perfect cup every time.",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=400&fit=crop"
    },
    {
        id: 5,
        title: "Leather Crossbody Bag",
        sku: "LCB-005",
        barcode: "5678901234567",
        category: "fashion",
        description: "Elegant genuine leather crossbody bag with adjustable strap and multiple compartments. Perfect for work or casual outings.",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=400&fit=crop"
    },
    {
        id: 6,
        title: "4K Webcam",
        sku: "4KW-006",
        barcode: "6789012345678",
        category: "electronics",
        description: "Ultra HD 4K webcam with auto-focus, built-in microphone, and wide-angle lens. Ideal for streaming, video calls, and content creation.",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=400&fit=crop"
    },
    {
        id: 7,
        title: "Indoor Plant Collection",
        sku: "IPC-007",
        barcode: "7890123456789",
        category: "home",
        description: "Beautiful collection of low-maintenance indoor plants including snake plant, pothos, and peace lily. Includes decorative pots.",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=400&fit=crop"
    },
    {
        id: 8,
        title: "Wireless Charging Pad",
        sku: "WCP-008",
        barcode: "8901234567890",
        category: "electronics",
        description: "Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator and overcharge protection.",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&h=400&fit=crop"
    },
    {
        id: 9,
        title: "Designer Sunglasses",
        sku: "DSG-009",
        barcode: "9012345678901",
        category: "fashion",
        description: "Stylish designer sunglasses with UV400 protection and polarized lenses. Lightweight titanium frame with premium case included.",
        price: 159.99,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=400&fit=crop"
    },
    {
        id: 10,
        title: "Smart Home Security Camera",
        sku: "SHSC-010",
        barcode: "0123456789012",
        category: "electronics",
        description: "HD security camera with night vision, motion detection, two-way audio, and cloud storage. Easy setup with mobile app control.",
        price: 119.99,
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop"
    },
    {
        id: 11,
        title: "Ceramic Dinnerware Set",
        sku: "CDS-011",
        barcode: "1122334455667",
        category: "home",
        description: "Elegant 16-piece ceramic dinnerware set including plates, bowls, and mugs. Dishwasher and microwave safe with modern design.",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=400&fit=crop"
    },
    {
        id: 12,
        title: "Running Shoes",
        sku: "RS-012",
        barcode: "2233445566778",
        category: "fashion",
        description: "High-performance running shoes with responsive cushioning, breathable mesh upper, and durable rubber outsole. Perfect for daily training.",
        price: 109.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=400&fit=crop"
    }
];

// Current filters and search state
let currentFilters = {
    category: 'all',
    priceRange: 'all',
    searchQuery: '',
    sortBy: 'name'
};

// Products per page for pagination
const PRODUCTS_PER_PAGE = 9;
let currentPage = 1;

// Initialize products on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateProductCount();
    
    // Initialize search functionality
    const searchInput = document.getElementById('header-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
    }
});

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Load and display products
function loadProducts() {
    const featuredGrid = document.getElementById('featured-products');
    const productsGrid = document.getElementById('products-grid');
    const relatedGrid = document.getElementById('related-products');
    
    if (featuredGrid) {
        displayProducts(products.slice(0, 6), featuredGrid);
    }
    
    if (productsGrid) {
        const filteredProducts = getFilteredProducts();
        displayProducts(filteredProducts, productsGrid);
        updatePagination(filteredProducts.length);
    }
    
    if (relatedGrid) {
        const currentProductId = getCurrentProductId();
        const currentProduct = products.find(p => p.id === currentProductId);
        if (currentProduct) {
            const relatedProducts = products
                .filter(p => p.category === currentProduct.category && p.id !== currentProductId)
                .slice(0, 4);
            displayProducts(relatedProducts, relatedGrid);
        }
    }
}

// Display products in a grid
function displayProducts(productsToShow, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
            </div>
        `;
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}" loading="lazy" onerror="handleImageError(this)">
        </div>
        <div class="product-info">
            <div class="product-category">${getCategoryDisplayName(product.category)}</div>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}, 1)">
                    <i class="fas fa-shopping-cart"></i>
                    Add to Cart
                </button>
                <button class="view-product-btn" onclick="viewProduct(${product.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </div>
    `;
    return card;
}

// Handle image loading errors
function handleImageError(img) {
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDUwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwSDE1MFYyMDBIMjAwVjI1MEgzNTBWMjAwSDMwMFYxNTBIMjAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
    img.alt = 'Product image not available';
}

// Get category display name
function getCategoryDisplayName(category) {
    const categories = {
        'electronics': 'Electronics',
        'fashion': 'Fashion',
        'home': 'Home & Garden'
    };
    return categories[category] || category;
}

// View product details
function viewProduct(productId) {
    window.location.href = `product-detail.html?id=${productId}`;
}

// Get filtered products based on current filters
function getFilteredProducts() {
    let filtered = [...products];
    
    // Apply search filter
    if (currentFilters.searchQuery) {
        const query = currentFilters.searchQuery.toLowerCase();
        filtered = filtered.filter(product => 
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    }
    
    // Apply category filter
    if (currentFilters.category !== 'all') {
        filtered = filtered.filter(product => product.category === currentFilters.category);
    }
    
    // Apply price range filter
    if (currentFilters.priceRange !== 'all') {
        filtered = filtered.filter(product => {
            const price = product.price;
            switch (currentFilters.priceRange) {
                case '0-50': return price < 50;
                case '50-100': return price >= 50 && price < 100;
                case '100-500': return price >= 100 && price < 500;
                case '500+': return price >= 500;
                default: return true;
            }
        });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
        switch (currentFilters.sortBy) {
            case 'name':
                return a.title.localeCompare(b.title);
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            default:
                return 0;
        }
    });
    
    // Apply pagination
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
}

// Filter products by category
function filterByCategory(category) {
    currentFilters.category = category;
    currentPage = 1;
    
    // Update URL if on products page
    if (window.location.pathname.includes('products.html')) {
        const url = new URL(window.location);
        url.searchParams.set('category', category);
        window.history.pushState({}, '', url);
    } else {
        // Navigate to products page with category filter
        window.location.href = `products.html?category=${category}`;
    }
    
    loadProducts();
    updateProductCount();
}

// Apply filters from the sidebar
function filterProducts() {
    const categoryRadios = document.querySelectorAll('input[name="category"]');
    const priceRadios = document.querySelectorAll('input[name="price"]');
    
    categoryRadios.forEach(radio => {
        if (radio.checked) {
            currentFilters.category = radio.value;
        }
    });
    
    priceRadios.forEach(radio => {
        if (radio.checked) {
            currentFilters.priceRange = radio.value;
        }
    });
    
    currentPage = 1;
    loadProducts();
    updateProductCount();
}

// Sort products
function sortProducts() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        currentFilters.sortBy = sortSelect.value;
        loadProducts();
    }
}

// Handle search functionality
function handleSearch() {
    const searchInput = document.getElementById('header-search');
    if (searchInput) {
        currentFilters.searchQuery = searchInput.value.trim();
        currentPage = 1;
        
        // If not on products page, navigate to it
        if (!window.location.pathname.includes('products.html')) {
            window.location.href = `products.html?search=${encodeURIComponent(currentFilters.searchQuery)}`;
            return;
        }
        
        loadProducts();
        updateProductCount();
    }
}

// Search products function for header search
function searchProducts() {
    handleSearch();
}

// Update product count display
function updateProductCount() {
    const countElement = document.getElementById('products-count');
    if (countElement) {
        const totalFiltered = getTotalFilteredProducts();
        countElement.textContent = `Showing ${totalFiltered} products`;
    }
    
    // Update total products in admin dashboard
    const totalProductsElement = document.getElementById('total-products');
    if (totalProductsElement) {
        totalProductsElement.textContent = products.length;
    }
}

// Get total filtered products (without pagination)
function getTotalFilteredProducts() {
    let filtered = [...products];
    
    if (currentFilters.searchQuery) {
        const query = currentFilters.searchQuery.toLowerCase();
        filtered = filtered.filter(product => 
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    }
    
    if (currentFilters.category !== 'all') {
        filtered = filtered.filter(product => product.category === currentFilters.category);
    }
    
    if (currentFilters.priceRange !== 'all') {
        filtered = filtered.filter(product => {
            const price = product.price;
            switch (currentFilters.priceRange) {
                case '0-50': return price < 50;
                case '50-100': return price >= 50 && price < 100;
                case '100-500': return price >= 100 && price < 500;
                case '500+': return price >= 500;
                default: return true;
            }
        });
    }
    
    return filtered.length;
}

// Update pagination
function updatePagination(totalProducts) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button onclick="changePage(${currentPage - 1})" class="pagination-btn">Previous</button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `<button onclick="changePage(${i})" class="pagination-btn ${activeClass}">${i}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="changePage(${currentPage + 1})" class="pagination-btn">Next</button>`;
    }
    
    paginationContainer.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    currentPage = page;
    loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle mobile filters
function toggleFilters() {
    const sidebar = document.querySelector('.filters-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('mobile-active');
    }
}

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

// Get current product ID from URL
function getCurrentProductId() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

// Initialize URL parameters
function initializeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Set category filter
    const category = urlParams.get('category');
    if (category && category !== 'all') {
        currentFilters.category = category;
        const categoryRadio = document.querySelector(`input[name="category"][value="${category}"]`);
        if (categoryRadio) categoryRadio.checked = true;
    }
    
    // Set search query
    const search = urlParams.get('search');
    if (search) {
        currentFilters.searchQuery = search;
        const searchInput = document.getElementById('header-search');
        if (searchInput) searchInput.value = search;
    }
}

// Initialize page based on URL parameters
document.addEventListener('DOMContentLoaded', function() {
    initializeFromURL();
});

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        getProductById,
        addProduct: function(product) {
            const newId = Math.max(...products.map(p => p.id)) + 1;
            product.id = newId;
            products.push(product);
            return product;
        },
        updateProduct: function(id, updatedProduct) {
            const index = products.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedProduct, id: parseInt(id) };
                return products[index];
            }
            return null;
        },
        deleteProduct: function(id) {
            const index = products.findIndex(p => p.id === parseInt(id));
            if (index !== -1) {
                return products.splice(index, 1)[0];
            }
            return null;
        }
    };
}
// Products Page Management

let filteredProducts = [];
let currentPage = 1;
let productsPerPage = 12;
let currentFilters = {
    categories: [],
    priceRange: { min: 0, max: 1000 },
    search: '',
    sort: 'featured'
};

// Initialize Products Page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('products.html')) {
        initializeProductsPage();
    }
});

function initializeProductsPage() {
    // Load URL parameters
    loadUrlParameters();
    
    // Setup filters
    setupFilters();
    
    // Setup search
    setupSearch();
    
    // Setup sorting
    setupSorting();
    
    // Setup view options
    setupViewOptions();
    
    // Load and display products
    loadProducts();
    
    // Setup load more functionality
    setupLoadMore();
}

function loadUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Load search parameter
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
        currentFilters.search = searchQuery;
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = searchQuery;
        }
    }
    
    // Load category parameter
    const category = urlParams.get('category');
    if (category) {
        currentFilters.categories = [category];
        // Update category checkboxes
        const categoryCheckbox = document.querySelector(`input[value="${category}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
        }
    }
}

function setupFilters() {
    // Category filters
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            if (this.checked) {
                if (!currentFilters.categories.includes(this.value)) {
                    currentFilters.categories.push(this.value);
                }
            } else {
                currentFilters.categories = currentFilters.categories.filter(cat => cat !== this.value);
            }
            applyFilters();
        });
    });
    
    // Price range filter
    const priceRange = document.getElementById('priceRange');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            currentFilters.priceRange.max = parseInt(this.value);
            if (maxPrice) maxPrice.value = this.value;
            applyFilters();
        });
    }
    
    if (minPrice) {
        minPrice.addEventListener('change', function() {
            currentFilters.priceRange.min = parseInt(this.value) || 0;
            applyFilters();
        });
    }
    
    if (maxPrice) {
        maxPrice.addEventListener('change', function() {
            currentFilters.priceRange.max = parseInt(this.value) || 1000;
            if (priceRange) priceRange.value = this.value;
            applyFilters();
        });
    }
    
    // Clear filters button
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentFilters.search = this.value.trim();
            applyFilters();
        });
    }
}

function setupSorting() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentFilters.sort = this.value;
            applyFilters();
        });
    }
}

function setupViewOptions() {
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Apply view
            const view = this.dataset.view;
            applyView(view);
        });
    });
}

function setupLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            loadProducts(true); // true = append to existing products
        });
    }
}

function applyFilters() {
    currentPage = 1; // Reset to first page when filters change
    loadProducts();
}

function clearAllFilters() {
    // Reset filters
    currentFilters = {
        categories: [],
        priceRange: { min: 0, max: 1000 },
        search: '',
        sort: 'featured'
    };
    
    // Reset UI
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(filter => filter.checked = false);
    
    const priceRange = document.getElementById('priceRange');
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    
    if (priceRange) priceRange.value = 1000;
    if (minPrice) minPrice.value = '';
    if (maxPrice) maxPrice.value = '';
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'featured';
    
    // Reload products
    loadProducts();
}

function loadProducts(append = false) {
    // Filter products
    filteredProducts = filterProducts();
    
    // Sort products
    sortProducts();
    
    // Paginate products
    const paginatedProducts = paginateProducts();
    
    // Display products
    displayProducts(paginatedProducts, append);
    
    // Update product count
    updateProductCount();
    
    // Update load more button
    updateLoadMoreButton();
}

function filterProducts() {
    return products.filter(product => {
        // Category filter
        if (currentFilters.categories.length > 0 && !currentFilters.categories.includes(product.category)) {
            return false;
        }
        
        // Price filter
        if (product.price < currentFilters.priceRange.min || product.price > currentFilters.priceRange.max) {
            return false;
        }
        
        // Search filter
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            const productText = `${product.title} ${product.description} ${product.sku}`.toLowerCase();
            if (!productText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
}

function sortProducts() {
    switch (currentFilters.sort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case 'featured':
        default:
            // Keep original order (featured products first)
            break;
    }
}

function paginateProducts() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
}

function displayProducts(productsToShow, append = false) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const productsHTML = productsToShow.map(product => createProductCard(product)).join('');
    
    if (append) {
        productsGrid.innerHTML += productsHTML;
    } else {
        productsGrid.innerHTML = productsHTML;
    }
    
    // Add click handlers to new product cards
    addProductCardHandlers();
}

function createProductCard(product) {
    const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    return `
        <div class="product-card" data-product-id="${product.id}">
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

function addProductCardHandlers() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.dataset.productId;
            window.location.href = `product-detail.html?id=${productId}`;
        });
    });
}

function updateProductCount() {
    const productsCount = document.getElementById('productsCount');
    if (productsCount) {
        productsCount.textContent = filteredProducts.length;
    }
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        if (currentPage >= totalPages) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
}

function applyView(view) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    if (view === 'list') {
        productsGrid.classList.add('list-view');
        productsGrid.classList.remove('grid-view');
    } else {
        productsGrid.classList.add('grid-view');
        productsGrid.classList.remove('list-view');
    }
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

// Search functionality
function performProductSearch(query) {
    currentFilters.search = query;
    applyFilters();
}

// Filter by category
function filterByCategory(category) {
    currentFilters.categories = [category];
    applyFilters();
}

// Sort products
function sortProductsBy(sortType) {
    currentFilters.sort = sortType;
    applyFilters();
}

// Price range filter
function filterByPriceRange(min, max) {
    currentFilters.priceRange = { min: min, max: max };
    applyFilters();
}

// Load more products
function loadMoreProducts() {
    currentPage++;
    loadProducts(true);
}

// Reset filters
function resetFilters() {
    clearAllFilters();
}

// Export functions for global use
window.performProductSearch = performProductSearch;
window.filterByCategory = filterByCategory;
window.sortProductsBy = sortProductsBy;
window.filterByPriceRange = filterByPriceRange;
window.loadMoreProducts = loadMoreProducts;
window.resetFilters = resetFilters;
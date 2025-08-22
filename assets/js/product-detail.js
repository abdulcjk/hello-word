// Product Detail Page Management

let currentProduct = null;
let currentImageIndex = 0;
let productImages = [];

// Initialize Product Detail Page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('product-detail.html')) {
        initializeProductDetail();
    }
});

function initializeProductDetail() {
    // Load product from URL parameter
    loadProductFromUrl();
    
    // Setup product detail functionality
    setupProductDetail();
    
    // Load related products
    loadRelatedProducts();
}

function loadProductFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (productId) {
        currentProduct = products.find(p => p.id === productId);
        if (currentProduct) {
            displayProductDetail();
        } else {
            showProductNotFound();
        }
    } else {
        showProductNotFound();
    }
}

function displayProductDetail() {
    if (!currentProduct) return;
    
    // Update page title
    document.title = `${currentProduct.title} - PnPStore`;
    
    // Update breadcrumb
    updateBreadcrumb();
    
    // Display product images
    displayProductImages();
    
    // Display product information
    displayProductInfo();
    
    // Display product tabs
    displayProductTabs();
    
    // Setup quantity selector
    setupQuantitySelector();
    
    // Setup add to cart functionality
    setupAddToCart();
    
    // Setup buy now functionality
    setupBuyNow();
    
    // Setup tab functionality
    setupTabs();
}

function updateBreadcrumb() {
    const productName = document.getElementById('productName');
    if (productName) {
        productName.textContent = currentProduct.title;
    }
}

function displayProductImages() {
    // Set up product images (main image + thumbnails)
    productImages = [currentProduct.image];
    
    // For demo purposes, create additional images
    for (let i = 1; i <= 3; i++) {
        productImages.push(currentProduct.image + `?v=${i}`);
    }
    
    // Display main image
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = productImages[0];
        mainImage.alt = currentProduct.title;
    }
    
    // Display thumbnail images
    const thumbnailContainer = document.getElementById('thumbnailImages');
    if (thumbnailContainer) {
        thumbnailContainer.innerHTML = productImages.map((image, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeMainImage(${index})">
                <img src="${image}" alt="${currentProduct.title}">
            </div>
        `).join('');
    }
}

function displayProductInfo() {
    // Product title
    const productTitle = document.getElementById('productTitle');
    if (productTitle) {
        productTitle.textContent = currentProduct.title;
    }
    
    // Product SKU
    const productSku = document.getElementById('productSku');
    if (productSku) {
        productSku.textContent = currentProduct.sku;
    }
    
    // Product price
    const currentPrice = document.getElementById('currentPrice');
    const originalPrice = document.getElementById('originalPrice');
    const discountBadge = document.getElementById('discountBadge');
    
    if (currentPrice) {
        currentPrice.textContent = `$${currentProduct.price.toFixed(2)}`;
    }
    
    if (originalPrice && currentProduct.originalPrice) {
        originalPrice.textContent = `$${currentProduct.originalPrice.toFixed(2)}`;
        originalPrice.style.display = 'inline';
    } else if (originalPrice) {
        originalPrice.style.display = 'none';
    }
    
    if (discountBadge && currentProduct.originalPrice) {
        const discount = Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100);
        discountBadge.textContent = `${discount}% OFF`;
        discountBadge.style.display = 'inline';
    } else if (discountBadge) {
        discountBadge.style.display = 'none';
    }
    
    // Product description
    const productDescription = document.getElementById('productDescription');
    if (productDescription) {
        productDescription.innerHTML = `<p>${currentProduct.description}</p>`;
    }
}

function displayProductTabs() {
    // Description tab
    const fullDescription = document.getElementById('fullDescription');
    if (fullDescription) {
        fullDescription.innerHTML = `<p>${currentProduct.fullDescription}</p>`;
    }
    
    // Specifications tab
    const specifications = document.getElementById('specifications');
    if (specifications && currentProduct.specifications) {
        specifications.innerHTML = Object.entries(currentProduct.specifications).map(([key, value]) => `
            <div class="spec-item">
                <span class="spec-label">${key}:</span>
                <span class="spec-value">${value}</span>
            </div>
        `).join('');
    }
    
    // Reviews tab
    loadProductReviews();
}

function loadProductReviews() {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    // Demo reviews data
    const reviews = [
        {
            id: 1,
            name: "Sarah Johnson",
            rating: 5,
            date: "2024-01-15",
            comment: "Excellent product! Exactly what I was looking for. Great quality and fast shipping."
        },
        {
            id: 2,
            name: "Mike Chen",
            rating: 4,
            date: "2024-01-10",
            comment: "Very good product. The quality is great and it works perfectly. Would recommend!"
        },
        {
            id: 3,
            name: "Emily Davis",
            rating: 5,
            date: "2024-01-08",
            comment: "Amazing product! Exceeded my expectations. The customer service was also excellent."
        }
    ];
    
    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="reviewer-info">
                    <h4>${review.name}</h4>
                    <div class="review-date">${formatDate(review.date)}</div>
                </div>
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
            </div>
            <div class="review-content">
                <p>${review.comment}</p>
            </div>
        </div>
    `).join('');
}

function setupQuantitySelector() {
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityInput = document.getElementById('quantity');
    
    if (decreaseBtn) {
        decreaseBtn.addEventListener('click', function() {
            const currentQty = parseInt(quantityInput.value);
            if (currentQty > 1) {
                quantityInput.value = currentQty - 1;
            }
        });
    }
    
    if (increaseBtn) {
        increaseBtn.addEventListener('click', function() {
            const currentQty = parseInt(quantityInput.value);
            if (currentQty < currentProduct.stock) {
                quantityInput.value = currentQty + 1;
            }
        });
    }
    
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const value = parseInt(this.value);
            if (value < 1) {
                this.value = 1;
            } else if (value > currentProduct.stock) {
                this.value = currentProduct.stock;
            }
        });
    }
}

function setupAddToCart() {
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            addToCart(currentProduct.id, quantity);
        });
    }
}

function setupBuyNow() {
    const buyNowBtn = document.getElementById('buyNowBtn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            addToCart(currentProduct.id, quantity);
            
            // Redirect to checkout (in a real app)
            showNotification('Redirecting to checkout...', 'success');
            setTimeout(() => {
                // For demo, just show success message
                showNotification('Order placed successfully!', 'success');
            }, 1000);
        });
    }
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            const targetPane = document.getElementById(tabName);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}

function loadRelatedProducts() {
    const relatedProductsContainer = document.getElementById('relatedProducts');
    if (!relatedProductsContainer) return;
    
    // Get related products (same category, excluding current product)
    const relatedProducts = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);
    
    if (relatedProducts.length > 0) {
        relatedProductsContainer.innerHTML = relatedProducts.map(product => createProductCard(product)).join('');
    } else {
        // If no related products, show some featured products
        const featuredProducts = products.filter(p => p.featured && p.id !== currentProduct.id).slice(0, 4);
        relatedProductsContainer.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
    }
}

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

function changeMainImage(index) {
    if (index < 0 || index >= productImages.length) return;
    
    currentImageIndex = index;
    
    // Update main image
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = productImages[index];
    }
    
    // Update thumbnail active state
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        if (i === index) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

function showProductNotFound() {
    const main = document.querySelector('main');
    if (main) {
        main.innerHTML = `
            <div class="container">
                <div class="product-not-found">
                    <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <h1>Product Not Found</h1>
                    <p>The product you're looking for doesn't exist or has been removed.</p>
                    <button class="btn btn-primary" onclick="window.location.href='products.html'">Browse Products</button>
                </div>
            </div>
        `;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let stars = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<span class="star filled">★</span>';
    }
    
    // Half star
    if (hasHalfStar) {
        stars += '<span class="star half">★</span>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        stars += '<span class="star">★</span>';
    }
    
    return stars;
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
window.changeMainImage = changeMainImage;
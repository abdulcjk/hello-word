// Product Detail Page Management
let currentProduct = null;

// Initialize product detail page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('product-detail.html')) {
        initializeProductDetail();
    }
});

// Initialize product detail functionality
function initializeProductDetail() {
    const productId = getCurrentProductId();
    if (!productId) {
        showProductNotFound();
        return;
    }
    
    currentProduct = getProductById(productId);
    if (!currentProduct) {
        showProductNotFound();
        return;
    }
    
    loadProductDetail(currentProduct);
    loadRelatedProducts(currentProduct);
    initializeImageGallery();
    updatePageTitle(currentProduct);
    updateBreadcrumb(currentProduct);
}

// Load product detail information
function loadProductDetail(product) {
    // Hide not found message and show content
    const notFoundSection = document.getElementById('product-not-found');
    const contentSection = document.getElementById('product-detail-content');
    
    if (notFoundSection) notFoundSection.style.display = 'none';
    if (contentSection) contentSection.style.display = 'block';
    
    // Update product information
    updateElement('product-category', getCategoryDisplayName(product.category));
    updateElement('product-title', product.title);
    updateElement('product-sku', product.sku);
    updateElement('product-barcode', product.barcode || 'N/A');
    updateElement('product-price', `$${product.price.toFixed(2)}`);
    updateElement('product-description', product.description);
    
    // Update main product image
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = product.image;
        mainImage.alt = product.title;
        mainImage.onerror = function() {
            handleImageError(this);
        };
    }
    
    // Create image thumbnails (for demo, we'll use the same image)
    createImageThumbnails(product);
    
    // Update quantity input with cart value if product is already in cart
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        const cartQuantity = getProductQuantityInCart(product.id);
        if (cartQuantity > 0) {
            quantityInput.value = cartQuantity;
        }
    }
}

// Update element content safely
function updateElement(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = content;
    }
}

// Show product not found message
function showProductNotFound() {
    const notFoundSection = document.getElementById('product-not-found');
    const contentSection = document.getElementById('product-detail-content');
    
    if (notFoundSection) notFoundSection.style.display = 'block';
    if (contentSection) contentSection.style.display = 'none';
    
    // Update page title
    document.title = 'Product Not Found - PnPStore';
}

// Update page title
function updatePageTitle(product) {
    document.title = `${product.title} - PnPStore`;
    
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = `${product.title} - PnPStore`;
    }
}

// Update breadcrumb
function updateBreadcrumb(product) {
    const breadcrumbProduct = document.getElementById('breadcrumb-product');
    if (breadcrumbProduct) {
        breadcrumbProduct.textContent = product.title;
    }
}

// Create image thumbnails
function createImageThumbnails(product) {
    const thumbnailsContainer = document.getElementById('image-thumbnails');
    if (!thumbnailsContainer) return;
    
    // For demo purposes, we'll create multiple thumbnails of the same image
    // In a real application, products would have multiple images
    const thumbnailImages = [
        product.image,
        product.image, // In reality, these would be different angles/views
        product.image,
        product.image
    ];
    
    thumbnailsContainer.innerHTML = '';
    
    thumbnailImages.forEach((imageUrl, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${imageUrl}" alt="${product.title} view ${index + 1}" onerror="handleImageError(this)">`;
        
        thumbnail.addEventListener('click', function() {
            switchMainImage(imageUrl, this);
        });
        
        thumbnailsContainer.appendChild(thumbnail);
    });
}

// Switch main image
function switchMainImage(imageUrl, thumbnailElement) {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        mainImage.src = imageUrl;
        
        // Update active thumbnail
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        if (thumbnailElement) {
            thumbnailElement.classList.add('active');
        }
    }
}

// Initialize image gallery functionality
function initializeImageGallery() {
    const mainImage = document.getElementById('main-product-image');
    if (mainImage) {
        // Add click to zoom functionality
        mainImage.addEventListener('click', function() {
            openImageModal(this.src, currentProduct.title);
        });
        
        mainImage.style.cursor = 'zoom-in';
        mainImage.title = 'Click to enlarge';
    }
}

// Open image in modal for zooming
function openImageModal(imageSrc, imageTitle) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('image-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'image-modal';
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal-content">
                <span class="image-modal-close">&times;</span>
                <img class="image-modal-img" id="modal-image">
                <div class="image-modal-caption" id="modal-caption"></div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add modal styles
        if (!document.getElementById('image-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'image-modal-styles';
            styles.textContent = `
                .image-modal {
                    display: none;
                    position: fixed;
                    z-index: 2000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.9);
                    animation: fadeIn 0.3s;
                }
                
                .image-modal-content {
                    margin: auto;
                    display: block;
                    width: 80%;
                    max-width: 700px;
                    position: relative;
                    top: 50%;
                    transform: translateY(-50%);
                }
                
                .image-modal-img {
                    width: 100%;
                    height: auto;
                    border-radius: 8px;
                }
                
                .image-modal-close {
                    position: absolute;
                    top: 15px;
                    right: 35px;
                    color: #f1f1f1;
                    font-size: 40px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: 0.3s;
                }
                
                .image-modal-close:hover {
                    color: #bbb;
                }
                
                .image-modal-caption {
                    margin: auto;
                    display: block;
                    width: 80%;
                    max-width: 700px;
                    text-align: center;
                    color: #ccc;
                    padding: 10px 0;
                    height: 150px;
                }
                
                @media only screen and (max-width: 700px) {
                    .image-modal-content {
                        width: 100%;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Add event listeners
        const closeBtn = modal.querySelector('.image-modal-close');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    // Show modal with image
    const modalImage = document.getElementById('modal-image');
    const modalCaption = document.getElementById('modal-caption');
    
    modal.style.display = 'block';
    modalImage.src = imageSrc;
    modalCaption.textContent = imageTitle;
}

// Load related products
function loadRelatedProducts(product) {
    const relatedGrid = document.getElementById('related-products');
    if (!relatedGrid) return;
    
    // Find products in the same category, excluding current product
    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
    
    if (relatedProducts.length === 0) {
        // If no related products in same category, show random products
        const randomProducts = products
            .filter(p => p.id !== product.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
        
        displayProducts(randomProducts, relatedGrid);
    } else {
        displayProducts(relatedProducts, relatedGrid);
    }
}

// Quantity control functions for product detail page
function increaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
        } else {
            showAlert('Maximum quantity is 10 per item', 'warning');
        }
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    }
}

// Add to cart from detail page
function addToCartFromDetail() {
    if (!currentProduct) {
        showAlert('Product not found', 'error');
        return;
    }
    
    const quantityInput = document.getElementById('quantity');
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
    
    if (quantity < 1 || quantity > 10) {
        showAlert('Please select a valid quantity (1-10)', 'error');
        return;
    }
    
    addToCart(currentProduct.id, quantity);
}

// Share product functionality
function shareProduct() {
    if (!currentProduct) return;
    
    const url = window.location.href;
    const title = `Check out ${currentProduct.title} on PnPStore`;
    const text = currentProduct.description;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).catch(console.error);
    } else {
        copyToClipboard(url);
        showAlert('Product link copied to clipboard!', 'success');
    }
}

// Print product details
function printProduct() {
    window.print();
}

// Add to wishlist (demo functionality)
function addToWishlist() {
    if (!currentProduct) return;
    
    const wishlist = JSON.parse(localStorage.getItem('pnp_wishlist') || '[]');
    
    if (wishlist.some(item => item.productId === currentProduct.id)) {
        showAlert('Product is already in your wishlist', 'info');
        return;
    }
    
    wishlist.push({
        productId: currentProduct.id,
        addedAt: new Date().toISOString()
    });
    
    localStorage.setItem('pnp_wishlist', JSON.stringify(wishlist));
    showAlert('Product added to wishlist!', 'success');
}

// Compare products (demo functionality)
function addToCompare() {
    if (!currentProduct) return;
    
    const compareList = JSON.parse(localStorage.getItem('pnp_compare') || '[]');
    
    if (compareList.length >= 4) {
        showAlert('You can compare up to 4 products at a time', 'warning');
        return;
    }
    
    if (compareList.some(item => item.productId === currentProduct.id)) {
        showAlert('Product is already in comparison list', 'info');
        return;
    }
    
    compareList.push({
        productId: currentProduct.id,
        addedAt: new Date().toISOString()
    });
    
    localStorage.setItem('pnp_compare', JSON.stringify(compareList));
    showAlert('Product added to comparison list!', 'success');
}

// Handle product rating (demo functionality)
function rateProduct(rating) {
    if (!currentProduct || rating < 1 || rating > 5) return;
    
    const ratings = JSON.parse(localStorage.getItem('pnp_ratings') || '{}');
    ratings[currentProduct.id] = {
        rating: rating,
        ratedAt: new Date().toISOString()
    };
    
    localStorage.setItem('pnp_ratings', JSON.stringify(ratings));
    showAlert(`Thank you for rating this product ${rating} star${rating !== 1 ? 's' : ''}!`, 'success');
    
    updateProductRating(rating);
}

// Update product rating display
function updateProductRating(rating) {
    const ratingStars = document.querySelectorAll('.rating-star');
    ratingStars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Initialize product rating display
function initializeProductRating() {
    if (!currentProduct) return;
    
    const ratings = JSON.parse(localStorage.getItem('pnp_ratings') || '{}');
    const userRating = ratings[currentProduct.id];
    
    if (userRating) {
        updateProductRating(userRating.rating);
    }
}

// Handle product reviews (demo functionality)
function submitReview(event) {
    event.preventDefault();
    
    if (!currentProduct) return;
    
    const form = event.target;
    const formData = new FormData(form);
    const reviewText = formData.get('review').trim();
    const rating = parseInt(formData.get('rating'));
    
    if (!reviewText || !rating) {
        showAlert('Please provide both a rating and review text', 'error');
        return;
    }
    
    const reviews = JSON.parse(localStorage.getItem('pnp_reviews') || '{}');
    if (!reviews[currentProduct.id]) {
        reviews[currentProduct.id] = [];
    }
    
    reviews[currentProduct.id].push({
        review: reviewText,
        rating: rating,
        author: getCurrentUser()?.firstName || 'Anonymous',
        date: new Date().toISOString()
    });
    
    localStorage.setItem('pnp_reviews', JSON.stringify(reviews));
    showAlert('Thank you for your review!', 'success');
    
    form.reset();
    loadProductReviews();
}

// Load product reviews
function loadProductReviews() {
    if (!currentProduct) return;
    
    const reviewsContainer = document.getElementById('product-reviews');
    if (!reviewsContainer) return;
    
    const reviews = JSON.parse(localStorage.getItem('pnp_reviews') || '{}');
    const productReviews = reviews[currentProduct.id] || [];
    
    if (productReviews.length === 0) {
        reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
        return;
    }
    
    reviewsContainer.innerHTML = productReviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">${review.author}</span>
                <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                <span class="review-date">${formatDate(review.date)}</span>
            </div>
            <div class="review-text">${review.review}</div>
        </div>
    `).join('');
}

// Handle keyboard navigation for quantity input
document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                increaseQuantity();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                decreaseQuantity();
            }
        });
    }
});

// Handle back navigation
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = 'products.html';
    }
}

// Initialize all product detail functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('product-detail.html')) {
        // Initialize rating display after product is loaded
        setTimeout(() => {
            initializeProductRating();
            loadProductReviews();
        }, 100);
    }
});

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        currentProduct,
        loadProductDetail,
        shareProduct,
        addToWishlist,
        addToCompare,
        rateProduct
    };
}
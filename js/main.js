// Main JavaScript - Utility functions and common functionality

// Global variables
let isLoading = false;
let alertTimeout;

// Initialize main functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeAlertSystem();
    initializeScrollToTop();
    initializeLoadingStates();
    initializeFormValidation();
    initializeSmoothScrolling();
    initializeImageLazyLoading();
});

// Alert system
function showAlert(message, type = 'info', duration = 4000) {
    // Clear existing timeout
    if (alertTimeout) {
        clearTimeout(alertTimeout);
    }
    
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert-notification');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert-notification alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <i class="alert-icon ${getAlertIcon(type)}"></i>
            <span class="alert-message">${message}</span>
            <button class="alert-close" onclick="closeAlert(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to document
    document.body.appendChild(alert);
    
    // Animate in
    setTimeout(() => {
        alert.classList.add('show');
    }, 100);
    
    // Auto-remove after duration
    alertTimeout = setTimeout(() => {
        closeAlert(alert);
    }, duration);
}

// Get alert icon based on type
function getAlertIcon(type) {
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

// Close alert
function closeAlert(element) {
    const alert = element.closest ? element.closest('.alert-notification') : element;
    if (alert) {
        alert.classList.remove('show');
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 300);
    }
    
    if (alertTimeout) {
        clearTimeout(alertTimeout);
    }
}

// Initialize alert system styles
function initializeAlertSystem() {
    if (!document.getElementById('alert-styles')) {
        const styles = document.createElement('style');
        styles.id = 'alert-styles';
        styles.textContent = `
            .alert-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                max-width: 400px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                transform: translateX(100%);
                transition: transform 0.3s ease-in-out;
                border-left: 4px solid var(--primary-color);
            }
            
            .alert-notification.show {
                transform: translateX(0);
            }
            
            .alert-notification.alert-success {
                border-left-color: var(--success-color);
            }
            
            .alert-notification.alert-error {
                border-left-color: var(--error-color);
            }
            
            .alert-notification.alert-warning {
                border-left-color: var(--warning-color);
            }
            
            .alert-notification.alert-info {
                border-left-color: var(--primary-color);
            }
            
            .alert-content {
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .alert-icon {
                font-size: 20px;
                flex-shrink: 0;
            }
            
            .alert-success .alert-icon {
                color: var(--success-color);
            }
            
            .alert-error .alert-icon {
                color: var(--error-color);
            }
            
            .alert-warning .alert-icon {
                color: var(--warning-color);
            }
            
            .alert-info .alert-icon {
                color: var(--primary-color);
            }
            
            .alert-message {
                flex: 1;
                color: var(--gray-800);
                font-size: 14px;
                line-height: 1.4;
            }
            
            .alert-close {
                background: none;
                border: none;
                color: var(--gray-500);
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s;
                flex-shrink: 0;
            }
            
            .alert-close:hover {
                background-color: var(--gray-100);
                color: var(--gray-700);
            }
            
            @media (max-width: 480px) {
                .alert-notification {
                    left: 10px;
                    right: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navMenu.classList.remove('mobile-active');
            }
        });
        
        // Close menu when clicking on a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-active');
            });
        });
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.classList.toggle('mobile-active');
    }
}

// Loading states
function initializeLoadingStates() {
    // Add loading state to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.classList.remove('loading');
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    });
}

// Show loading spinner
function showLoading(element) {
    if (element) {
        element.classList.add('loading');
        element.disabled = true;
    }
    isLoading = true;
}

// Hide loading spinner
function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
        element.disabled = false;
    }
    isLoading = false;
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    
    // Password validation
    if (field.type === 'password' && value && value.length < 6) {
        isValid = false;
        errorMessage = 'Password must be at least 6 characters long';
    }
    
    // Phone validation
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }
    
    // Number validation
    if (field.type === 'number' && value) {
        const num = parseFloat(value);
        const min = parseFloat(field.getAttribute('min'));
        const max = parseFloat(field.getAttribute('max'));
        
        if (isNaN(num)) {
            isValid = false;
            errorMessage = 'Please enter a valid number';
        } else if (!isNaN(min) && num < min) {
            isValid = false;
            errorMessage = `Value must be at least ${min}`;
        } else if (!isNaN(max) && num > max) {
            isValid = false;
            errorMessage = `Value must not exceed ${max}`;
        }
    }
    
    // URL validation
    if (field.type === 'url' && value && !isValidURL(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid URL';
    }
    
    if (isValid) {
        clearFieldError(field);
    } else {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('error');
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Validation helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Smooth scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll to top functionality
function initializeScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add styles for scroll to top button
    if (!document.getElementById('scroll-to-top-styles')) {
        const styles = document.createElement('style');
        styles.id = 'scroll-to-top-styles';
        styles.textContent = `
            .scroll-to-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                background-color: var(--primary-color);
                color: white;
                border: none;
                border-radius: 50%;
                font-size: 18px;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transform: translateY(20px);
                transition: all 0.3s ease;
                z-index: 1000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .scroll-to-top.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .scroll-to-top:hover {
                background-color: var(--primary-hover);
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
            }
            
            @media (max-width: 768px) {
                .scroll-to-top {
                    bottom: 20px;
                    right: 20px;
                    width: 45px;
                    height: 45px;
                    font-size: 16px;
                }
            }
        `;
        document.head.appendChild(styles);
    }
}

// Lazy loading for images
function initializeImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Utility functions
function formatPrice(price) {
    return `$${parseFloat(price).toFixed(2)}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showAlert('Copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showAlert('Copied to clipboard!', 'success');
    } catch (err) {
        showAlert('Failed to copy to clipboard', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Contact form submission
function submitContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showAlert('Please fill in all required fields correctly', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    showLoading(submitBtn);
    
    // Simulate form submission
    setTimeout(() => {
        hideLoading(submitBtn);
        showAlert('Thank you for your message! We\'ll get back to you soon.', 'success');
        form.reset();
    }, 2000);
}

// Newsletter subscription
function subscribeNewsletter(email) {
    if (!email || !isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate subscription
    showAlert('Thank you for subscribing to our newsletter!', 'success');
}

// Print functionality
function printPage() {
    window.print();
}

// Share functionality
function shareProduct(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const url = `${window.location.origin}/product-detail.html?id=${productId}`;
    const title = `Check out ${product.title} on PnPStore`;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: product.description,
            url: url
        }).catch(console.error);
    } else {
        copyToClipboard(url);
        showAlert('Product link copied to clipboard!', 'success');
    }
}

// Local storage utilities
function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getLocalStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

function removeLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

// Performance monitoring
function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showAlert('An unexpected error occurred. Please refresh the page.', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showAlert('An unexpected error occurred. Please try again.', 'error');
});

// Export utility functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showAlert,
        formatPrice,
        formatDate,
        formatDateTime,
        isValidEmail,
        isValidPhone,
        isValidURL,
        copyToClipboard,
        setLocalStorage,
        getLocalStorage,
        removeLocalStorage
    };
}
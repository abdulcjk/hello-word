// Contact Page Management

// Initialize Contact Page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('contact.html')) {
        initializeContactPage();
    }
});

function initializeContactPage() {
    // Setup contact form
    setupContactForm();
    
    // Setup FAQ functionality
    setupFAQ();
    
    // Setup contact methods
    setupContactMethods();
    
    // Load contact information
    loadContactInfo();
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleContactFormSubmission();
    });
    
    // Setup form validation
    setupFormValidation();
}

function setupFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    if (field.name === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Message length validation
    if (field.name === 'message' && value) {
        if (value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long';
        }
        if (value.length > 1000) {
            isValid = false;
            errorMessage = 'Message must be less than 1000 characters';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    // Insert error message after the field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function handleContactFormSubmission() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Validate all fields
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Get form data
    const formData = new FormData(form);
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };
    
    // Simulate form submission
    submitContactForm(contactData);
}

function submitContactForm(contactData) {
    // Show loading state
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Save to localStorage for demo purposes
        const existingContacts = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        existingContacts.push(contactData);
        localStorage.setItem('contactSubmissions', JSON.stringify(existingContacts));
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        
        // Log the submission (in a real app, this would be sent to a server)
        console.log('Contact form submission:', contactData);
        
    }, 1500);
}

function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                const isOpen = item.classList.contains('open');
                
                // Close all other FAQ items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('open');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = '0';
                        }
                    }
                });
                
                // Toggle current item
                if (isOpen) {
                    item.classList.remove('open');
                    answer.style.maxHeight = '0';
                } else {
                    item.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });
}

function setupContactMethods() {
    // Setup click handlers for contact methods
    const contactMethods = document.querySelectorAll('.contact-method');
    
    contactMethods.forEach(method => {
        method.addEventListener('click', function() {
            const type = this.dataset.type;
            const value = this.dataset.value;
            
            switch (type) {
                case 'email':
                    window.location.href = `mailto:${value}`;
                    break;
                case 'phone':
                    window.location.href = `tel:${value}`;
                    break;
                case 'address':
                    // Open in Google Maps
                    const encodedAddress = encodeURIComponent(value);
                    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
                    break;
            }
        });
    });
}

function loadContactInfo() {
    // Contact information data
    const contactInfo = {
        email: 'info@pnpshop.com',
        phone: '+1 (555) 123-4567',
        address: '123 Commerce Street, Business District, NY 10001',
        hours: {
            monday: '9:00 AM - 6:00 PM',
            tuesday: '9:00 AM - 6:00 PM',
            wednesday: '9:00 AM - 6:00 PM',
            thursday: '9:00 AM - 6:00 PM',
            friday: '9:00 AM - 6:00 PM',
            saturday: '10:00 AM - 4:00 PM',
            sunday: 'Closed'
        }
    };
    
    // Update contact information in the DOM
    updateContactInfoDisplay(contactInfo);
}

function updateContactInfoDisplay(contactInfo) {
    // Update email
    const emailElement = document.querySelector('[data-type="email"]');
    if (emailElement) {
        emailElement.dataset.value = contactInfo.email;
        const emailText = emailElement.querySelector('.contact-value');
        if (emailText) {
            emailText.textContent = contactInfo.email;
        }
    }
    
    // Update phone
    const phoneElement = document.querySelector('[data-type="phone"]');
    if (phoneElement) {
        phoneElement.dataset.value = contactInfo.phone;
        const phoneText = phoneElement.querySelector('.contact-value');
        if (phoneText) {
            phoneText.textContent = contactInfo.phone;
        }
    }
    
    // Update address
    const addressElement = document.querySelector('[data-type="address"]');
    if (addressElement) {
        addressElement.dataset.value = contactInfo.address;
        const addressText = addressElement.querySelector('.contact-value');
        if (addressText) {
            addressText.textContent = contactInfo.address;
        }
    }
    
    // Update business hours
    const hoursContainer = document.getElementById('businessHours');
    if (hoursContainer) {
        hoursContainer.innerHTML = Object.entries(contactInfo.hours).map(([day, hours]) => `
            <div class="hours-item">
                <span class="day">${capitalizeFirstLetter(day)}</span>
                <span class="time">${hours}</span>
            </div>
        `).join('');
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// FAQ data (can be moved to a separate data file)
const faqData = [
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All payments are processed securely through our payment partners."
    },
    {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 3-5 business days. Express shipping (1-2 business days) is available for an additional fee. International shipping times vary by location."
    },
    {
        question: "What is your return policy?",
        answer: "We offer a 30-day return policy for most items. Products must be in original condition with all packaging. Some items may have different return policies."
    },
    {
        question: "Do you ship internationally?",
        answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. Please check our shipping calculator for specific rates."
    },
    {
        question: "How can I track my order?",
        answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the order history section."
    },
    {
        question: "What if I receive a damaged item?",
        answer: "If you receive a damaged item, please contact us within 48 hours with photos of the damage. We'll arrange a replacement or refund at no additional cost."
    }
];

// Load FAQ data into the page
function loadFAQData() {
    const faqContainer = document.getElementById('faqSection');
    if (!faqContainer) return;
    
    faqContainer.innerHTML = faqData.map((faq, index) => `
        <div class="faq-item">
            <div class="faq-question">
                <h3>${faq.question}</h3>
                <svg class="faq-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
            </div>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        </div>
    `).join('');
    
    // Setup FAQ functionality after loading
    setupFAQ();
}

// Initialize FAQ data when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('contact.html')) {
        loadFAQData();
    }
});
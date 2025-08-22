// Authentication Management

// Demo users for testing
const demoUsers = [
    {
        id: 1,
        name: "Admin User",
        email: "admin@pnpshop.com",
        password: "admin123",
        isAdmin: true,
        createdAt: "2024-01-01"
    },
    {
        id: 2,
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        isAdmin: false,
        createdAt: "2024-01-15"
    }
];

// Initialize Authentication
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    // Load demo users if not exists
    if (!localStorage.getItem('pnpshop_users')) {
        localStorage.setItem('pnpshop_users', JSON.stringify(demoUsers));
    }
    
    // Setup auth buttons
    setupAuthButtons();
    
    // Setup auth forms
    setupAuthForms();
}

function setupAuthButtons() {
    // Login button
    document.addEventListener('click', function(event) {
        if (event.target.id === 'loginBtn') {
            openModal('loginModal');
        }
    });
    
    // Signup button
    document.addEventListener('click', function(event) {
        if (event.target.id === 'signupBtn') {
            openModal('signupModal');
        }
    });
}

function setupAuthForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Switch between login and signup
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    
    if (switchToSignup) {
        switchToSignup.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('loginModal');
            openModal('signupModal');
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal('signupModal');
            openModal('loginModal');
        });
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Attempt login
    const user = authenticateUser(email, password);
    
    if (user) {
        // Store user session
        currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        };
        
        localStorage.setItem('pnpshop_user', JSON.stringify(currentUser));
        
        // Close modal and update UI
        closeModal('loginModal');
        updateNavigation();
        
        // Clear form
        document.getElementById('loginForm').reset();
        
        showNotification(`Welcome back, ${user.name}!`, 'success');
        
        // Redirect admin users to admin panel
        if (user.isAdmin && window.location.pathname.includes('admin.html')) {
            showAdminDashboard();
        }
    } else {
        showNotification('Invalid email or password', 'error');
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    
    // Validation
    if (!name || !email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    
    // Check if user already exists
    if (userExists(email)) {
        showNotification('An account with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = createUser(name, email, password);
    
    if (newUser) {
        // Auto login
        currentUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            isAdmin: false
        };
        
        localStorage.setItem('pnpshop_user', JSON.stringify(currentUser));
        
        // Close modal and update UI
        closeModal('signupModal');
        updateNavigation();
        
        // Clear form
        document.getElementById('signupForm').reset();
        
        showNotification(`Welcome to PnPStore, ${name}!`, 'success');
    } else {
        showNotification('Error creating account. Please try again.', 'error');
    }
}

function authenticateUser(email, password) {
    try {
        const users = JSON.parse(localStorage.getItem('pnpshop_users') || '[]');
        return users.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
    } catch (error) {
        console.error('Error authenticating user:', error);
        return null;
    }
}

function userExists(email) {
    try {
        const users = JSON.parse(localStorage.getItem('pnpshop_users') || '[]');
        return users.some(user => user.email.toLowerCase() === email.toLowerCase());
    } catch (error) {
        console.error('Error checking user existence:', error);
        return false;
    }
}

function createUser(name, email, password) {
    try {
        const users = JSON.parse(localStorage.getItem('pnpshop_users') || '[]');
        
        const newUser = {
            id: Date.now(),
            name: name,
            email: email.toLowerCase(),
            password: password,
            isAdmin: false,
            createdAt: new Date().toISOString().split('T')[0]
        };
        
        users.push(newUser);
        localStorage.setItem('pnpshop_users', JSON.stringify(users));
        
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        return null;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Admin Authentication
function authenticateAdmin(email, password) {
    const user = authenticateUser(email, password);
    return user && user.isAdmin ? user : null;
}

function showAdminDashboard() {
    const loginScreen = document.getElementById('adminLoginScreen');
    const dashboard = document.getElementById('adminDashboard');
    
    if (loginScreen && dashboard) {
        loginScreen.style.display = 'none';
        dashboard.style.display = 'block';
        
        // Initialize admin dashboard
        initializeAdminDashboard();
    }
}

function initializeAdminDashboard() {
    // Load admin data
    loadAdminData();
    
    // Setup admin navigation
    setupAdminNavigation();
    
    // Load initial dashboard
    loadDashboardTab();
}

function loadAdminData() {
    // Load products, orders, users data
    // This will be handled by admin.js
}

function setupAdminNavigation() {
    const navButtons = document.querySelectorAll('.admin-nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            navButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding tab
            const tabName = this.dataset.tab;
            showAdminTab(tabName);
        });
    });
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
}

function showAdminTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
        
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
    // Update stats
    updateDashboardStats();
    
    // Load recent activity
    loadRecentActivity();
}

function updateDashboardStats() {
    const totalProducts = document.getElementById('totalProducts');
    const totalOrders = document.getElementById('totalOrders');
    const totalUsers = document.getElementById('totalUsers');
    const totalRevenue = document.getElementById('totalRevenue');
    
    if (totalProducts) {
        totalProducts.textContent = products.length;
    }
    
    if (totalOrders) {
        // Demo data - in real app this would come from orders
        totalOrders.textContent = '12';
    }
    
    if (totalUsers) {
        try {
            const users = JSON.parse(localStorage.getItem('pnpshop_users') || '[]');
            totalUsers.textContent = users.length;
        } catch (error) {
            totalUsers.textContent = '0';
        }
    }
    
    if (totalRevenue) {
        // Demo data - in real app this would be calculated from orders
        totalRevenue.textContent = '$2,450.00';
    }
}

function loadRecentActivity() {
    const activityList = document.getElementById('recentActivity');
    
    if (activityList) {
        // Demo activity data
        const activities = [
            {
                type: 'product',
                title: 'New product added',
                description: 'Wireless Gaming Mouse was added to inventory',
                time: '2 hours ago'
            },
            {
                type: 'order',
                title: 'New order received',
                description: 'Order #1234 for $89.99',
                time: '4 hours ago'
            },
            {
                type: 'user',
                title: 'New user registered',
                description: 'john@example.com joined PnPStore',
                time: '6 hours ago'
            }
        ];
        
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    ${getActivityIcon(activity.type)}
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
    }
}

function getActivityIcon(type) {
    const icons = {
        product: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>`,
        order: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11H1l8-8 8 8h-8v8z"></path>
        </svg>`,
        user: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
        </svg>`
    };
    
    return icons[type] || icons.product;
}

function loadProductsTab() {
    // This will be handled by admin.js
}

function loadOrdersTab() {
    // This will be handled by admin.js
}

function loadUsersTab() {
    // This will be handled by admin.js
}

// Password validation
function validatePassword(password) {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    const errors = [];
    
    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters long`);
    }
    
    if (!hasUpperCase) {
        errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!hasLowerCase) {
        errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!hasNumbers) {
        errors.push('Password must contain at least one number');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Password strength indicator
function updatePasswordStrength(password) {
    const strengthIndicator = document.getElementById('passwordStrength');
    if (!strengthIndicator) return;
    
    const validation = validatePassword(password);
    const strength = calculatePasswordStrength(password);
    
    let strengthText = '';
    let strengthClass = '';
    
    if (strength < 2) {
        strengthText = 'Weak';
        strengthClass = 'weak';
    } else if (strength < 4) {
        strengthText = 'Fair';
        strengthClass = 'fair';
    } else if (strength < 6) {
        strengthText = 'Good';
        strengthClass = 'good';
    } else {
        strengthText = 'Strong';
        strengthClass = 'strong';
    }
    
    strengthIndicator.textContent = strengthText;
    strengthIndicator.className = `password-strength ${strengthClass}`;
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
}

// Session management
function checkSession() {
    const savedUser = localStorage.getItem('pnpshop_user');
    
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            updateNavigation();
            
            // If on admin page, check if user is admin
            if (window.location.pathname.includes('admin.html')) {
                if (currentUser.isAdmin) {
                    showAdminDashboard();
                } else {
                    // Redirect non-admin users
                    window.location.href = 'index.html';
                }
            }
        } catch (error) {
            console.error('Error parsing user session:', error);
            localStorage.removeItem('pnpshop_user');
        }
    } else if (window.location.pathname.includes('admin.html')) {
        // Show login screen for admin page
        showAdminLoginScreen();
    }
}

function showAdminLoginScreen() {
    const loginScreen = document.getElementById('adminLoginScreen');
    const dashboard = document.getElementById('adminDashboard');
    
    if (loginScreen && dashboard) {
        loginScreen.style.display = 'flex';
        dashboard.style.display = 'none';
    }
}

// Auto-logout after inactivity
function setupAutoLogout() {
    const timeout = 30 * 60 * 1000; // 30 minutes
    let logoutTimer;
    
    function resetTimer() {
        clearTimeout(logoutTimer);
        logoutTimer = setTimeout(() => {
            if (currentUser) {
                logout();
                showNotification('You have been logged out due to inactivity', 'warning');
            }
        }, timeout);
    }
    
    // Reset timer on user activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetTimer, true);
    });
    
    resetTimer();
}

// Initialize session check
checkSession();

// Setup auto-logout
setupAutoLogout();

// Global functions
window.authenticateAdmin = authenticateAdmin;
window.showAdminDashboard = showAdminDashboard;
window.checkSession = checkSession;
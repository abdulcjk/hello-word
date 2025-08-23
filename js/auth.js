// Authentication Management
let currentUser = JSON.parse(localStorage.getItem('pnp_current_user')) || null;
let users = JSON.parse(localStorage.getItem('pnp_users')) || [];

// Default admin user
if (users.length === 0) {
    users.push({
        id: 1,
        email: 'admin@pnpstore.com',
        password: 'admin123', // In production, this should be hashed
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('pnp_users', JSON.stringify(users));
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    updateAuthDisplay();
    redirectIfNeeded();
});

// Update authentication display in header
function updateAuthDisplay() {
    const loginLink = document.getElementById('login-link');
    const signupLink = document.getElementById('signup-link');
    const userWelcome = document.getElementById('user-welcome');
    const username = document.getElementById('username');
    
    if (currentUser) {
        // User is logged in
        if (loginLink) loginLink.style.display = 'none';
        if (signupLink) signupLink.style.display = 'none';
        if (userWelcome) {
            userWelcome.style.display = 'flex';
            if (username) {
                username.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
            }
        }
    } else {
        // User is not logged in
        if (loginLink) loginLink.style.display = 'inline-block';
        if (signupLink) signupLink.style.display = 'inline-block';
        if (userWelcome) userWelcome.style.display = 'none';
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const email = formData.get('email').trim().toLowerCase();
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Validate input
    if (!email || !password) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Successful login
        currentUser = user;
        localStorage.setItem('pnp_current_user', JSON.stringify(currentUser));
        
        if (remember) {
            localStorage.setItem('pnp_remember_user', 'true');
        }
        
        showAlert(`Welcome back, ${user.firstName}!`, 'success');
        
        // Redirect based on user role
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);
    } else {
        showAlert('Invalid email or password', 'error');
    }
}

// Handle signup form submission
function handleSignup(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const firstName = formData.get('firstName').trim();
    const lastName = formData.get('lastName').trim();
    const email = formData.get('email').trim().toLowerCase();
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    const phone = formData.get('phone');
    const terms = formData.get('terms');
    const newsletter = formData.get('newsletter');
    
    // Validate input
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }
    
    if (!terms) {
        showAlert('Please accept the Terms of Service', 'error');
        return;
    }
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
        showAlert('An account with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        email: email,
        password: password, // In production, this should be hashed
        firstName: firstName,
        lastName: lastName,
        phone: phone || '',
        role: 'customer',
        newsletter: !!newsletter,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('pnp_users', JSON.stringify(users));
    
    // Auto-login the new user
    currentUser = newUser;
    localStorage.setItem('pnp_current_user', JSON.stringify(currentUser));
    
    showAlert(`Welcome to PnPStore, ${firstName}!`, 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Logout function
function logout() {
    currentUser = null;
    localStorage.removeItem('pnp_current_user');
    localStorage.removeItem('pnp_remember_user');
    
    showAlert('You have been logged out', 'info');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Quick admin login
function quickAdminLogin() {
    const adminUser = users.find(u => u.role === 'admin');
    if (adminUser) {
        currentUser = adminUser;
        localStorage.setItem('pnp_current_user', JSON.stringify(currentUser));
        
        showAlert('Admin logged in successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
    }
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Check if user has admin role
function isAdmin() {
    return currentUser && currentUser.role === 'admin';
}

// Redirect if authentication is required
function redirectIfNeeded() {
    const currentPath = window.location.pathname;
    
    // Protect admin pages
    if (currentPath.includes('admin.html')) {
        if (!isAuthenticated()) {
            showAlert('Please log in to access the admin panel', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }
        
        if (!isAdmin()) {
            showAlert('Access denied. Admin privileges required.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }
    }
    
    // Redirect logged-in users away from auth pages
    if (isAuthenticated() && (currentPath.includes('login.html') || currentPath.includes('signup.html'))) {
        window.location.href = 'index.html';
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Update user profile
function updateUserProfile(updates) {
    if (!currentUser) return false;
    
    // Update current user object
    Object.assign(currentUser, updates);
    
    // Update in users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('pnp_users', JSON.stringify(users));
        localStorage.setItem('pnp_current_user', JSON.stringify(currentUser));
        return true;
    }
    
    return false;
}

// Change password
function changePassword(currentPassword, newPassword) {
    if (!currentUser) return false;
    
    if (currentUser.password !== currentPassword) {
        showAlert('Current password is incorrect', 'error');
        return false;
    }
    
    if (newPassword.length < 6) {
        showAlert('New password must be at least 6 characters long', 'error');
        return false;
    }
    
    currentUser.password = newPassword;
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('pnp_users', JSON.stringify(users));
        localStorage.setItem('pnp_current_user', JSON.stringify(currentUser));
        
        showAlert('Password changed successfully', 'success');
        return true;
    }
    
    return false;
}

// Reset password (demo functionality)
function resetPassword(email) {
    const user = users.find(u => u.email === email.toLowerCase());
    if (user) {
        // In a real app, this would send an email
        showAlert('Password reset instructions would be sent to your email (demo mode)', 'info');
        return true;
    } else {
        showAlert('No account found with this email address', 'error');
        return false;
    }
}

// Delete account
function deleteAccount(password) {
    if (!currentUser) return false;
    
    if (currentUser.password !== password) {
        showAlert('Password is incorrect', 'error');
        return false;
    }
    
    if (currentUser.role === 'admin') {
        showAlert('Admin account cannot be deleted', 'error');
        return false;
    }
    
    // Remove user from users array
    users = users.filter(u => u.id !== currentUser.id);
    localStorage.setItem('pnp_users', JSON.stringify(users));
    
    // Log out the user
    logout();
    
    showAlert('Account deleted successfully', 'info');
    return true;
}

// Session management
function extendSession() {
    if (currentUser) {
        localStorage.setItem('pnp_current_user', JSON.stringify(currentUser));
    }
}

// Auto-logout after inactivity (30 minutes)
let inactivityTimer;
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    if (currentUser) {
        inactivityTimer = setTimeout(() => {
            showAlert('Session expired due to inactivity', 'info');
            logout();
        }, 30 * 60 * 1000); // 30 minutes
    }
}

// Track user activity
document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);

// Initialize inactivity timer
if (currentUser) {
    resetInactivityTimer();
}

// Social login placeholders (demo functionality)
function loginWithGoogle() {
    showAlert('Google login would be implemented here in a real application', 'info');
}

function loginWithFacebook() {
    showAlert('Facebook login would be implemented here in a real application', 'info');
}

// Two-factor authentication placeholder
function enableTwoFactor() {
    if (!currentUser) return;
    
    showAlert('Two-factor authentication would be set up here in a real application', 'info');
}

// Get user preferences
function getUserPreferences() {
    if (!currentUser) return {};
    
    return {
        newsletter: currentUser.newsletter || false,
        notifications: currentUser.notifications || true,
        theme: currentUser.theme || 'light',
        language: currentUser.language || 'en'
    };
}

// Update user preferences
function updateUserPreferences(preferences) {
    if (!currentUser) return false;
    
    Object.assign(currentUser, preferences);
    
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex] = currentUser;
        localStorage.setItem('pnp_users', JSON.stringify(users));
        localStorage.setItem('pnp_current_user', JSON.stringify(currentUser));
        return true;
    }
    
    return false;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        currentUser,
        users,
        isAuthenticated,
        isAdmin,
        getCurrentUser,
        handleLogin,
        handleSignup,
        logout,
        updateUserProfile,
        changePassword,
        resetPassword,
        deleteAccount
    };
}
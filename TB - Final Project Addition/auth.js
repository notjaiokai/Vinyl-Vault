/**
 * Authentication Utility Functions for Vinyl Vault
 * Person 4: Login & Authentication JavaScript
 */

// ==================== CONSTANTS & CONFIG ====================
const STORAGE_KEY = 'vinylVaultAuth';
const DEMO_USERS = [
    { email: 'demo@vinylvault.com', password: 'password123', name: 'Demo User' },
    { email: 'admin@vinylvault.com', password: 'admin123', name: 'Admin User' }
];

// ==================== STORAGE FUNCTIONS ====================

/**
 * Get current user from storage
 * @returns {Object|null} User object or null
 */
function getCurrentUser() {
    try {
        const userData = localStorage.getItem(STORAGE_KEY) || 
                        sessionStorage.getItem(STORAGE_KEY);
        
        if (!userData) return null;
        
        const user = JSON.parse(userData);
        
        // Check if session is still valid (24 hours)
        if (user.loginTime) {
            const loginTime = new Date(user.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
            
            if (hoursDiff > 24) {
                logout();
                return null;
            }
        }
        
        return user;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

/**
 * Check if user is logged in
 * @returns {boolean} True if logged in
 */
function isLoggedIn() {
    const user = getCurrentUser();
    return user !== null && user.isLoggedIn === true;
}

/**
 * Save user to storage
 * @param {Object} user - User object
 * @param {boolean} rememberMe - Whether to use localStorage
 */
function saveUser(user, rememberMe = false) {
    try {
        user.loginTime = new Date().toISOString();
        user.isLoggedIn = true;
        
        const userString = JSON.stringify(user);
        
        // Clear both storages first
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
        
        // Save to appropriate storage
        if (rememberMe) {
            localStorage.setItem(STORAGE_KEY, userString);
        } else {
            sessionStorage.setItem(STORAGE_KEY, userString);
        }
        
        return true;
    } catch (error) {
        console.error('Error saving user:', error);
        return false;
    }
}

/**
 * Logout user
 */
function logout() {
    try {
        // Clear storage
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
        
        // Update UI
        updateAuthUI();
        
        // Redirect to login page if not already there
        if (!window.location.pathname.includes('login.html') && 
            !window.location.pathname.includes('index.html')) {
            window.location.href = 'login.html';
        }
        
        // Show logout message
        showToast('Successfully logged out', 'success');
        
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Validate password
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
function validatePassword(password) {
    const errors = [];
    
    if (!password) {
        errors.push('Password is required');
    } else {
        if (password.length < 6) {
            errors.push('Password must be at least 6 characters');
        }
        if (password.length > 50) {
            errors.push('Password cannot exceed 50 characters');
        }
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// ==================== AUTHENTICATION FUNCTIONS ====================

/**
 * Authenticate user credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Authentication result
 */
function authenticate(email, password) {
    // Trim inputs
    email = email.trim();
    password = password.trim();
    
    // Validate inputs
    if (!email || !password) {
        return {
            success: false,
            message: 'Email and password are required'
        };
    }
    
    if (!isValidEmail(email)) {
        return {
            success: false,
            message: 'Please enter a valid email address'
        };
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        return {
            success: false,
            message: passwordValidation.errors[0]
        };
    }
    
    // Check demo credentials
    const demoUser = DEMO_USERS.find(user => 
        user.email === email && user.password === password
    );
    
    if (demoUser) {
        return {
            success: true,
            user: {
                email: demoUser.email,
                name: demoUser.name,
                role: email === 'admin@vinylvault.com' ? 'admin' : 'user'
            }
        };
    }
    
    // In a real app, this would check against a database
    // For demo purposes, accept any valid email/password combo
    return {
        success: true,
        user: {
            email: email,
            name: email.split('@')[0],
            role: 'user'
        }
    };
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} rememberMe - Remember login
 * @returns {Promise} Login result
 */
async function login(email, password, rememberMe = false) {
    return new Promise((resolve) => {
        // Simulate API delay
        setTimeout(() => {
            const authResult = authenticate(email, password);
            
            if (authResult.success) {
                saveUser(authResult.user, rememberMe);
                updateAuthUI();
                
                resolve({
                    success: true,
                    user: authResult.user
                });
            } else {
                resolve({
                    success: false,
                    message: authResult.message
                });
            }
        }, 800); // Simulate network delay
    });
}

// ==================== UI FUNCTIONS ====================

/**
 * Update UI based on authentication state
 */
function updateAuthUI() {
    const isLoggedInUser = isLoggedIn();
    const user = getCurrentUser();
    
    // Update navbar
    const loginItem = document.querySelector('.nav-item a[href="login.html"]')?.parentElement;
    const registerItem = document.querySelector('.nav-item a[href="register.html"]')?.parentElement;
    const logoutItem = document.getElementById('logout-item');
    const logoutLink = document.getElementById('logout-link');
    
    if (loginItem) {
        loginItem.classList.toggle('d-none', isLoggedInUser);
    }
    
    if (registerItem) {
        registerItem.classList.toggle('d-none', isLoggedInUser);
    }
    
    if (logoutItem) {
        logoutItem.classList.toggle('d-none', !isLoggedInUser);
        
        if (logoutLink) {
            logoutLink.onclick = function(e) {
                e.preventDefault();
                logout();
            };
        }
    }
    
    // Update user greeting if element exists
    const userGreeting = document.getElementById('user-greeting');
    if (userGreeting && user) {
        userGreeting.textContent = `Welcome, ${user.name}!`;
        userGreeting.classList.remove('d-none');
    }
    
    // Update page title if on products page
    if (isLoggedInUser && window.location.pathname.includes('products.html')) {
        const pageTitle = document.querySelector('h1');
        if (pageTitle && user) {
            pageTitle.innerHTML = `Your Collection <small class="text-muted">Welcome ${user.name}!</small>`;
        }
    }
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, info, warning)
 */
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.custom-toast');
    existingToasts.forEach(toast => toast.remove());
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `custom-toast alert alert-${type} alert-dismissible fade show position-fixed`;
    toast.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    const icon = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    }[type] || 'fa-info-circle';
    
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${icon} fa-2x me-3"></i>
            <div class="flex-grow-1">
                <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                <div class="mt-1">${message}</div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

/**
 * Protect page - redirect to login if not authenticated
 * @param {Array} protectedPages - Array of page names to protect
 */
function protectPage(protectedPages = ['products.html', 'dashboard.html']) {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !isLoggedIn()) {
        // Store intended destination
        sessionStorage.setItem('redirectAfterLogin', currentPage);
        
        // Redirect to login
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

// ==================== INITIALIZATION ====================

/**
 * Initialize authentication system
 */
function initAuth() {
    // Update UI on page load
    updateAuthUI();
    
    // Protect pages
    protectPage();
    
    // Add logout handler if element exists
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.onclick = function(e) {
            e.preventDefault();
            logout();
        };
    }
    
    // Check for redirect parameter
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    if (redirect && isLoggedIn()) {
        window.location.href = redirect;
    }
    
    // Auto-logout after 30 minutes of inactivity
    let inactivityTimer;
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        if (isLoggedIn()) {
            inactivityTimer = setTimeout(() => {
                logout();
                showToast('Logged out due to inactivity', 'warning');
            }, 30 * 60 * 1000); // 30 minutes
        }
    }
    
    // Reset timer on user activity
    ['mousemove', 'keypress', 'click', 'scroll'].forEach(event => {
        document.addEventListener(event, resetInactivityTimer);
    });
    
    resetInactivityTimer();
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentUser,
        isLoggedIn,
        saveUser,
        logout,
        isValidEmail,
        validatePassword,
        authenticate,
        login,
        updateAuthUI,
        showToast,
        protectPage,
        initAuth
    };
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}
// ===================================
// STORAGE & CONSTANTS
// ===================================

const STORAGE_KEY = 'vinylVaultAuth';
const USERS_KEY = 'vinylVaultUsers';

// Demo users for testing
const DEMO_USERS = [
    { email: 'demo@vinylvault.com', password: 'password123', name: 'Demo User' },
    { email: 'admin@vinylvault.com', password: 'admin123', name: 'Admin User' }
];

// ===================================
// UTILITY FUNCTIONS
// ===================================

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.style.animation = 'toastSlideOut 0.3s ease-out';
        setTimeout(() => {
            toast.className = 'toast';
            toast.style.animation = '';
        }, 300);
    }, 3000);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    return password.length >= 6;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
    const input = document.getElementById(elementId.replace('Error', ''));
    if (input) {
        input.classList.add('error');
    }
}

function clearError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = '';
    }
    const input = document.getElementById(elementId.replace('Error', ''));
    if (input) {
        input.classList.remove('error');
    }
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');
    const inputs = document.querySelectorAll('input.error');
    inputs.forEach(input => input.classList.remove('error'));
}

// ===================================
// USER MANAGEMENT
// ===================================

function getAllUsers() {
    try {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [...DEMO_USERS];
    } catch (error) {
        console.error('Error getting users:', error);
        return [...DEMO_USERS];
    }
}

function saveUser(userData) {
    try {
        const users = getAllUsers();

        // Check if user already exists
        const existingUserIndex = users.findIndex(u => u.email === userData.email);

        if (existingUserIndex !== -1) {
            // Update existing user
            users[existingUserIndex] = { ...users[existingUserIndex], ...userData };
        } else {
            // Add new user
            users.push(userData);
        }

        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        return true;
    } catch (error) {
        console.error('Error saving user:', error);
        return false;
    }
}

function findUser(email) {
    const users = getAllUsers();
    return users.find(u => u.email === email);
}

function loginUser(email, password, rememberMe = false) {
    const user = findUser(email);

    if (!user || user.password !== password) {
        return { success: false, message: 'Invalid email or password' };
    }

    const authData = {
        email: user.email,
        name: user.name,
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
        favorites: user.favorites || [],
        purchases: user.purchases || 0
    };

    // Save to localStorage or sessionStorage based on "Remember me"
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEY, JSON.stringify(authData));

    return { success: true, user: authData };
}

// ===================================
// LOGIN PAGE
// ===================================

function initLogin() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
        });
    }

    // Clear errors on input
    emailInput.addEventListener('input', () => clearError('emailError'));
    passwordInput.addEventListener('input', () => clearError('passwordError'));

    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllErrors();

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = rememberMeCheckbox.checked;

        // Validation
        let hasError = false;

        if (!email) {
            showError('emailError', 'Email is required');
            hasError = true;
        } else if (!validateEmail(email)) {
            showError('emailError', 'Please enter a valid email address');
            hasError = true;
        }

        if (!password) {
            showError('passwordError', 'Password is required');
            hasError = true;
        }

        if (hasError) return;

        // Show loading state
        const loginBtn = document.getElementById('loginBtn');
        const originalContent = loginBtn.innerHTML;
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        loginBtn.innerHTML = '';

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Attempt login
        const result = loginUser(email, password, rememberMe);

        if (result.success) {
            showToast(`Welcome back, ${result.user.name}!`, 'success');

            // Redirect to home page
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalContent;

            showError('passwordError', result.message);
            showToast(result.message, 'error');
        }
    });
}

// ===================================
// SIGNUP PAGE
// ===================================

function initSignup() {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const termsCheckbox = document.getElementById('termsAgree');

    // Toggle password visibility
    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
        });
    }

    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', () => {
            const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
            confirmPasswordInput.type = type;
        });
    }

    // Clear errors on input
    nameInput.addEventListener('input', () => clearError('nameError'));
    emailInput.addEventListener('input', () => clearError('emailError'));
    passwordInput.addEventListener('input', () => clearError('passwordError'));
    confirmPasswordInput.addEventListener('input', () => clearError('confirmPasswordError'));

    // Handle form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllErrors();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const termsAgreed = termsCheckbox.checked;

        // Validation
        let hasError = false;

        if (!name) {
            showError('nameError', 'Name is required');
            hasError = true;
        } else if (name.length < 2) {
            showError('nameError', 'Name must be at least 2 characters');
            hasError = true;
        }

        if (!email) {
            showError('emailError', 'Email is required');
            hasError = true;
        } else if (!validateEmail(email)) {
            showError('emailError', 'Please enter a valid email address');
            hasError = true;
        } else if (findUser(email)) {
            showError('emailError', 'This email is already registered');
            hasError = true;
        }

        if (!password) {
            showError('passwordError', 'Password is required');
            hasError = true;
        } else if (!validatePassword(password)) {
            showError('passwordError', 'Password must be at least 6 characters');
            hasError = true;
        }

        if (!confirmPassword) {
            showError('confirmPasswordError', 'Please confirm your password');
            hasError = true;
        } else if (password !== confirmPassword) {
            showError('confirmPasswordError', 'Passwords do not match');
            hasError = true;
        }

        if (!termsAgreed) {
            showToast('Please agree to the Terms of Service', 'error');
            hasError = true;
        }

        if (hasError) return;

        // Show loading state
        const signupBtn = document.getElementById('signupBtn');
        const originalContent = signupBtn.innerHTML;
        signupBtn.classList.add('loading');
        signupBtn.disabled = true;
        signupBtn.innerHTML = '';

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create user account
        const newUser = {
            email: email,
            password: password,
            name: name,
            favorites: [],
            purchases: 0,
            createdAt: new Date().toISOString()
        };

        const saved = saveUser(newUser);

        if (saved) {
            showToast('Account created successfully! Redirecting...', 'success');

            // Auto login and redirect
            const authData = {
                email: newUser.email,
                name: newUser.name,
                isLoggedIn: true,
                loginTime: new Date().toISOString(),
                favorites: [],
                purchases: 0
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            signupBtn.classList.remove('loading');
            signupBtn.disabled = false;
            signupBtn.innerHTML = originalContent;

            showToast('Failed to create account. Please try again.', 'error');
        }
    });
}

// ===================================
// INITIALIZE
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Check which page we're on and initialize accordingly
    if (document.getElementById('loginForm')) {
        initLogin();
    } else if (document.getElementById('signupForm')) {
        initSignup();
    }
});

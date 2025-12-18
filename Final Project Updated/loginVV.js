// ---------- Auth goodies: login magic, storage tricks, and friendly helpers ----------
const STORAGE_KEY = 'vinylVaultAuth';
const DEMO_USERS = [
    { email: 'demo@vinylvault.com', password: 'password123', name: 'Demo User' },
    { email: 'admin@vinylvault.com', password: 'admin123', name: 'Admin User' }
];

function getCurrentUser() {
    try {
        const userData = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
        if (!userData) return null;
        const user = JSON.parse(userData);
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

function isLoggedIn() {
    const user = getCurrentUser();
    return user !== null && user.isLoggedIn === true;
}

function saveUser(user, rememberMe = false) {
    try {
        user.loginTime = new Date().toISOString();
        user.isLoggedIn = true;
        const userString = JSON.stringify(user);
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
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

function showToast(message, type = 'info') {
    const existingToasts = document.querySelectorAll('.custom-toast');
    existingToasts.forEach(toast => toast.remove());
    const toast = document.createElement('div');
    toast.className = `custom-toast alert alert-${type} alert-dismissible fade show position-fixed`;
    toast.style.cssText = `top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);`;
    const icon = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' }[type] || 'fa-info-circle';
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas ${icon} fa-2x me-3"></i>
            <div class="flex-grow-1">
                <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                <div class="mt-1">${message}</div>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>`;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 5000);
}

function logout() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);
        updateAuthUI();
        if (!window.location.pathname.includes('loginVV.html.html') && !window.location.pathname.includes('index.html')) {
            window.location.href = 'loginVV.html.html';
        }
        showToast('Successfully logged out', 'success');
    } catch (error) {
        console.error('Error during logout:', error);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(email || '').trim());
}

function validatePassword(password) {
    const errors = [];
    if (!password) {
        errors.push('Password is required');
    } else {
        if (password.length < 6) errors.push('Password must be at least 6 characters');
        if (password.length > 50) errors.push('Password cannot exceed 50 characters');
    }
    return { isValid: errors.length === 0, errors };
}

function authenticate(email, password) {
    email = String(email || '').trim();
    password = String(password || '').trim();
    if (!email || !password) return { success: false, message: 'Email and password are required' };
    if (!isValidEmail(email)) return { success: false, message: 'Please enter a valid email address' };
    const pwd = validatePassword(password);
    if (!pwd.isValid) return { success: false, message: pwd.errors[0] };
    const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (demoUser) {
        return { success: true, user: { email: demoUser.email, name: demoUser.name, role: email === 'admin@vinylvault.com' ? 'admin' : 'user' } };
    }
    return { success: true, user: { email, name: email.split('@')[0], role: 'user' } };
}

async function login(email, password, rememberMe = false) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const authResult = authenticate(email, password);
            if (authResult.success) {
                saveUser(authResult.user, rememberMe);
                updateAuthUI();
                resolve({ success: true, user: authResult.user });
            } else {
                resolve({ success: false, message: authResult.message });
            }
        }, 800);
    });
}

function updateAuthUI() {
    const loggedIn = isLoggedIn();
    const user = getCurrentUser();
    const loginItem = document.querySelector('.nav-item a[href="loginVV.html.html"]')?.parentElement;
    const registerItem = document.querySelector('.nav-item a[href="register.html"]')?.parentElement;
    const logoutItem = document.getElementById('logout-item');
    const logoutLink = document.getElementById('logout-link');
    if (loginItem) loginItem.classList.toggle('d-none', loggedIn);
    if (registerItem) registerItem.classList.toggle('d-none', loggedIn);
    if (logoutItem) {
        logoutItem.classList.toggle('d-none', !loggedIn);
        if (logoutLink) {
            logoutLink.onclick = function(e) { e.preventDefault(); logout(); };
        }
    }
    const userGreeting = document.getElementById('user-greeting');
    if (userGreeting && user) {
        userGreeting.textContent = `Welcome, ${user.name}!`;
        userGreeting.classList.remove('d-none');
    }
    if (loggedIn && window.location.pathname.includes('products.html')) {
        const pageTitle = document.querySelector('h1');
        if (pageTitle && user) {
            pageTitle.innerHTML = `Your Collection <small class="text-muted">Welcome ${user.name}!</small>`;
        }
    }
}

function protectPage(protectedPages = ['dashboard.html']) {
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage) && !isLoggedIn()) {
        sessionStorage.setItem('redirectAfterLogin', currentPage);
        window.location.href = 'loginVV.html.html';
        return false;
    }
    return true;
}

function initAuth() {
    updateAuthUI();
    protectPage();
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.onclick = function(e) { e.preventDefault(); logout(); };
    }
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');
    if (redirect && isLoggedIn()) {
        window.location.href = redirect;
    }
    let inactivityTimer;
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        if (isLoggedIn()) {
            inactivityTimer = setTimeout(() => {
                logout();
                showToast('Logged out due to inactivity', 'warning');
            }, 30 * 60 * 1000);
        }
    }
    ['mousemove', 'keypress', 'click', 'scroll'].forEach(event => {
        document.addEventListener(event, resetInactivityTimer);
    });
    resetInactivityTimer();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}

// ---------- Login page vibes: validation, buttons, and sweet UX ----------

const elements = {
    form: document.getElementById('login-form'),
    emailInput: document.getElementById('login-email'),
    passwordInput: document.getElementById('login-password'),
    rememberMe: document.getElementById('remember-me'),
    togglePasswordBtn: document.getElementById('toggle-password'),
    loginBtn: document.getElementById('login-btn'),
    errorAlert: document.getElementById('login-error-alert'),
    errorMessage: document.getElementById('error-message'),
    sendResetLinkBtn: document.getElementById('send-reset-link')
};

// ---------- Shared helpers: keeping things DRY and tidy ----------

function showError(message) {
    if (!elements.errorAlert || !elements.errorMessage) return;
    elements.errorMessage.textContent = message;
    elements.errorAlert.classList.remove('d-none');
    elements.errorAlert.classList.add('show');
    setTimeout(hideError, 5000);
}

function hideError() {
    if (!elements.errorAlert) return;
    elements.errorAlert.classList.remove('show');
    setTimeout(() => elements.errorAlert.classList.add('d-none'), 300);
}

function validateEmail() {
    const email = elements.emailInput?.value.trim() || '';
    const errorElement = document.getElementById('email-error');
    
    if (!email) {
        elements.emailInput?.classList.add('is-invalid');
        elements.emailInput?.classList.remove('is-valid');
        if (errorElement) errorElement.textContent = 'Email address is required';
        return { isValid: false, message: 'Email is required' };
    }
    // ---------- Email rules: checking formats like a pro ----------
    const emailOk = typeof window.isValidEmail === 'function' ? window.isValidEmail(email) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
        elements.emailInput?.classList.add('is-invalid');
        elements.emailInput?.classList.remove('is-valid');
        if (errorElement) errorElement.textContent = 'Please enter a valid email address';
        return { isValid: false, message: 'Invalid email format' };
    }
    elements.emailInput?.classList.remove('is-invalid');
    elements.emailInput?.classList.add('is-valid');
    return { isValid: true, message: '' };
}

function validatePassword() {
    const password = elements.passwordInput?.value || '';
    const errorElement = document.getElementById('password-error');
    
    // ---------- Password rules: short, long, and just right ----------
    const result = typeof window.validatePassword === 'function' 
        ? window.validatePassword(password)
        : { isValid: !!password && password.length >= 6 && password.length <= 50, errors: [] };

    if (!result.isValid) {
        elements.passwordInput?.classList.add('is-invalid');
        elements.passwordInput?.classList.remove('is-valid');
        if (errorElement) errorElement.textContent = (result.errors && result.errors[0]) || 'Invalid password';
        return { isValid: false, message: (result.errors && result.errors[0]) || 'Invalid password' };
    }
    elements.passwordInput?.classList.remove('is-invalid');
    elements.passwordInput?.classList.add('is-valid');
    return { isValid: true, message: '' };
}

function validateForm() {
    const emailValidation = validateEmail();
    const passwordValidation = validatePassword();
    return {
        isValid: emailValidation.isValid && passwordValidation.isValid,
        email: emailValidation,
        password: passwordValidation
    };
}

function updateButtonState(isLoading = false, isSuccess = false) {
    const btn = elements.loginBtn;
    if (!btn) return;
    const defaultContent = `<i class="fas fa-sign-in-alt me-2"></i>Log In`;
    if (isLoading) {
        btn.disabled = true;
        btn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
            Logging in...
        `;
        return;
    }
    if (isSuccess) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fas fa-check me-2"></i>Login Successful!`;
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-success');
        return;
    }
    btn.disabled = false;
    btn.innerHTML = defaultContent;
    btn.classList.remove('btn-success');
    btn.classList.add('btn-primary');
}

// ---------- Logging in: passing the baton to our auth engine ----------

async function handleFormSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!elements.form) return;
    elements.form.classList.remove('was-validated');
    hideError();

    const validation = validateForm();
    if (!validation.isValid) {
        elements.form.classList.add('was-validated');
        if (!validation.email.isValid) {
            elements.emailInput?.focus();
        } else if (!validation.password.isValid) {
            elements.passwordInput?.focus();
        }
        return;
    }

    const email = elements.emailInput?.value.trim() || '';
    const password = elements.passwordInput?.value || '';
    const rememberMe = !!elements.rememberMe?.checked;

    updateButtonState(true);
    try {
        const loginResult = await login(email, password, rememberMe);
        if (loginResult.success) {
            updateButtonState(false, true);
            showToast(`Welcome back, ${loginResult.user.name}!`, 'success');
            
            // ---------- Home welcome: cue the confetti banner ----------
            localStorage.setItem('showWelcomeAlert', 'true');
            if (typeof window.updateAuthUI === 'function') {
                window.updateAuthUI();
            }
            
            const redirectTo = sessionStorage.getItem('redirectAfterLogin') || 'index.html';
            sessionStorage.removeItem('redirectAfterLogin');
            setTimeout(() => { window.location.href = redirectTo; }, 1500);
        } else {
            updateButtonState(false);
            showError(loginResult.message || 'Invalid email or password. Please try again.');
            if (elements.passwordInput) {
                elements.passwordInput.value = '';
                elements.passwordInput.focus();
            }
        }
    } catch (error) {
        updateButtonState(false);
        showError('Network error. Please check your connection and try again.');
        console.error('Login error:', error);
    }
}

function togglePasswordVisibility() {
    if (!elements.passwordInput || !elements.togglePasswordBtn) return;
    const type = elements.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    elements.passwordInput.setAttribute('type', type);
    const icon = elements.togglePasswordBtn.querySelector('i');
    if (icon) icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}

function handleForgotPassword() {
    const resetEmailInput = document.getElementById('reset-email');
    const resetEmail = resetEmailInput ? resetEmailInput.value.trim() : '';
    if (!resetEmail) {
        showToast('Please enter your email address', 'warning');
        return;
    }
    if (!isValidEmail(resetEmail)) {
        showToast('Please enter a valid email address', 'warning');
        return;
    }
    const btn = elements.sendResetLinkBtn;
    if (!btn) return;
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>Sending...`;

    setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        const modalEl = document.getElementById('forgotPasswordModal');
        if (modalEl && window.bootstrap?.Modal) {
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
            modal.hide();
        }
        showToast('If this email exists, we sent reset instructions.', 'success');
    }, 1200);
}

function initLogin() {
    if (!elements.form) return;
    elements.form.addEventListener('submit', handleFormSubmit);
    elements.togglePasswordBtn?.addEventListener('click', togglePasswordVisibility);
    elements.sendResetLinkBtn?.addEventListener('click', handleForgotPassword);
}

document.addEventListener('DOMContentLoaded', initLogin);

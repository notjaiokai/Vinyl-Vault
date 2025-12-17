
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


  @returns {Object} 
 
function validateEmail() {
    const email = elements.emailInput.value.trim();
    const errorElement = document.getElementById('email-error');
    
    if (!email) {
        elements.emailInput.classList.add('is-invalid');
        errorElement.textContent = 'Email address is required';
        return { isValid: false, message: 'Email is required' };
    }
    
    if (!isValidEmail(email)) {
        elements.emailInput.classList.add('is-invalid');
        errorElement.textContent = 'Please enter a valid email address';
        return { isValid: false, message: 'Invalid email format' };
    }
    
    elements.emailInput.classList.remove('is-invalid');
    elements.emailInput.classList.add('is-valid');
    return { isValid: true, message: '' };
}

/** 
 * @returns {Object} Validation result
 */
function validatePassword() {
    const password = elements.passwordInput.value;
    const errorElement = document.getElementById('password-error');
    
    if (!password) {
        elements.passwordInput.classList.add('is-invalid');
        errorElement.textContent = 'Password is required';
        return { isValid: false, message: 'Password is required' };
    }
    
    if (password.length < 6) {
        elements.passwordInput.classList.add('is-invalid');
        errorElement.textContent = 'Password must be at least 6 characters';
        return { isValid: false, message: 'Password too short' };
    }
    
    if (password.length > 50) {
        elements.passwordInput.classList.add('is-invalid');
        errorElement.textContent = 'Password cannot exceed 50 characters';
        return { isValid: false, message: 'Password too long' };
    }
    
    elements.passwordInput.classList.remove('is-invalid');
    elements.passwordInput.classList.add('is-valid');
    return { isValid: true, message: '' };
}

/*
 
 @returns {Object} 
 */
function validateForm() {
    const emailValidation = validateEmail();
    const passwordValidation = validatePassword();
    
    return {
        isValid: emailValidation.isValid && passwordValidation.isValid,
        email: emailValidation,
        password: passwordValidation
    };
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorAlert.classList.remove('d-none');
    elements.errorAlert.classList.add('show', 'animate__animated', 'animate__shakeX');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

/**
 * Hide error message
 */
function hideError() {
    elements.errorAlert.classList.remove('show', 'animate__animated', 'animate__shakeX');
    setTimeout(() => {
        elements.errorAlert.classList.add('d-none');
    }, 300);
}

/**
 * Update button state during login
 * @param {boolean} isLoading - Whether login is in progress
 * @param {boolean} isSuccess - Whether login was successful
 */
function updateButtonState(isLoading = false, isSuccess = false) {
    const btn = elements.loginBtn;
    const originalContent = btn.innerHTML;
    
    if (isLoading) {
        btn.disabled = true;
        btn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2" role="status"></span>
            Signing in...
        `;
    } else if (isSuccess) {
        btn.disabled = true;
        btn.innerHTML = `
            <i class="fas fa-check me-2"></i>
            Login Successful!
        `;
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-success');
    } else {
        btn.disabled = false;
        btn.innerHTML = originalContent.includes('Signing in') 
            ? `<i class="fas fa-sign-in-alt me-2"></i>Sign In`
            : originalContent;
        btn.classList.remove('btn-success');
        btn.classList.add('btn-primary');
    }
}



/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Reset form validation state
    elements.form.classList.remove('was-validated');
    hideError();
    
    // Validate form
    const validation = validateForm();
    
    if (!validation.isValid) {
        elements.form.classList.add('was-validated');
        
        // Focus on first invalid field
        if (!validation.email.isValid) {
            elements.emailInput.focus();
        } else if (!validation.password.isValid) {
            elements.passwordInput.focus();
        }
        
        return;
    }
    
    // Get form values
    const email = elements.emailInput.value.trim();
    const password = elements.passwordInput.value;
    const rememberMe = elements.rememberMe.checked;
    
    // Update button to loading state
    updateButtonState(true);
    
    try {
        // Attempt login
        const loginResult = await login(email, password, rememberMe);
        
        if (loginResult.success) {
            // Success state
            updateButtonState(false, true);
            
            // Show success message
            showToast(`Welcome back, ${loginResult.user.name}!`, 'success');
            
            // Get redirect destination
            const redirectTo = sessionStorage.getItem('redirectAfterLogin') || 'products.html';
            sessionStorage.removeItem('redirectAfterLogin');
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = redirectTo;
            }, 1500);
            
        } else {
            // Failed login
            updateButtonState(false);
            showError(loginResult.message || 'Invalid email or password. Please try again.');
            elements.passwordInput.value = '';
            elements.passwordInput.focus();
        }
        
    } catch (error) {
        // Network or other error
        updateButtonState(false);
        showError('Network error. Please check your connection and try again.');
        console.error('Login error:', error);
    }
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility() {
    const type = elements.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    elements.passwordInput.setAttribute('type', type);
    
    const icon = elements.togglePasswordBtn.querySelector('i');
    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
}

/**
 * Handle forgot password
 */
function handleForgotPassword() {
    const resetEmail = document.getElementById('reset-email').value.trim();
    
    if (!resetEmail) {
        showToast('Please enter your email address', 'warning');
        return;
    }
    
    if (!isValidEmail(resetEmail)) {
        showToast('Please enter a valid email address', 'warning');
        return;
    }
    
    // Show sending state
    const btn = elements.sendResetLinkBtn;
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>Sending...`;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button
        btn.disabled = false;
        btn.innerHTML = originalText;
        
        // Close
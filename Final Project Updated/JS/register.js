const form = document.getElementById('registerForm');

const nameErr = document.getElementById('nameErr');
const emailErr = document.getElementById('emailErr');
const passwordErr = document.getElementById('passwordErr');
const confirmErr = document.getElementById('confirmErr');
const successMsg = document.getElementById('successMsg');

function setFieldState(input, state) {
  if (!input) return;
  input.classList.remove('is-valid', 'is-invalid');
  if (state === 'valid') input.classList.add('is-valid');
  if (state === 'invalid') input.classList.add('is-invalid');
}

form.addEventListener('submit', function (e) {
  e.preventDefault();

  let valid = true;

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // ---------- Reset the slate: clear errors & hide success ----------
  document.querySelectorAll('.error').forEach(err => err.textContent = '');
  successMsg.style.display = 'none';

  // ---------- Name check: gotta have a full name ----------
  if (name === '') {
    nameErr.textContent = 'Full name is required';
    setFieldState(document.getElementById('name'), 'invalid');
    valid = false;
  } else {
    setFieldState(document.getElementById('name'), 'valid');
  }

  // ---------- Email check: looks like name@domain.com ----------
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    emailErr.textContent = 'Enter a valid email address';
    setFieldState(document.getElementById('email'), 'invalid');
    valid = false;
  } else {
    setFieldState(document.getElementById('email'), 'valid');
  }

  // ---------- Password check: at least 6 chars, keep it solid ----------
  if (password.length < 6) {
    passwordErr.textContent = 'Password must be at least 6 characters';
    setFieldState(document.getElementById('password'), 'invalid');
    valid = false;
  } else {
    setFieldState(document.getElementById('password'), 'valid');
  }

  // ---------- Double-confirm: match those passwords perfectly ----------
  if (confirmPassword === '') {
    confirmErr.textContent = 'Please confirm your password';
    setFieldState(document.getElementById('confirmPassword'), 'invalid');
    valid = false;
  } else if (password !== confirmPassword) {
    confirmErr.textContent = 'Passwords do not match';
    setFieldState(document.getElementById('confirmPassword'), 'invalid');
    valid = false;
  } else {
    setFieldState(document.getElementById('confirmPassword'), 'valid');
  }

  // ---------- Success party: show message, save name, redirect home ----------
  if (valid) {
    successMsg.style.display = 'block';
    form.reset();
    setFieldState(document.getElementById('name'));
    setFieldState(document.getElementById('email'));
    setFieldState(document.getElementById('password'));
    setFieldState(document.getElementById('confirmPassword'));
    sessionStorage.setItem('newUserName', name);
    localStorage.setItem('showWelcomeAlert', 'true');
    setTimeout(() => { window.location.href = 'index.html'; }, 1000);
  }
});

// ---------- Toggle peek: show or hide those password fields (DOM ready) ----------
document.addEventListener('DOMContentLoaded', function() {
  const showPasswordCheckbox = document.getElementById('showPassword');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  
  console.log('Checkbox:', showPasswordCheckbox);
  console.log('Password input:', passwordInput);
  console.log('Confirm password input:', confirmPasswordInput);
  
  if (showPasswordCheckbox) {
    showPasswordCheckbox.addEventListener('change', function() {
      console.log('Checkbox toggled:', this.checked);
      const type = this.checked ? 'text' : 'password';
      if (passwordInput) {
        passwordInput.type = type;
        console.log('Password field type changed to:', type);
      }
      if (confirmPasswordInput) {
        confirmPasswordInput.type = type;
        console.log('Confirm password field type changed to:', type);
      }
    });
  } else {
    console.log('Checkbox not found!');
  }
});

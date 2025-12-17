// main.js - Main website functionality

// Add to favorites function (requires login)
function addToFavorites(vinylId) {
const isLoggedIn = localStorage.getItem(‘isLoggedIn’);

```
if (isLoggedIn !== 'true') {
    alert('Please login to add favorites! 💝\n\nSign up now to save your favorite vinyls and never lose track of them.');
    window.location.href = 'login.html';
    return;
}

// User is logged in - add to favorites
const userData = JSON.parse(localStorage.getItem('vinylVaultUser'));

if (!userData.favorites) {
    userData.favorites = [];
}

// Check if already in favorites
if (userData.favorites.includes(vinylId)) {
    alert('Already in your favorites! ❤️');
    return;
}

// Add to favorites
userData.favorites.push(vinylId);
localStorage.setItem('vinylVaultUser', JSON.stringify(userData));

alert('Added to favorites! ❤️');

// Reload sidebar to update favorites count
loadSidebar();
```

}

// Add to cart function (requires login)
function addToCart(productId) {
const isLoggedIn = localStorage.getItem(‘isLoggedIn’);

```
if (isLoggedIn !== 'true') {
    alert('Please login to add items to cart! 🛒\n\nCreate an account to start shopping.');
    window.location.href = 'login.html';
    return;
}

// User is logged in - add to cart
const userData = JSON.parse(localStorage.getItem('vinylVaultUser'));

if (!userData.cart) {
    userData.cart = [];
}

// Add to cart
userData.cart.push(productId);
localStorage.setItem('vinylVaultUser', JSON.stringify(userData));

alert('Added to cart! 🛒');
```

}

// Request custom vinyl pressing (requires login)
function requestCustomVinyl() {
const isLoggedIn = localStorage.getItem(‘isLoggedIn’);

```
if (isLoggedIn !== 'true') {
    alert('Please login to request custom vinyl pressing! 💿\n\nThis feature is available to registered users only.');
    window.location.href = 'login.html';
    return;
}

alert('Custom vinyl pressing request form coming soon! 💿');
```

}

// Check user authentication status (utility function)
function checkAuth() {
return localStorage.getItem(‘isLoggedIn’) === ‘true’;
}

// Get current user data (utility function)
function getCurrentUser() {
const userData = localStorage.getItem(‘vinylVaultUser’);
return userData ? JSON.parse(userData) : null;
}
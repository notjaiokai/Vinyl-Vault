// ---------- main.js: core site moves, favorites, cart, and friendly helpers ----------

// ---------- Favorites: add a vinyl (requires login) ----------
function addToFavorites(vinylId) {
    if (typeof window.isLoggedIn === 'function' ? !window.isLoggedIn() : false) {
        alert('Please login to add favorites! 💝\n\nSign up now to save your favorite vinyls and never lose track of them.');
        window.location.href = 'loginVV.html.html';
        return;
    }

    // ---------- Logged in: stash favorites in localStorage for the demo ----------
    const userData = JSON.parse(localStorage.getItem('vinylVaultUser')) || {};
    if (!Array.isArray(userData.favorites)) {
        userData.favorites = [];
    }

    // ---------- Double-check: already favorited? then we bounce ----------
    if (userData.favorites.includes(vinylId)) {
        alert('Already in your favorites! ❤️');
        return;
    }

    // ---------- Save it: add to favorites and persist ----------
    userData.favorites.push(vinylId);
    localStorage.setItem('vinylVaultUser', JSON.stringify(userData));

    alert('Added to favorites! ❤️');

    // ---------- Sidebar refresh: update any badges or counts ----------
    if (typeof window.loadSidebar === 'function') {
        window.loadSidebar();
    }
}

// ---------- Cart: add a product (requires login) ----------
function addToCart(productId) {
    if (typeof window.isLoggedIn === 'function' ? !window.isLoggedIn() : false) {
        alert('Please login to add items to cart! 🛒\n\nCreate an account to start shopping.');
        window.location.href = 'loginVV.html.html';
        return;
    }

    // ---------- Logged in: stash cart items in localStorage for the demo ----------
    const userData = JSON.parse(localStorage.getItem('vinylVaultUser')) || {};
    if (!Array.isArray(userData.cart)) {
        userData.cart = [];
    }

    // ---------- Drop it in: add to cart and persist ----------
    userData.cart.push(productId);
    localStorage.setItem('vinylVaultUser', JSON.stringify(userData));

    alert('Added to cart! 🛒');
}

// ---------- Custom press: request a bespoke vinyl (requires login) ----------
function requestCustomVinyl() {
    if (typeof window.isLoggedIn === 'function' ? !window.isLoggedIn() : false) {
        alert('Please login to request custom vinyl pressing! 💿\n\nThis feature is available to registered users only.');
        window.location.href = 'loginVV.html.html';
        return;
    }

    alert('Custom vinyl pressing request form coming soon! 💿');
}

// ---------- Auth check: are we logged in? ----------
function checkAuth() {
    return typeof window.isLoggedIn === 'function' ? window.isLoggedIn() : false;
}

// ---------- Who’s this: fetch the current user data ----------
function getCurrentUser() {
    if (typeof window.getCurrentUser === 'function') {
        return window.getCurrentUser();
    }
    const userData = localStorage.getItem('vinylVaultUser');
    return userData ? JSON.parse(userData) : null;
}
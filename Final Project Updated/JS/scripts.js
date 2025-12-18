// ===================================
// VINYL DATA
// ===================================

const vinylData = [
    {
        id: 1,
        title: "Dark Side of the Moon",
        artist: "Pink Floyd",
        year: "1973",
        price: 45.99,
        status: "Limited Edition",
        gradient: "linear-gradient(135deg, #ffd93d 0%, #ffed4e 100%)",
        waveHeights: [30, 50, 70, 40, 80, 60, 90, 45, 65, 75]
    },
    {
        id: 2,
        title: "Abbey Road",
        artist: "The Beatles",
        year: "1969",
        price: 38.50,
        status: "In Stock",
        gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        waveHeights: [40, 70, 50, 85, 60, 75, 55, 90, 45, 70]
    },
    {
        id: 3,
        title: "Kind of Blue",
        artist: "Miles Davis",
        year: "1959",
        price: 52.00,
        status: "Limited",
        gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        waveHeights: [55, 45, 80, 65, 50, 70, 85, 40, 75, 60]
    },
    {
        id: 4,
        title: "Rumours",
        artist: "Fleetwood Mac",
        year: "1977",
        price: 42.00,
        status: "Classic",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        waveHeights: [45, 65, 80, 55, 70, 85, 60, 75, 50, 90]
    },
    {
        id: 5,
        title: "Purple Rain",
        artist: "Prince",
        year: "1984",
        price: 48.99,
        status: "Rare",
        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        waveHeights: [50, 70, 60, 85, 55, 75, 65, 80, 70, 90]
    },
    {
        id: 6,
        title: "Blue Train",
        artist: "John Coltrane",
        year: "1957",
        price: 55.00,
        status: "Collector's",
        gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        waveHeights: [60, 50, 75, 65, 80, 55, 70, 85, 60, 75]
    },
    {
        id: 7,
        title: "Thriller",
        artist: "Michael Jackson",
        year: "1982",
        price: 39.99,
        status: "Best Seller",
        gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        waveHeights: [55, 75, 65, 85, 70, 80, 60, 90, 75, 85]
    },
    {
        id: 8,
        title: "The Wall",
        artist: "Pink Floyd",
        year: "1979",
        price: 54.99,
        status: "Double Album",
        gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
        waveHeights: [65, 55, 80, 70, 85, 60, 75, 90, 65, 80]
    },
    {
        id: 9,
        title: "Back in Black",
        artist: "AC/DC",
        year: "1980",
        price: 41.50,
        status: "Rock Classic",
        gradient: "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)",
        waveHeights: [70, 85, 60, 75, 90, 65, 80, 55, 75, 85]
    }
];

// ===================================
// STATE MANAGEMENT
// ===================================

let currentSlide = 0;
let isPlaying = false;
let currentTrack = null;
let audioPlayer = null;

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadSidebar();
    generateVinylCards();
    initializeCarousel();
    initializeAudioPlayer();
    initializeNavigation();
    checkAuthStatus();
}

// ===================================
// SIDEBAR MANAGEMENT
// ===================================

function loadSidebar() {
    // Check for authentication using the same system as loginVV.js
    const STORAGE_KEY = 'vinylVaultAuth';
    const authData = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    let userData = null;

    if (authData) {
        try {
            userData = JSON.parse(authData);
            // Check if login is still valid (within 24 hours)
            if (userData.loginTime) {
                const loginTime = new Date(userData.loginTime);
                const now = new Date();
                const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
                if (hoursDiff > 24) {
                    userData = null;
                    localStorage.removeItem(STORAGE_KEY);
                    sessionStorage.removeItem(STORAGE_KEY);
                }
            }
        } catch (error) {
            console.error('Error parsing auth data:', error);
        }
    }

    const sidebar = document.getElementById('sidebar');

    if (userData && userData.isLoggedIn) {
        // Convert to expected format for getUserSidebar
        const userProfile = {
            username: userData.name || userData.email.split('@')[0],
            joinDate: new Date(userData.loginTime).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            favorites: userData.favorites || [],
            purchases: userData.purchases || 0
        };
        sidebar.innerHTML = getUserSidebar(userProfile);
        loadSavedTheme();
    } else {
        sidebar.innerHTML = getGuestSidebar();
    }
}

function getGuestSidebar() {
    return `
        <div class="guest-sidebar">
            <div class="guest-logo">
                <div class="guest-icon">🎵</div>
                <h2>VINYL VAULT</h2>
                <p class="guest-tagline">Where Music Lives</p>
            </div>
            
            <div class="guest-welcome">
                <h3>Music Lover!</h3>
                <p>Sign in to unlock your personalized music experience</p>
            </div>
            
            <div class="guest-buttons">
                <button class="btn-login" onclick="handleLogin()">Login</button>
                <button class="btn-signup" onclick="handleSignup()">Sign Up</button>
            </div>
            
            <div class="guest-features">
                <h4>What You'll Get:</h4>
                <ul>
                    <li>💾 Save Favorite Vinyls</li>
                    <li>🎨 Custom Color Themes</li>
                    <li>🛒 Shopping Cart</li>
                    <li>📀 Custom Vinyl Pressing</li>
                    <li>📊 Purchase History</li>
                </ul>
            </div>
            
            <div class="store-stats">
                <h4>Store Stats</h4>
                <div class="stat-item">
                    <span class="stat-number">5,234</span>
                    <span class="stat-label">Records</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">50+</span>
                    <span class="stat-label">Genres</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">1,500+</span>
                    <span class="stat-label">Happy Collectors</span>
                </div>
            </div>
        </div>
    `;
}

function getUserSidebar(userData) {
    const favorites = userData.favorites ? userData.favorites.length : 0;
    const purchases = userData.purchases || 0;
    const joinDate = userData.joinDate || new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    const initial = userData.username.charAt(0).toUpperCase();
    
    return `
        <div class="user-sidebar">
            <div class="profile-section">
                <div class="profile-date">
                    📅 ${joinDate}
                </div>
                
                <div class="profile-image-container">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Ccircle cx='70' cy='70' r='70' fill='%237B4CFF'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.35em' fill='white' font-size='60' font-weight='bold'%3E${initial}%3C/text%3E%3C/svg%3E"
                         alt="Profile" class="profile-image">
                </div>

                <div class="profile-name">${userData.username}</div>

                <div class="profile-socials">
                    <a href="#" title="Instagram">📷</a>
                    <a href="#" title="Twitter">🐦</a>
                    <a href="#" title="Spotify">🎵</a>
                    <a href="#" title="Facebook">📘</a>
                </div>

                <div class="profile-stats">
                    <div class="stat-box">
                        <div class="stat-label">Favorites</div>
                        <div class="stat-value">${favorites}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">Purchases</div>
                        <div class="stat-value">${purchases}</div>
                    </div>
                </div>
            </div>

            <div class="profile-footer">
                <button class="btn-logout" onclick="handleLogout()">
                    Logout
                </button>
            </div>
        </div>
    `;
}

// ===================================
// AUTHENTICATION
// ===================================

function checkAuthStatus() {
    const STORAGE_KEY = 'vinylVaultAuth';
    const authData = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    let isLoggedIn = false;

    if (authData) {
        try {
            const userData = JSON.parse(authData);
            isLoggedIn = userData.isLoggedIn === true;
        } catch (error) {
            console.error('Error checking auth status:', error);
        }
    }

    const authBtn = document.getElementById('authBtn');

    if (isLoggedIn) {
        authBtn.innerHTML = '<span class="auth-text">My Account</span>';
        authBtn.onclick = () => window.location.href = 'products.html';
    } else {
        authBtn.innerHTML = '<span class="auth-text">Get Started</span>';
        authBtn.onclick = handleSignup;
    }

    // -- Nav profile rendering: show avatar + username and toggle login/register/logout items
    try {
        const loginItem = document.querySelector('.nav-item a[href="loginVV.html"]')?.parentElement;
        const registerItem = document.querySelector('.nav-item a[href="register.html"]')?.parentElement || document.getElementById('register-item');
        const logoutItem = document.getElementById('logout-item');
        const userProfile = document.getElementById('user-profile');
        const userGreeting = document.getElementById('user-greeting');
        const userAvatar = document.getElementById('user-avatar');

        if (loginItem) loginItem.classList.toggle('d-none', isLoggedIn);
        if (registerItem) registerItem.classList.toggle('d-none', isLoggedIn);
        if (logoutItem) {
            logoutItem.classList.toggle('d-none', !isLoggedIn);
            const logoutLinkEl = document.getElementById('logout-link');
            if (logoutLinkEl) logoutLinkEl.onclick = function(e){ e.preventDefault(); handleLogout(); };
        }
        if (userProfile) userProfile.classList.toggle('d-none', !isLoggedIn);

        if (isLoggedIn && authData) {
            try {
                const user = JSON.parse(authData);
                const displayName = (user.name || user.email.split('@')[0] || 'User');
                if (userGreeting) {
                    userGreeting.textContent = displayName;
                    userGreeting.classList.remove('d-none');
                }
                if (userAvatar) {
                    const initial = String(displayName).trim().charAt(0).toUpperCase();
                    userAvatar.textContent = initial;
                    // pick a background color based on first char for variety
                    const colors = ['#7B4CFF','#5B36E6','#7AD1F2','#9D7BFF','#6EA8FF'];
                    const colorIndex = (initial.charCodeAt(0) || 65) % colors.length;
                    userAvatar.style.background = colors[colorIndex];
                }
            } catch (e) { console.error('Error rendering user profile:', e); }
        } else {
            if (userGreeting) userGreeting.classList.add('d-none');
            if (userAvatar) userAvatar.textContent = 'V';
        }
    } catch (err) {
        console.warn('Profile UI update skipped:', err);
    }
}

function handleLogin() {
    // Redirect to the actual login page
    window.location.href = 'login.html';
}

function handleSignup() {
    // Redirect to the actual registration page
    window.location.href = 'signup.html';
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        const STORAGE_KEY = 'vinylVaultAuth';
        localStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(STORAGE_KEY);

        loadSidebar();
        checkAuthStatus();

        showNotification('Logged out successfully');
    }
}

// ===================================
// THEME MANAGEMENT
// ===================================

function changeTheme(theme) {
    localStorage.setItem('vinylVaultTheme', theme);
    applyTheme(theme);
    showNotification(`Theme changed to ${theme}`);
}

function applyTheme(theme) {
    // This is where you could add theme-specific CSS variable changes
    // For now, we'll just log it
    console.log('Theme applied:', theme);
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('vinylVaultTheme') || 'default';
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = savedTheme;
        applyTheme(savedTheme);
    }
}

// ===================================
// VINYL CARDS GENERATION
// ===================================

function generateVinylCards() {
    const track = document.getElementById('vinylTrack');
    
    vinylData.forEach(vinyl => {
        const card = createVinylCard(vinyl);
        track.appendChild(card);
    });
}

function createVinylCard(vinyl) {
    const card = document.createElement('div');
    card.className = 'vinyl-card';
    card.dataset.vinylId = vinyl.id;
    
    const waveform = vinyl.waveHeights.map(height => 
        `<div class="wave-bar" style="height: ${height}%;"></div>`
    ).join('');
    
    card.innerHTML = `
        <div class="vinyl-image-wrapper">
            <div class="vinyl-label" style="background: ${vinyl.gradient};"></div>
            <div class="vinyl-center"></div>
        </div>
        <div class="vinyl-info">
            <div class="vinyl-title-bar">
                <h3 class="vinyl-title">${vinyl.title}</h3>
                <div class="play-icon">
                    <button onclick="playVinyl(${vinyl.id})" aria-label="Play ${vinyl.title}">▶</button>
                    <button onclick="toggleFavorite(${vinyl.id})" aria-label="Add to favorites">♥</button>
                </div>
            </div>
            <div class="vinyl-artist">${vinyl.artist} • ${vinyl.year}</div>
            <div class="waveform">
                ${waveform}
            </div>
            <div class="vinyl-footer">
                <div class="vinyl-price">$${vinyl.price.toFixed(2)}</div>
                <div class="vinyl-time">${vinyl.status}</div>
            </div>
        </div>
    `;
    
    return card;
}

// ===================================
// CAROUSEL FUNCTIONALITY
// ===================================

function initializeCarousel() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    
    const totalSlides = Math.ceil(vinylData.length / 3);
    
    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = i === 0 ? 'dot active' : 'dot';
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    }
    
    prevBtn.onclick = previousSlide;
    nextBtn.onclick = nextSlide;
    
    updateCarouselButtons();
}

function goToSlide(index) {
    const track = document.getElementById('vinylTrack');
    const totalSlides = Math.ceil(vinylData.length / 3);
    
    currentSlide = Math.max(0, Math.min(index, totalSlides - 1));
    
    const offset = currentSlide * -100;
    track.style.transform = `translateX(${offset}%)`;
    
    updateCarouselButtons();
    updateDots();
}

function previousSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    }
}

function nextSlide() {
    const totalSlides = Math.ceil(vinylData.length / 3);
    if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
    }
}

function updateCarouselButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const totalSlides = Math.ceil(vinylData.length / 3);
    
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// ===================================
// AUDIO PLAYER
// ===================================

function initializeAudioPlayer() {
    audioPlayer = document.getElementById('audioPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevTrack = document.getElementById('prevTrack');
    const nextTrack = document.getElementById('nextTrack');
    const progressBar = document.getElementById('progressBar');
    const favoriteBtn = document.getElementById('favoriteBtn');
    
    playPauseBtn.onclick = togglePlayPause;
    prevTrack.onclick = playPreviousTrack;
    nextTrack.onclick = playNextTrack;
    progressBar.onclick = seekAudio;
    favoriteBtn.onclick = () => currentTrack && toggleFavorite(currentTrack.id);
    
    // Update progress
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', onTrackEnded);
    audioPlayer.addEventListener('loadedmetadata', updateDuration);
}

function playVinyl(vinylId) {
    const vinyl = vinylData.find(v => v.id === vinylId);
    if (!vinyl) return;

    const STORAGE_KEY = 'vinylVaultAuth';
    const authData = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
    let isLoggedIn = false;

    if (authData) {
        try {
            const userData = JSON.parse(authData);
            isLoggedIn = userData.isLoggedIn === true;
        } catch (error) {
            console.error('Error checking auth:', error);
        }
    }

    if (!isLoggedIn) {
        showNotification('Sign up for a free account to play full tracks! 🎵', 'info');
    }

    currentTrack = vinyl;

    // Update UI
    const albumArt = document.getElementById('albumArt');
    albumArt.innerHTML = `<div style="width: 100%; height: 100%; background: ${vinyl.gradient};"></div>`;

    document.getElementById('trackTitle').textContent = vinyl.title;
    document.getElementById('trackArtist').textContent = `${vinyl.artist} • ${vinyl.year}`;

    // For demo purposes, we'll just show the UI update
    // In a real app, you'd load an actual audio file
    const playPauseBtn = document.getElementById('playPauseBtn');
    playPauseBtn.classList.add('playing');
    isPlaying = true;

    showNotification(`Now playing: ${vinyl.title}`);
}

function togglePlayPause() {
    if (!currentTrack) {
        showNotification('Please select a vinyl to play', 'info');
        return;
    }
    
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.classList.remove('playing');
        isPlaying = false;
    } else {
        audioPlayer.play();
        playPauseBtn.classList.add('playing');
        isPlaying = true;
    }
}

function playPreviousTrack() {
    if (!currentTrack) return;
    
    const currentIndex = vinylData.findIndex(v => v.id === currentTrack.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : vinylData.length - 1;
    
    playVinyl(vinylData[previousIndex].id);
}

function playNextTrack() {
    if (!currentTrack) return;
    
    const currentIndex = vinylData.findIndex(v => v.id === currentTrack.id);
    const nextIndex = currentIndex < vinylData.length - 1 ? currentIndex + 1 : 0;
    
    playVinyl(vinylData[nextIndex].id);
}

function seekAudio(event) {
    if (!audioPlayer.duration) return;
    
    const progressBar = event.currentTarget;
    const clickX = event.offsetX;
    const width = progressBar.offsetWidth;
    const duration = audioPlayer.duration;
    
    audioPlayer.currentTime = (clickX / width) * duration;
}

function updateProgress() {
    if (!audioPlayer.duration) return;
    
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    
    document.getElementById('currentTime').textContent = formatTime(audioPlayer.currentTime);
}

function updateDuration() {
    document.getElementById('totalTime').textContent = formatTime(audioPlayer.duration);
}

function onTrackEnded() {
    playNextTrack();
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ===================================
// FAVORITES
// ===================================

function toggleFavorite(vinylId) {
    const STORAGE_KEY = 'vinylVaultAuth';
    const authData = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);

    if (!authData) {
        showNotification('Please sign in to save favorites', 'info');
        handleLogin();
        return;
    }

    const vinyl = vinylData.find(v => v.id === vinylId);
    let userData;

    try {
        userData = JSON.parse(authData);
    } catch (error) {
        console.error('Error parsing user data:', error);
        return;
    }

    if (!userData.favorites) {
        userData.favorites = [];
    }

    const index = userData.favorites.findIndex(f => f.id === vinylId);

    if (index > -1) {
        userData.favorites.splice(index, 1);
        showNotification(`Removed ${vinyl.title} from favorites`);
    } else {
        userData.favorites.push(vinyl);
        showNotification(`Added ${vinyl.title} to favorites ❤️`);
    }

    // Save back to the same storage location
    const storageToUse = localStorage.getItem(STORAGE_KEY) ? localStorage : sessionStorage;
    storageToUse.setItem(STORAGE_KEY, JSON.stringify(userData));
    loadSidebar();
}

// ===================================
// NAVIGATION
// ===================================

function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    
    mobileMenuBtn.onclick = () => {
        sidebar.classList.toggle('open');
    };
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===================================
// NOTIFICATIONS
// ===================================

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#7B4CFF'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        font-size: 1rem;
        font-weight: 500;
        line-height: 1.5;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// POLISH ENHANCEMENTS
// ===================================

// Smooth Header Scroll Effect
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', debounce(() => {
    const currentScroll = window.pageYOffset;

    if (header) {
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    lastScroll = currentScroll;
}, 10));

// Intersection Observer for Fade-in Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.vinyl-card, .feature-card, .stat-box');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#!') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

const buttons = document.querySelectorAll('.btn-primary, .btn-hero, .control-btn');
buttons.forEach(button => {
    button.addEventListener('click', createRipple);
});

// Add ripple CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    button {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyle);

// ===================================
// SMOOTH PAGE TRANSITIONS
// ===================================

// Add smooth exit transitions to internal links
document.addEventListener('DOMContentLoaded', () => {
    const internalLinks = document.querySelectorAll('a[href^="index.html"], a[href^="AboutUs.html"], a[href^="products.html"], a[href^="faq.html"], a[href^="ContactUs.html"], a[href^="login.html"], a[href^="signup.html"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Don't prevent default for external links or anchors
            if (href && !href.startsWith('#') && !href.startsWith('http')) {
                e.preventDefault();

                // Add exit animation
                document.body.classList.add('page-transition-exit');

                // Navigate after animation
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });

    // Stagger animation for product cards, FAQ items
    const staggerElements = document.querySelectorAll('.product, .accordion-item, .vinyl-card');
    staggerElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`;
    });
});

// Add stagger animation CSS
const staggerStyle = document.createElement('style');
staggerStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(staggerStyle);

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
    updateCarouselButtons();
}, 250));
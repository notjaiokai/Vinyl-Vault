// sidebar.js - Handles dynamic sidebar loading based on login status

// Load sidebar when page loads
window.addEventListener('DOMContentLoaded', function() {
    loadSidebar();
    loadNavButtons();
});

function loadSidebar() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = JSON.parse(localStorage.getItem('vinylVaultUser'));
    
    const sidebarElement = document.getElementById('sidebar');
    
    if (isLoggedIn === 'true' && userData) {
        // User is logged in - show personalized sidebar
        sidebarElement.innerHTML = getUserSidebar(userData);
    } else {
        // User is NOT logged in - show guest sidebar
        sidebarElement.innerHTML = getGuestSidebar();
    }
}

// Guest Sidebar HTML
function getGuestSidebar() {
    return `
        <div class="guest-sidebar">
            <div class="guest-logo">
                <div class="guest-icon">🎵</div>
                <h2>VINYL VAULT</h2>
                <p class="guest-tagline">Where Music Lives</p>
            </div>
            
            <div class="guest-welcome">
                <h3>Welcome, Music Lover!</h3>
                <p>Sign in to unlock your personalized music experience</p>
            </div>
            
            <div class="guest-buttons">
                <button class="btn-login" onclick="window.location.href='login.html'">
                    Login
                </button>
                <button class="btn-signup" onclick="window.location.href='register.html'">
                    Sign Up
                </button>
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

// User Sidebar HTML
function getUserSidebar(userData) {
    // Get user's favorites count
    const favorites = userData.favorites ? userData.favorites.length : 0;
    const purchases = userData.purchases || 0;
    
    // Format join date
    const joinDate = userData.joinDate || 'Dec 23, 2024';
    
    return `
        <div class="user-sidebar">
            <div class="profile-section">
                <div class="profile-date">
                    ${joinDate} 📅
                </div>
                
                <div class="profile-image-container">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23ff6b6b'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='40' font-weight='bold'%3E${userData.username.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E" 
                         alt="Profile" class="profile-image">
                    <div class="vinyl-rings">
                        <div class="vinyl-ring"></div>
                        <div class="vinyl-ring"></div>
                        <div class="vinyl-ring"></div>
                    </div>
                </div>

                <div class="profile-name">${userData.username.toUpperCase()} ✓</div>
                <div class="profile-username">@${userData.username.toLowerCase().replace(/\s+/g, '')}</div>

                <div class="profile-socials">
                    <a href="#" title="Instagram">📷</a>
                    <a href="#" title="Twitter">🐦</a>
                    <a href="#" title="Spotify">🎵</a>
                    <a href="#" title="Facebook">📘</a>
                </div>

                <div class="profile-tags">
                    <span class="tag">#Vinyl</span>
                    <span class="tag">#Collector</span>
                    <span class="tag">#Music</span>
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
                <div class="theme-selector">
                    <div class="theme-label">🎨 Color Theme</div>
                    <select id="themeSelect" onchange="changeTheme()">
                        <option value="default">🔴 Default</option>
                        <option value="purple">💜 Purple Dream</option>
                        <option value="blue">💙 Ocean Blue</option>
                        <option value="green">💚 Forest Green</option>
                        <option value="neon">⚡ Neon Night</option>
                    </select>
                </div>
                
                <button class="btn-logout" onclick="logout()">
                    Logout
                </button>
            </div>
        </div>
    `;
}

// Load appropriate nav buttons
function loadNavButtons() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const navButtons = document.getElementById('navButtons');
    
    if (isLoggedIn === 'true') {
        navButtons.innerHTML = `
            <button class="btn-account" onclick="window.location.href='account.html'">
                My Account
            </button>
        `;
    } else {
        navButtons.innerHTML = `
            <button class="btn-wallet" onclick="window.location.href='login.html'">
                Login / Register
            </button>
        `;
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('vinylVaultUser');
        alert('You have been logged out successfully!');
        window.location.href = 'index.html';
    }
}

// Theme changing function
function changeTheme() {
    const themeSelect = document.getElementById('themeSelect');
    const selectedTheme = themeSelect.value;
    
    // Save to localStorage
    localStorage.setItem('vinylVaultTheme', selectedTheme);
    
    // Apply the theme
    applyTheme(selectedTheme);
}

// Apply theme
function applyTheme(theme) {
    // Remove all theme classes
    document.body.classList.remove('theme-purple', 'theme-blue', 'theme-green', 'theme-neon');
    
    // Add the selected theme class (unless it's default)
    if (theme !== 'default') {
        document.body.classList.add('theme-' + theme);
    }
}

// Load saved theme on page load
window.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('vinylVaultTheme') || 'default';
    applyTheme(savedTheme);
    
    // Set dropdown to saved theme after sidebar loads
    setTimeout(() => {
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = savedTheme;
        }
    }, 100);
})
// sidebar.js - Handles dynamic sidebar loading based on login status

// Load sidebar when page loads
window.addEventListener('DOMContentLoaded', function() {
    loadSidebar();
    loadNavButtons();
});

function loadSidebar() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = JSON.parse(localStorage.getItem('vinylVaultUser'));
    
    const sidebarElement = document.getElementById('sidebar');
    
    if (isLoggedIn === 'true' && userData) {
        // User is logged in - show personalized sidebar
        sidebarElement.innerHTML = getUserSidebar(userData);
    } else {
        // User is NOT logged in - show guest sidebar
        sidebarElement.innerHTML = getGuestSidebar();
    }
}

// Guest Sidebar HTML
function getGuestSidebar() {
    return `  
        <div class="guest-sidebar">
            <div class="guest-logo">
                <div class="guest-icon">🎵</div>
                <h2>VINYL VAULT</h2>
                <p class="guest-tagline">Where Music Lives</p>
            </div>
            
            <div class="guest-welcome">
                <h3>Welcome, Music Lover!</h3>
                <p>Sign in to unlock your personalized music experience</p>
            </div>
            
            <div class="guest-buttons">
                <button class="btn-login" onclick="window.location.href='login.html'">
                    Login
                </button>
                <button class="btn-signup" onclick="window.location.href='register.html'">
                    Sign Up
                </button>
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

// User Sidebar HTML
function getUserSidebar(userData) {
    // Get user's favorites count
    const favorites = userData.favorites ? userData.favorites.length : 0;
    const purchases = userData.purchases || 0;
    
    // Format join date
    const joinDate = userData.joinDate || 'Dec 23, 2024';
    
    return `
        <div class="user-sidebar">
            <div class="profile-section">
                <div class="profile-date">
                    ${joinDate} 📅
                </div>
                
                <div class="profile-image-container">
                    <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23ff6b6b'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='white' font-size='40' font-weight='bold'%3E${userData.username.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E" 
                         alt="Profile" class="profile-image">
                    <div class="vinyl-rings">
                        <div class="vinyl-ring"></div>
                        <div class="vinyl-ring"></div>
                        <div class="vinyl-ring"></div>
                    </div>
                </div>

                <div class="profile-name">${userData.username.toUpperCase()} ✓</div>
                <div class="profile-username">@${userData.username.toLowerCase().replace(/\s+/g, '')}</div>

                <div class="profile-socials">
                    <a href="#" title="Instagram">📷</a>
                    <a href="#" title="Twitter">🐦</a>
                    <a href="#" title="Spotify">🎵</a>
                    <a href="#" title="Facebook">📘</a>
                </div>

                <div class="profile-tags">
                    <span class="tag">#Vinyl</span>
                    <span class="tag">#Collector</span>
                    <span class="tag">#Music</span>
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
                <div class="theme-selector">
                    <div class="theme-label">🎨 Color Theme</div>
                    <select id="themeSelect" onchange="changeTheme()">
                        <option value="default">🔴 Default</option>
                        <option value="purple">💜 Purple Dream</option>
                        <option value="blue">💙 Ocean Blue</option>
                        <option value="green">💚 Forest Green</option>
                        <option value="neon">⚡ Neon Night</option>
                    </select>
                </div>
                
                <button class="btn-logout" onclick="logout()">
                    Logout
                </button>
            </div>
        </div>
    `;
}

// Load appropriate nav buttons
function loadNavButtons() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const navButtons = document.getElementById('navButtons');
    
    if (isLoggedIn === 'true') {
        navButtons.innerHTML = `
            <button class="btn-account" onclick="window.location.href='account.html'">
                My Account
            </button>
        `;
    } else {
        navButtons.innerHTML = `
            <button class="btn-wallet" onclick="window.location.href='login.html'">
                Login / Register
            </button>
        `;
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('vinylVaultUser');
        alert('You have been logged out successfully!');
        window.location.href = 'index.html';
    }
}

// Theme changing function
function changeTheme() {
    const themeSelect = document.getElementById('themeSelect');
    const selectedTheme = themeSelect.value;
    
    // Save to localStorage
    localStorage.setItem('vinylVaultTheme', selectedTheme);
    
    // Apply the theme
    applyTheme(selectedTheme);
}

// Apply theme
function applyTheme(theme) {
    // Remove all theme classes
    document.body.classList.remove('theme-purple', 'theme-blue', 'theme-green', 'theme-neon');
    
    // Add the selected theme class (unless it's default)
    if (theme !== 'default') {
        document.body.classList.add('theme-' + theme);
    }
}

// Load saved theme on page load
window.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('vinylVaultTheme') || 'default';
    applyTheme(savedTheme);
    
    // Set dropdown to saved theme after sidebar loads
    setTimeout(() => {
        const themeSelect = document.getElementById('themeSelect');
        if (themeSelect) {
            themeSelect.value = savedTheme;
        }
    }, 100);
})

// audio-player.js - Handles music playback

// Get audio element and player controls
const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressFill = document.getElementById('progressFill');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const albumCover = document.getElementById('albumCover');

// Current playlist
let currentTrack = null;
let isPlaying = false;

// Play a track
function playTrack(title, artist, audioUrl, coverGradient) {
    // Check if user is logged in for full playback
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn !== 'true') {
        alert('Sign up for a free account to play full tracks! 🎵\n\nFor now, enjoy a 30-second preview.');
    }
    
    // Set current track info
    currentTrack = {
        title: title,
        artist: artist,
        audioUrl: audioUrl,
        coverGradient: coverGradient
    };
    
    // Update UI
    trackTitle.textContent = title;
    trackArtist.textContent = artist;
    albumCover.style.background = coverGradient;
    
    // Load and play audio
    audioPlayer.src = audioUrl;
    audioPlayer.load();
    audioPlayer.play();
    isPlaying = true;
    playPauseBtn.textContent = '⏸';
    
    // Update now playing in localStorage
    localStorage.setItem('nowPlaying', JSON.stringify(currentTrack));
}

// Toggle play/pause
function togglePlayPause() {
    if (!currentTrack) {
        alert('Please select a track to play! 🎵');
        return;
    }
    
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.textContent = '▶';
        isPlaying = false;
    } else {
        audioPlayer.play();
        playPauseBtn.textContent = '⏸';
        isPlaying = true;
    }
}

// Previous track (placeholder - you can implement playlist logic)
function previousTrack() {
    alert('Previous track feature coming soon! 🎵');
}

// Next track (placeholder - you can implement playlist logic)
function nextTrack() {
    alert('Next track feature coming soon! 🎵');
}

// Seek audio
function seekAudio(event) {
    if (!currentTrack) return;
    
    const progressBar = event.currentTarget;
    const clickX = event.offsetX;
    const width = progressBar.offsetWidth;
    const duration = audioPlayer.duration;
    
    audioPlayer.currentTime = (clickX / width) * duration;
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Update progress bar and time
audioPlayer.addEventListener('timeupdate', function() {
    if (audioPlayer.duration) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressFill.style.width = progress + '%';
        
        currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
    }
});

// When audio ends
audioPlayer.addEventListener('ended', function() {
    playPauseBtn.textContent = '▶';
    isPlaying = false;
    progressFill.style.width = '0%';
    currentTimeDisplay.textContent = '0:00';
});

// Load metadata
audioPlayer.addEventListener('loadedmetadata', function() {
    totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
});

// Load last playing track on page load
window.addEventListener('DOMContentLoaded', function() {
    const savedTrack = localStorage.getItem('nowPlaying');
    if (savedTrack) {
        const track = JSON.parse(savedTrack);
        trackTitle.textContent = track.title;
        trackArtist.textContent = track.artist;
        albumCover.style.background = track.coverGradient;
        currentTrack = track;
    }
});
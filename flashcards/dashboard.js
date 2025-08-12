// Check if user is logged in
const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

if (!loggedInUser) {
    // No session → send back to login page
    window.location.href = '/authfiles/login.html';
} else {
    // Show username if there’s a placeholder in HTML
    const usernameEl = document.getElementById('usernameDisplay');
    if (usernameEl) {
        usernameEl.textContent = loggedInUser.username;
    }
}

// Handle logout
const logoutBtn = document.getElementById('logoutButton');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = '/authfiles/login.html';
    });
}

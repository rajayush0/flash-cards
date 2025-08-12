document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const loggedInUser = users.find(user => user.email === email && user.password === password);

    if (loggedInUser) {
        // Save "session"
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        window.location.href = '/flashcards/dashboard.html'; // Redirect to dashboard or home
    } else {
        // Show error popup
        const loginErrorEl = document.getElementById('loginError');
        loginErrorEl.style.display = 'inline';

        const closeBtn = document.getElementById('loginError-close-btn');
        if (closeBtn) {
            closeBtn.onclick = () => loginErrorEl.style.display = 'none';
        }

        // Auto-hide after 4 seconds
        setTimeout(() => {
            loginErrorEl.style.display = 'none';
        }, 4000);
    }
});

// Optional: redirect if already logged in (only for login page)
if (localStorage.getItem('loggedInUser') && window.location.pathname.includes("login.html")) {
    window.location.href = '/flashcards/dashboard.html';
}

// Optional: safe link redirects
const signupLink = document.getElementById("signupLink");
if (signupLink) {
    signupLink.addEventListener("click", () => {
        window.location.href = "signup.html";
    });
}

const loginLink = document.getElementById("loginLink");
if (loginLink) {
    loginLink.addEventListener("click", () => {
        window.location.href = "login.html";
    });
}

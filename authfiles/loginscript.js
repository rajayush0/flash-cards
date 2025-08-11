document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const loggedInUser = users.find(user => user.email === email && user.password === password);

    if (loggedInUser) {
        localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
        window.location.href = '/dashboard.html'; // Redirect to dashboard
    } else {
        // Show invalid credentials message
        const loginErrorEl = document.getElementById('loginError');
        loginErrorEl.style.display = 'inline';
        // loginErrorEl.textContent = 'Invalid email or password!';
        
        // Optional: Hide error message after 4 seconds
        setTimeout(() => {
            loginErrorEl.style.display = 'none';
        }, 4000);
    }
});
// Redirect to signup page if not logged in
document.getElementById("signupLink").addEventListener("click", function () {
    window.location.href = "signup.html";
});
// Redirect to login page if not logged in
document.getElementById("loginLink").addEventListener("click", function () {
    window.location.href = "login.html";
});
// Redirect to dashboard if already logged in
if (localStorage.getItem('loggedInUser')) {
    window.location.href = '/dashboard.html';
} ;

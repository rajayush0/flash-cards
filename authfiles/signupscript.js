const logohome = document.getElementById("logo");
logohome.addEventListener("click", () => {
  window.location.href = "/index.html";
});




let password = document.getElementById("signupPassword");
let power = document.getElementById("power-point");
password.oninput = function () {
    let point = 0;
    let value = password.value;
    let widthPower = 
        ["1%", "25%", "50%", "75%", "100%"];
    let colorPower = 
        ["#D73F40", "#DC6551", "#F2B84F", "#BDE952", "#3ba62f"];
    
    if (value.length >= 6) {
        let arrayTest = 
            [/[0-9]/, /[a-z]/, /[A-Z]/, /[^0-9a-zA-Z]/];
        arrayTest.forEach((item) => {
            if (item.test(value)) {
                point += 1;
            }
        });
    }
    power.style.width = widthPower[point];
    power.style.backgroundColor = colorPower[point];
};

document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    // Validate password match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Check if user already exists
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
        // Show user exists message
        const userExistEl = document.getElementById('userExist');
        userExistEl.style.display = 'inline';
        userExistEl.querySelector('.userExist-text').textContent = `User with email ${email} already exists!`;
        userExistEl.querySelector('.userExist-close-btn').onclick = function() {
            userExistEl.style.display = 'none';
        };
        // Hide after 1.5 seconds
        userExistEl.style.display = 'inline';
        setTimeout(function() {
            userExistEl.style.display = 'none';
        }, 4000); // 3000 milliseconds = 4 seconds
        return;
    }   

    // Save user
    const newUser = {
        username: username,
        email: email,
        password: password, //  In production, always hash the password!
        flashcards: []
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Set current user session
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));
    alert("Signup successful!");

    window.location.href = '/dashboard.html'; // Redirect to dashboard or home
});

const userExistEl = document.getElementById('userExist')

// setTimeout(function(){
//     userExistEl.style.display = 'inline'
// }, 1500) 

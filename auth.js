// SIGNUP
document.getElementById("signupForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;
  const email = document.getElementById("signupEmail").value;

  if (localStorage.getItem(username)) {
    alert("User already exists!");
  } else {
    localStorage.setItem(username, password);
    alert("Signup successful! Please login.");
    window.location.href = "login.html";
  }
});
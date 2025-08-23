const createcardbtn = document.getElementById("create-card-btn");






document.addEventListener("DOMContentLoaded", () => {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const navLinksContainer = document.querySelector('.nav-links');
  if (navLinksContainer) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    navLinksContainer.innerHTML = '';
    const baseLinks = [
      { text: 'HOME', href: 'index.html' },
      { text: 'FLASHBOOKS', href: '/flashcards/dashboard.html' }
    ];
    baseLinks.forEach(link => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = link.href;
      a.className = 'navlinkc';
      a.textContent = link.text;
      li.appendChild(a);
      navLinksContainer.appendChild(li);
    });
    if (loggedInUser) {
      const welcomeLi = document.createElement('li');
      welcomeLi.innerHTML = `Welcome, <strong id="usernameDisplay">${escapeHtml(loggedInUser.username)}</strong>`;
      navLinksContainer.appendChild(welcomeLi);
      const logoutLi = document.createElement('li');
      const logoutBtn = document.createElement('button');
      logoutBtn.id = 'logoutButton';
      logoutBtn.textContent = 'Log Out';
      logoutBtn.style.cursor = 'pointer';
      logoutLi.appendChild(logoutBtn);
      navLinksContainer.appendChild(logoutLi);
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
      });
    } else {
      const loginLi = document.createElement('li');
      const aLogin = document.createElement('a');
      aLogin.href = './authfiles/login.html';
      aLogin.className = 'navlinkc';
      aLogin.textContent = 'LOGIN';
      loginLi.appendChild(aLogin);
      navLinksContainer.appendChild(loginLi);
      const signupLi = document.createElement('li');
      const aSignup = document.createElement('a');
      aSignup.href = './authfiles/signup.html';
      aSignup.className = 'navlinkc';
      aSignup.textContent = 'SIGNUP';
      signupLi.appendChild(aSignup);
      navLinksContainer.appendChild(signupLi);
    }
  }

  const logohome = document.getElementById("logo");
  if (logohome) {
    logohome.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  const card = document.getElementById("card");
  if (card) {
    card.addEventListener("click", () => {
      card.classList.toggle("is-flipped");
    });
    card.addEventListener("mousemove", event => {
      const pointerX = event.clientX;
      const pointerY = event.clientY;
      const cardRect = card.getBoundingClientRect();
      const halfWidth = cardRect.width / 2 || 1;
      const halfHeight = cardRect.height / 2 || 1;
      const cardCenterX = cardRect.left + halfWidth;
      const cardCenterY = cardRect.top + halfHeight;
      const deltaX = pointerX - cardCenterX;
      const deltaY = pointerY - cardCenterY;
      const rx = (deltaY / halfHeight) * 10;
      const ry = (deltaX / halfWidth) * 10;
      const distanceToCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = Math.max(halfHeight, halfWidth);
      const degree = (distanceToCenter / maxDistance) * 10;
      card.style.transform = `perspective(400px) rotate3d(${ -rx }, ${ ry }, 0, ${ degree }deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(400px) rotate3d(0, 0, 0, 0deg)";
    });
  }
});

createcardbtn.addEventListener("click", () => {
  window.location.href = "/flashcards/dashboard.html"
})

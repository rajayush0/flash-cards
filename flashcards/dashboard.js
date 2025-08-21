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

// --- existing flip handler (unchanged) ---
document.addEventListener('click', function (e) {
  const card = e.target.closest('.card');
  if (!card || card.classList.contains('create')) return; // ignore clicks outside or on creator

  // If clicking inside an active contenteditable, do not flip
  const editing = e.target.closest('[contenteditable="true"]');
  if (editing && document.activeElement === editing) return;

  card.classList.toggle('is-flipped');
});

// --- helper: attach delete button to a card (skip the create tile) ---
function attachDeleteButton(card) {
  if (!card || card.classList.contains('create')) return;
  if (card.querySelector('.delete-btn')) return; // avoid duplicates

  const btn = document.createElement('button');
  btn.className = 'delete-btn';
  btn.type = 'button';
  btn.innerText = '✕';

  // style the button minimally via JS so it appears even if CSS hasn't been updated yet.
  // You can remove this block if you already added the CSS in style.css.
  Object.assign(btn.style, {
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(0,0,0,0.45)',
    color: '#fff',
    fontSize: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 40,
  });

  // stop the click from bubbling (so it doesn't flip the card)
  btn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    // confirm deletion
    const ok = confirm('Delete this card?');
    if (!ok) return;
    card.remove();
  });

  // ensure card is positioned relative so absolute button positions correctly
  if (getComputedStyle(card).position === 'static') {
    card.style.position = 'relative';
  }

  card.appendChild(btn);
}

// --- find grid and create tile (your existing elements) ---
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('cardsGrid') || document.querySelector('.cards-grid');
  const createTile = document.getElementById('createCard') || document.querySelector('.card.create');

  if (!grid || !createTile) {
    console.warn('cardsGrid or create tile not found. Ensure .cards-grid/#cardsGrid and .card.create/#createCard exist.');
    return;
  }

  // Helper: build a new hero-style card (same structure you already use)
  function makeCardElement() {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('data-card', '');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <h2 class="editable title" contenteditable="true">❓ New Question</h2>
          <p class="editable body" contenteditable="true">Type the front content…</p>
          <p class="minortext">Tap to Flip</p>
        </div>
        <div class="card-back">
          <h2 class="editable title" contenteditable="true">Answer</h2>
          <p class="editable body" contenteditable="true">Type the back content…</p>
          <p class="minortext">Tap to Flip Back</p>
        </div>
      </div>
    `;

    // ensure the card can host an absolutely positioned button
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';

    // create delete button and append
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'delete-btn';
    btn.textContent = '✕';
    card.appendChild(btn);

    return card;
  }

  // Add delete button to pre-existing cards (except the create tile)
  grid.querySelectorAll('.card').forEach((c) => {
    if (c.classList.contains('create')) return;
    if (!c.querySelector('.delete-btn')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'delete-btn';
      btn.textContent = '✕';
      if (getComputedStyle(c).position === 'static') c.style.position = 'relative';
      c.appendChild(btn);
    }
  });

  // Delegated click handler on the grid:
  // 1) handle delete button clicks (stopPropagation), then
  // 2) handle flips for normal card clicks (but not while editing)
  grid.addEventListener('click', (e) => {
    // 1) Delete clicked?
    const del = e.target.closest('.delete-btn');
    if (del) {
      e.stopPropagation();               // IMPORTANT: prevent flip
      const card = del.closest('.card');
      if (!card) return;
      if (confirm('Delete this card?')) card.remove();
      return;
    }

    // 2) Flip card (preserve your existing editing rule)
    const card = e.target.closest('.card');
    if (!card || card.classList.contains('create')) return;

    const editing = e.target.closest('[contenteditable="true"]');
    if (editing && document.activeElement === editing) return;

    card.classList.toggle('is-flipped');
  });

  // Create-tile click: insert new card BEFORE the create tile so create tile stays last
  createTile.addEventListener('click', () => {
    const newCard = makeCardElement();
    grid.insertBefore(newCard, createTile);
    // focus title for quick typing
    const title = newCard.querySelector('.editable.title');
    if (title) title.focus();
  });

  // Optional: keep your Space-to-flip shortcut
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      const el = document.activeElement;
      const focusedCard = el && el.closest && el.closest('.card');
      if (focusedCard && !focusedCard.classList.contains('create')) {
        e.preventDefault();
        focusedCard.classList.toggle('is-flipped');
      }
    }
  });
});



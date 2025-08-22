// dashboard.js — fixed flip/delete handling + card creation

// Check if user is logged in
const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

if (!loggedInUser) {
  window.location.href = '/authfiles/login.html';
} else {
  const usernameEl = document.getElementById('usernameDisplay');
  if (usernameEl) usernameEl.textContent = loggedInUser.username;
}

const logoutBtn = document.getElementById('logoutButton');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('loggedInUser');
    window.location.href = '/authfiles/login.html';
  });
}

/**
 * (Optional) showModalConfirm function would go here if you want modal confirmation.
 * For now this file falls back to native confirm() if you don't have a modal.
 */
function showModalConfirm(msg) {
  // if you have a custom modal, replace this with that implementation.
  return Promise.resolve(confirm(msg));
}

// Helper: attach delete button to a card (skip the create tile)
function attachDeleteButton(card) {
  if (!card || card.classList.contains('create')) return;
  if (card.querySelector('.delete-btn')) return; // avoid duplicates

  const btn = document.createElement('button');
  btn.className = 'delete-btn';
  btn.type = 'button';
  btn.innerText = '✕';

  // Minimal inline style fallback (you can remove if your CSS provides it)
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

  // Clicking delete should not flip — we do a delegated confirm via showModalConfirm
  btn.addEventListener('click', (ev) => {
    ev.stopPropagation(); // prevent delegated flip
    showModalConfirm('Delete this card?').then(ok => {
      if (ok) card.remove();
    });
  });

  if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
  card.appendChild(btn);
}

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('cardsGrid') || document.querySelector('.cards-grid');
  const createTile = document.getElementById('createCard') || document.querySelector('.card.create');

  if (!grid || !createTile) {
    console.warn('cardsGrid or create tile not found.');
    return;
  }

  // Helper to create a hero-style card
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
          <h2 class="editable title" contenteditable="false">Answer</h2>
          <p class="editable body" contenteditable="true">Type the back content…</p>
          <p class="minortext">Tap to Flip Back</p>
        </div>
      </div>
    `;
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';

    attachDeleteButton(card); // ensures delete button + behavior

    return card;
  }

  // Attach delete buttons to existing cards
  grid.querySelectorAll('.card').forEach(c => {
    if (c.classList.contains('create')) return;
    attachDeleteButton(c);
  });

  // Single delegated handler: deletes first (stopPropagation), then flips
  grid.addEventListener('click', (e) => {
    // 1) Delete
    const del = e.target.closest('.delete-btn');
    if (del) {
      const card = del.closest('.card');
      if (card) {
        // Note: the delete button's own click handler already stops propagation,
        // but this is a safe guard in case delete buttons were created without it.
        e.stopPropagation();
        showModalConfirm('Delete this card?').then(ok => {
          if (ok) card.remove();
        });
      }
      return;
    }

    // 2) Flip (skip create tile and editing)
    const card = e.target.closest('.card');
    if (!card || card.classList.contains('create')) return;

    const editing = e.target.closest('[contenteditable="true"]');
    if (editing && document.activeElement === editing) return;

    card.classList.toggle('is-flipped');
  });

  // Create tile: insert new card before create tile (so create tile stays last)
  createTile.addEventListener('click', () => {
    const newCard = makeCardElement();
    grid.insertBefore(newCard, createTile);
    const title = newCard.querySelector('.editable.title');
    if (title) setTimeout(() => title.focus(), 50);
  });

  // Space key flips focused card (not while editing)
  document.addEventListener('keydown', (ev) => {
    if (ev.code !== 'Space') return;
    const el = document.activeElement;
    const focusedCard = el && el.closest && el.closest('.card');
    if (focusedCard && !focusedCard.classList.contains('create')) {
      const editing = el.closest && el.closest('[contenteditable="true"]');
      if (editing) return;
      ev.preventDefault();
      focusedCard.classList.toggle('is-flipped');
    }
  });
});

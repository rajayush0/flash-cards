# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This repo contains **FlashHub**, a small, static web app for creating and reviewing flashcards. It is built with plain HTML, CSS, and JavaScript and runs entirely in the browser using `localStorage` for persistence. There is no build pipeline, package manager, or backend service.

Key points from `README.md`:
- Purpose: create, organize, and revise flashcards ("Flashbooks") with a minimal UI.
- Tech stack: vanilla HTML5/CSS3/JavaScript, responsive design, browser storage; potential future use of Firebase or similar.
- Deployment: intended to be hosted as a static site (e.g. GitHub Pages / Netlify / Vercel).

## Development & run commands

There are **no project-specific CLI scripts** (no `package.json`, test runner, or build step). To work on the app:

- Open `index.html` directly in a browser to run the app.
- If you prefer a local HTTP server, you can use any static file server from the repo root, for example:
  - Python (if available): `python -m http.server 8000`

There is currently **no automated test suite** or linting configuration defined in this repo. If you introduce tooling (e.g. Jest, ESLint, Vite), add the corresponding commands here.

## High-level architecture

### Top-level structure
- `index.html` – Landing page with a hero flashcard, CTA to create cards, and global navigation.
- `style.css` – Shared styling for navigation, hero card, flashcard grid, login/signup forms, and modal dialogs.
- `script.js` – Home-page script handling navigation rendering, logged-in state display, logo click behavior, and hero card interaction.
- `flashcards/` – Flashcard dashboard UI and logic.
- `authfiles/` – Login and signup flows plus associated UI scripts.

There is **no module system**; all JavaScript runs as global scripts loaded directly by the HTML pages.

### Navigation & layout (`index.html` + `script.js`)
- `index.html` defines a fixed top nav bar plus a hero flashcard card with front/back content and a "Create Flashcard" CTA button.
- `script.js` runs on `DOMContentLoaded` and:
  - Defines a local `escapeHtml` utility to safely render the logged-in username.
  - Rebuilds the `.nav-links` list dynamically based on `localStorage.getItem('loggedInUser')`:
    - Always includes `HOME` and `FLASHBOOKS` links.
    - If logged in, shows a `Welcome, <username>` label and a `Log Out` button that clears `loggedInUser` and reloads `index.html`.
    - If not logged in, shows `LOGIN` and `SIGNUP` links instead.
  - Adds a click handler to the logo (`#logo`) to navigate back to `index.html`.
  - Implements the 3D card hover/flip effect for the hero card (`#card`), including pointer-based tilt and `is-flipped` toggling.
  - Hooks the "Create Flashcard" button (`#create-card-btn`) to navigate to `/flashcards/dashboard.html`.

This means **global nav content is partially driven by JavaScript**, not just static HTML, and relies on `localStorage` to know the logged-in user.

### Flashcard dashboard (`flashcards/dashboard.html` + `flashcards/dashboard.js`)

The dashboard is the main flashcard management UI.

- `dashboard.html` sets up:
  - A nav bar similar to the home page.
  - A landing header (`Your Flashcards`) and a `section.cards-grid` container (`#cardsGrid`).
  - A special `div.card.create#createCard` tile which acts as the "Create Card" button.
- `dashboard.js` handles **authentication gating** and **card grid behavior**:
  - On load, reads `loggedInUser` from `localStorage`:
    - If missing, immediately redirects to `/authfiles/login.html`.
    - If present, populates `#usernameDisplay` with the username and wires the `#logoutButton` to clear `loggedInUser` and redirect to the login page.
  - Defines `showModalConfirm(msg)` as a wrapper around `confirm(msg)`; this exists so you can later plug in a custom modal without changing call sites.
  - `attachDeleteButton(card)` decorates each non-`create` card with a positioned `✕` delete button and hooks it to a confirmation flow that removes the card from the DOM.
  - `makeCardElement()` constructs a new, hero-style `.card` with:
    - `contenteditable` fields for the front question and back answer text.
    - Minor text cues ("Tap to Flip" / "Tap to Flip Back").
    - An attached delete button.
  - On `DOMContentLoaded`, the script:
    - Validates presence of `#cardsGrid` and `#createCard`.
    - Adds delete buttons to any pre-existing cards (currently only the create tile is present by default).
    - Registers a **single delegated click handler on the grid** that:
      - Intercepts clicks on `.delete-btn` to confirm and remove a card without triggering a flip.
      - Otherwise toggles `is-flipped` on the clicked `.card`, skipping the create tile and skipping flips while actively editing a `contenteditable` field.
    - Hooks the `#createCard` tile to insert a new card before itself and focus the front title.
    - Listens for the `Space` key globally to flip the card that currently has focus, unless a `contenteditable` field is actively being edited.

Important architectural note: **card content is not yet persisted**. Cards exist purely in the DOM for the current session; although `users` in `localStorage` contain a `flashcards` array, `dashboard.js` does not currently read from or write to it.

### Authentication and user data (`authfiles/`)

Authentication is **purely front-end** and based on `localStorage`.

- `authfiles/signup.html` + `signupscript.js`:
  - Renders the signup form with username, email, password, confirm password, and a password-strength bar.
  - `signupscript.js`:
    - Implements a password strength meter (`#power-point`) driven by length and character class checks.
    - On form submit:
      - Validates that password and confirm password match.
      - Loads `users` from `localStorage` (an array of `{ username, email, password, flashcards: [] }`).
      - If a user with the same email exists, shows the `#userExist` modal, updates its message, then hides it after a timeout.
      - If no existing user, appends a new user to `users`, saves it to `localStorage`, sets `loggedInUser` to that user, and redirects to `/flashcards/dashboard.html`.
- `authfiles/login.html` + `loginscript.js`:
  - Renders the login form with email and password plus an error modal (`#loginError`).
  - `loginscript.js`:
    - On form submit, looks up a user in `localStorage.users` by email and password.
    - If found, sets `loggedInUser` and redirects to `/flashcards/dashboard.html`.
    - If not found, shows the `#loginError` modal, wires its close button, and auto-hides it after a timeout.
    - On load, if `loggedInUser` exists and the current URL includes `login.html`, immediately redirects to the dashboard.
    - Adds optional click handlers for `#signupLink` and `#loginLink` if they are present.
- `authfiles/auth.js`:
  - Legacy signup handler that stores a single username/password pair directly in `localStorage` using the username as the key.
  - It is **not wired up** by `login.html` or `signup.html` and appears to be a leftover from an earlier iteration.

Canonical current behavior is defined by `signupscript.js` and `loginscript.js`, not `auth.js`.

### Styling (`style.css`)

`style.css` is shared across all pages and defines:
- Global reset and color/typography variables.
- Fixed glassmorphism-style navigation bar and shared nav link styles.
- The 3D hero card, including `.card`, `.card-inner`, `.card-front`, `.card-back`, `.is-flipped`, and `.minortext` classes.
- `.cards-grid` and `.card` styles to reuse the hero card visual as dashboard tiles, including layout, animation, and delete button positioning.
- Login/signup layout (`.login-container`, `.signup-container`, `#login-form`, `#signup-form`, `.fields`), button styles, and input appearance.
- Modal styles for `userExist` and `loginError` overlays and their close buttons.

When changing card or auth behavior, keep in mind that many visual assumptions (e.g. `.card` height, `.cards-grid` layout, modal sizing) are centralized here.

## Notes for future Warp agents

- **Do not assume any backend or security guarantees.** All authentication and data storage is on the client via `localStorage`, intended for demo/learning rather than production security.
- If you introduce persistence for flashcards, the natural place to attach it is around `dashboard.js`'s card creation/deletion logic and the `flashcards` array on users stored in `localStorage`.
- Before removing `authfiles/auth.js`, confirm it is not referenced anywhere (currently it is unused).
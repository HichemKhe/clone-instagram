// ============= STATE MANAGEMENT =============
let currentUser = null;
let currentPhotos = [];
let currentPhotoId = null;

// ============= API CALLS =============
const API_BASE = 'http://localhost:5000/api';

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok && response.status === 401) {
      logout();
      throw new Error('Session expirée');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// ============= AUTHENTIFICATION =============
function toggleAuthForm() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  loginForm.classList.toggle('active');
  signupForm.classList.toggle('active');
}

document.getElementById('login').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    localStorage.setItem('token', data.token);
    currentUser = data.user;
    showFeed();
    loadPhotos();
  } catch (error) {
    alert('Erreur de connexion: ' + error.message);
  }
});

document.getElementById('signup').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  try {
    const data = await apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });

    localStorage.setItem('token', data.token);
    currentUser = data.user;
    showFeed();
    loadPhotos();
  } catch (error) {
    alert('Erreur d\'inscription: ' + error.message);
  }
});

function logout() {
  localStorage.removeItem('token');
  currentUser = null;
  showAuthPage();
  document.getElementById('login').reset();
  document.getElementById('signup').reset();
}

document.getElementById('logout-btn').addEventListener('click', logout);

// ============= NAVIGATION =============
function showAuthPage() {
  document.getElementById('auth-page').classList.add('active');
  document.getElementById('feed-page').classList.remove('active');
}

function showFeed() {
  document.getElementById('auth-page').classList.remove('active');
  document.getElementById('feed-page').classList.add('active');
  document.getElementById('username-display').textContent = currentUser.username;
}

// ============= PHOTOS / RECHERCHE =============
async function loadPhotos(query = '') {
  try {
    const grid = document.getElementById('photos-grid');
    grid.innerHTML = '<div class="loading"><div class="spinner"></div>Chargement...</div>';

    const data = await apiCall(`/photos?q=${encodeURIComponent(query)}&page=1`);
    currentPhotos = data.photos;

    grid.innerHTML = '';
    if (currentPhotos.length === 0) {
      grid.innerHTML = '<div class="error-message">Aucune photo trouvée</div>';
      return;
    }

    currentPhotos.forEach(photo => {
      const card = createPhotoCard(photo);
      grid.appendChild(card);
    });
  } catch (error) {
    console.error('Erreur chargement photos:', error);
    document.getElementById('photos-grid').innerHTML = 
      `<div class="error-message">Erreur lors du chargement des photos: ${error.message}</div>`;
  }
}

function createPhotoCard(photo) {
  const card = document.createElement('div');
  card.className = 'photo-card';
  card.innerHTML = `
    <img src="${photo.src}" alt="${photo.description}">
    <div class="photo-card-info">
      <p class="photo-card-title">${photo.description}</p>
      <p class="photo-card-author">Par ${photo.author}</p>
    </div>
  `;

  card.addEventListener('click', () => openModal(photo));
  return card;
}

document.getElementById('search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const query = document.getElementById('search-input').value;
  if (query.trim()) {
    loadPhotos(query);
  }
});

// ============= MODAL =============
const modal = document.getElementById('photo-modal');
const closeBtn = document.querySelector('.close');

function openModal(photo) {
  currentPhotoId = photo.id;

  // Images et infos
  document.getElementById('modal-image').src = photo.src_full;
  document.getElementById('modal-description').textContent = photo.description;
  document.getElementById('modal-author-name').textContent = photo.author;
  document.getElementById('modal-author-username').textContent = `@${photo.authorUsername}`;
  document.getElementById('modal-author-image').src = photo.authorImage;

  // Stats
  document.getElementById('modal-likes-count').textContent = photo.likes;
  document.getElementById('modal-comments-count').textContent = photo.comments;

  // Charger les commentaires
  loadComments(photo.id);

  // Vérifier si l'utilisateur a liké
  checkIfLiked(photo.id);

  modal.classList.add('show');
}

closeBtn.addEventListener('click', () => {
  modal.classList.remove('show');
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show');
  }
});

// ============= LIKES =============
async function checkIfLiked(photoId) {
  try {
    const data = await apiCall(`/likes/${photoId}`);
    const likeBtn = document.getElementById('modal-like-btn');

    // TODO: Vérifier si l'utilisateur actuel a liké (nécessite une modification du backend)
    // Pour maintenant, on just affiche le count
    document.getElementById('modal-likes-count').textContent = data.likes;
  } catch (error) {
    console.error('Erreur vérif like:', error);
  }
}

document.getElementById('modal-like-btn').addEventListener('click', async () => {
  if (!currentPhotoId) return;

  const likeBtn = document.getElementById('modal-like-btn');

  try {
    if (likeBtn.classList.contains('liked')) {
      // Unliker
      await apiCall(`/likes/${currentPhotoId}`, { method: 'DELETE' });
      likeBtn.classList.remove('liked');
      likeBtn.textContent = '❤️ Liker';
    } else {
      // Liker
      await apiCall('/likes', {
        method: 'POST',
        body: JSON.stringify({ photoId: currentPhotoId })
      });
      likeBtn.classList.add('liked');
      likeBtn.textContent = '❤️ Liké';
    }

    // Actualiser le count
    checkIfLiked(currentPhotoId);
  } catch (error) {
    alert('Erreur: ' + error.message);
  }
});

// ============= COMMENTAIRES =============
async function loadComments(photoId) {
  try {
    const data = await apiCall(`/comments/${photoId}`);
    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';

    data.comments.forEach(comment => {
      const commentEl = document.createElement('div');
      commentEl.className = 'comment';
      const isOwnComment = comment.userId === currentUser.id;

      commentEl.innerHTML = `
        <div class="comment-author">${comment.username}</div>
        <div class="comment-text">${comment.text}</div>
        <div class="comment-time">${formatDate(comment.createdAt)}</div>
        ${isOwnComment ? `<button class="comment-delete" data-id="${comment.id}">Supprimer</button>` : ''}
      `;

      if (isOwnComment) {
        const deleteBtn = commentEl.querySelector('.comment-delete');
        deleteBtn.addEventListener('click', () => deleteComment(comment.id));
      }

      commentsList.appendChild(commentEl);
    });
  } catch (error) {
    console.error('Erreur chargement commentaires:', error);
  }
}

document.getElementById('comment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const textarea = e.target.querySelector('textarea');
  const text = textarea.value.trim();

  if (!text || !currentPhotoId) return;

  try {
    await apiCall('/comments', {
      method: 'POST',
      body: JSON.stringify({ photoId: currentPhotoId, text })
    });

    textarea.value = '';
    loadComments(currentPhotoId);
    document.getElementById('modal-comments-count').textContent = 
      parseInt(document.getElementById('modal-comments-count').textContent) + 1;
  } catch (error) {
    alert('Erreur: ' + error.message);
  }
});

async function deleteComment(commentId) {
  if (!confirm('Supprimer ce commentaire ?')) return;

  try {
    await apiCall(`/comments/${commentId}`, { method: 'DELETE' });
    loadComments(currentPhotoId);
    document.getElementById('modal-comments-count').textContent = 
      Math.max(0, parseInt(document.getElementById('modal-comments-count').textContent) - 1);
  } catch (error) {
    alert('Erreur: ' + error.message);
  }
}

// ============= UTILITAIRES =============
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return 'À l\'instant';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h';
  if (diff < 2592000000) return Math.floor(diff / 86400000) + 'd';

  return date.toLocaleDateString('fr-FR');
}

// ============= INIT =============
async function init() {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const data = await apiCall('/auth/me');
      currentUser = data.user;
      showFeed();
      loadPhotos();
    } catch (error) {
      logout();
    }
  } else {
    showAuthPage();
  }
}

// Démarrer l'app
document.addEventListener('DOMContentLoaded', init);

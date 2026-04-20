// ==================== API Configuration ====================
const API_BASE = '/api';

// ==================== Utility Functions ====================
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function truncateText(text, maxLength = 150) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

function getAuthToken() {
  return localStorage.getItem('adminToken');
}

function setAuthToken(token) {
  localStorage.setItem('adminToken', token);
}

function clearAuthToken() {
  localStorage.removeItem('adminToken');
}

function isLoggedIn() {
  return !!getAuthToken();
}

// ==================== API Functions ====================
async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  // Use cookie-based auth (httpOnly cookie) by including credentials
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include'
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  
  return response.json();
}

// Posts API
async function getPosts() {
  return apiRequest('/posts');
}

async function getPost(id) {
  return apiRequest(`/posts/${id}`);
}

async function getPostsByGroup(groupId) {
  return apiRequest(`/posts/group/${groupId}`);
}

async function createPost(data) {
  return apiRequest('/posts', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function deletePost(id) {
  return apiRequest(`/posts/${id}`, { method: 'DELETE' });
}

// Groups API
async function getGroups() {
  return apiRequest('/groups');
}

async function getGroup(id) {
  return apiRequest(`/groups/${id}`);
}

async function createGroup(data) {
  return apiRequest('/groups', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function deleteGroup(id) {
  return apiRequest(`/groups/${id}`, { method: 'DELETE' });
}

// Comments API
async function getComments(postId) {
  return apiRequest(`/comments/${postId}`);
}

async function getAllComments() {
  return apiRequest('/comments');
}

async function createComment(data) {
  return apiRequest('/comments', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function deleteComment(id) {
  return apiRequest(`/comments/${id}`, { method: 'DELETE' });
}

// Messages API
async function sendMessage(data) {
  return apiRequest('/messages', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function getMessages() {
  return apiRequest('/messages');
}

async function deleteMessage(id) {
  return apiRequest(`/messages/${id}`, { method: 'DELETE' });
}

// Admin API
async function adminLogin(username, password) {
  return apiRequest('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

async function adminLogout() {
  return apiRequest('/admin/logout', { method: 'POST' });
}

async function addAdmin(username, password) {
  return apiRequest('/admin/add', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

async function removeAdmin(username) {
  return apiRequest('/admin/remove', {
    method: 'POST',
    body: JSON.stringify({ username })
  });
}

async function changePassword(currentPassword, newPassword) {
  return apiRequest('/admin/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword })
  });
}

async function getAdmins() {
  return apiRequest('/admin/list');
}

async function validateToken() {
  try {
    await apiRequest('/admin/validate');
    return true;
  } catch {
    return false;
  }
}

// ==================== Notification System ====================
function showNotification(message, type = 'success') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  const span = document.createElement('span');
  span.className = 'notification-message';
  span.textContent = message;
  notification.appendChild(span);
  document.body.appendChild(notification);

  requestAnimationFrame(() => notification.classList.add('show'));

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ==================== Loading State ====================
function showLoading(container) {
  container.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'loading';
  const spinner = document.createElement('div');
  spinner.className = 'loading-spinner';
  wrapper.appendChild(spinner);
  container.appendChild(wrapper);
}

function showEmpty(container, message = 'No items found') {
  container.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'empty-state';
  const icon = document.createElement('div');
  icon.className = 'empty-state-icon';
  icon.textContent = '📭';
  const p = document.createElement('p');
  p.className = 'empty-state-text';
  p.textContent = message;
  wrapper.appendChild(icon);
  wrapper.appendChild(p);
  container.appendChild(wrapper);
}

// ==================== Navigation ====================
function initNavigation() {
  const toggle = document.querySelector('.navbar-toggle');
  const links = document.querySelector('.navbar-links');
  
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
    });
    
    // Close menu on link click
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('active');
      });
    });
  }
  
  // Set active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ==================== Post Card Rendering ====================
function createPostCard(post) {
  const card = document.createElement('article');
  card.className = 'post-card';
  card.addEventListener('click', () => { window.location.href = `post.html?id=${post.id}`; });

  if (post.image) {
    const img = document.createElement('img');
    img.src = post.image;
    img.alt = post.title || '';
    img.className = 'post-card-image';
    img.loading = 'lazy';
    card.appendChild(img);
  }

  const content = document.createElement('div');
  content.className = 'post-card-content';

  const groupSpan = document.createElement('span');
  groupSpan.className = 'post-card-group';
  groupSpan.textContent = post.groupName || '';

  const h2 = document.createElement('h2');
  h2.className = 'post-card-title';
  h2.textContent = post.title || '';

  const preview = document.createElement('p');
  preview.className = 'post-card-preview';
  preview.textContent = truncateText(post.content || '');

  const timeEl = document.createElement('time');
  timeEl.className = 'post-card-date';
  timeEl.textContent = formatDate(post.createdAt);

  content.appendChild(groupSpan);
  content.appendChild(h2);
  content.appendChild(preview);
  content.appendChild(timeEl);
  card.appendChild(content);

  return card;
}

// ==================== Group Card Rendering ====================
function createGroupCard(group) {
  const card = document.createElement('div');
  card.className = 'group-card';
  card.addEventListener('click', () => { window.location.href = `group.html?id=${group.id}`; });

  const h3 = document.createElement('h3');
  h3.className = 'group-card-name';
  h3.textContent = group.name || '';

  const p = document.createElement('p');
  p.className = 'group-card-description';
  p.textContent = group.description || 'No description';

  card.appendChild(h3);
  card.appendChild(p);
  return card;
}

// ==================== Comment Rendering ====================
function createCommentElement(comment) {
  const el = document.createElement('div');
  el.className = 'comment';
  const p = document.createElement('p');
  p.className = 'comment-text';
  p.textContent = comment.text || '';
  const timeEl = document.createElement('time');
  timeEl.className = 'comment-date';
  timeEl.textContent = formatDate(comment.createdAt);
  el.appendChild(p);
  el.appendChild(timeEl);
  return el;
}

// ==================== Initialize on DOM Load ====================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
});

// Export for use in other scripts
window.Community = {
  // API
  getPosts,
  getPost,
  getPostsByGroup,
  createPost,
  deletePost,
  getGroups,
  getGroup,
  createGroup,
  deleteGroup,
  getComments,
  getAllComments,
  createComment,
  deleteComment,
  sendMessage,
  getMessages,
  deleteMessage,
  adminLogin,
  adminLogout,
  addAdmin,
  removeAdmin,
  changePassword,
  getAdmins,
  validateToken,
  
  // Auth
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  isLoggedIn,
  
  // UI
  showNotification,
  showLoading,
  showEmpty,
  createPostCard,
  createGroupCard,
  createCommentElement,
  
  // Utils
  formatDate,
  truncateText
};

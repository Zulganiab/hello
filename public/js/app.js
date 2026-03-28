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
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
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
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `<span class="notification-message">${message}</span>`;
  document.body.appendChild(notification);
  
  // Trigger animation
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });
  
  // Auto remove
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ==================== Loading State ====================
function showLoading(container) {
  container.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
    </div>
  `;
}

function showEmpty(container, message = 'No items found') {
  container.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon">📭</div>
      <p class="empty-state-text">${message}</p>
    </div>
  `;
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
  card.onclick = () => window.location.href = `post.html?id=${post.id}`;
  
  card.innerHTML = `
    ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-card-image" loading="lazy">` : ''}
    <div class="post-card-content">
      <span class="post-card-group">${post.groupName}</span>
      <h2 class="post-card-title">${post.title}</h2>
      <p class="post-card-preview">${truncateText(post.content)}</p>
      <time class="post-card-date">${formatDate(post.createdAt)}</time>
    </div>
  `;
  
  return card;
}

// ==================== Group Card Rendering ====================
function createGroupCard(group) {
  const card = document.createElement('div');
  card.className = 'group-card';
  card.onclick = () => window.location.href = `group.html?id=${group.id}`;
  
  card.innerHTML = `
    <h3 class="group-card-name">${group.name}</h3>
    <p class="group-card-description">${group.description || 'No description'}</p>
  `;
  
  return card;
}

// ==================== Comment Rendering ====================
function createCommentElement(comment) {
  const el = document.createElement('div');
  el.className = 'comment';
  
  el.innerHTML = `
    <p class="comment-text">${comment.text}</p>
    <time class="comment-date">${formatDate(comment.createdAt)}</time>
  `;
  
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

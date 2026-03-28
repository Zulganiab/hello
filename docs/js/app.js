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

// ...rest of JS omitted for brevity...

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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api'

async function request(path, options = {}){
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'include', headers: { 'Content-Type':'application/json' }, ...options })
  if (!res.ok) {
    const err = await res.json().catch(()=>({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  return res.json().catch(()=>null)
}

export const api = {
  getPosts: () => request('/posts'),
  getPost: (id) => request(`/posts/${id}`),
  createPost: (data) => request('/posts', { method: 'POST', body: JSON.stringify(data) }),
  deletePost: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
  getGroups: () => request('/groups'),
  adminLogin: (u,p) => request('/admin/login', { method: 'POST', body: JSON.stringify({ username: u, password: p }) }),
  adminLogout: () => request('/admin/logout', { method: 'POST' }),
  addAdmin: (username, password) => request('/admin/add', { method: 'POST', body: JSON.stringify({ username, password }) }),
  getAdmins: () => request('/admin/list'),
  removeAdmin: (username) => request('/admin/remove', { method: 'POST', body: JSON.stringify({ username }) }),
  // Projects
  getProjects: () => request('/projects'),
  getProject: (id) => request(`/projects/${id}`),
  createProject: (data) => request('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id, data) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
  // Members
  getMembers: () => request('/members'),
  addMember: (data) => request('/members', { method: 'POST', body: JSON.stringify(data) }),
  updateMember: (id, data) => request(`/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMember: (id) => request(`/members/${id}`, { method: 'DELETE' }),
  getComments: (postId) => request(`/comments/${postId}`),
  createComment: (data) => request('/comments', { method: 'POST', body: JSON.stringify(data) }),
}

export default api

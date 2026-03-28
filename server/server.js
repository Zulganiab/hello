import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '../public')));

// Data paths
const DATA_DIR = join(__dirname, '../data');
const POSTS_FILE = join(DATA_DIR, 'posts.json');
const GROUPS_FILE = join(DATA_DIR, 'groups.json');
const COMMENTS_FILE = join(DATA_DIR, 'comments.json');
const MESSAGES_FILE = join(DATA_DIR, 'messages.json');
const ADMINS_FILE = join(DATA_DIR, 'admins.json');
const SESSIONS_FILE = join(DATA_DIR, 'sessions.json');

// Helper functions
async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Session management
async function createSession(adminId) {
  const sessions = await readJSON(SESSIONS_FILE);
  const token = crypto.randomBytes(32).toString('hex');
  const session = {
    token,
    adminId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  };
  sessions.push(session);
  await writeJSON(SESSIONS_FILE, sessions);
  return token;
}

async function validateSession(token) {
  if (!token) return null;
  const sessions = await readJSON(SESSIONS_FILE);
  const session = sessions.find(s => s.token === token && new Date(s.expiresAt) > new Date());
  return session;
}

// Auth middleware
async function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const session = await validateSession(token);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  req.adminId = session.adminId;
  next();
}

// ==================== POSTS API ====================

// GET all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await readJSON(POSTS_FILE);
    const groups = await readJSON(GROUPS_FILE);
    const postsWithGroups = posts.map(post => ({
      ...post,
      groupName: groups.find(g => g.id === post.groupId)?.name || 'Unknown'
    }));
    res.json(postsWithGroups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET single post
app.get('/api/posts/:id', async (req, res) => {
  try {
    const posts = await readJSON(POSTS_FILE);
    const groups = await readJSON(GROUPS_FILE);
    const post = posts.find(p => p.id === req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({
      ...post,
      groupName: groups.find(g => g.id === post.groupId)?.name || 'Unknown'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// GET posts by group
app.get('/api/posts/group/:groupId', async (req, res) => {
  try {
    const posts = await readJSON(POSTS_FILE);
    const groups = await readJSON(GROUPS_FILE);
    const groupPosts = posts.filter(p => p.groupId === req.params.groupId);
    const postsWithGroups = groupPosts.map(post => ({
      ...post,
      groupName: groups.find(g => g.id === post.groupId)?.name || 'Unknown'
    }));
    res.json(postsWithGroups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// POST create post (admin only)
app.post('/api/posts', requireAdmin, async (req, res) => {
  try {
    const { title, content, image, groupId } = req.body;
    if (!title || !content || !groupId) {
      return res.status(400).json({ error: 'Title, content, and group are required' });
    }
    const posts = await readJSON(POSTS_FILE);
    const newPost = {
      id: crypto.randomUUID(),
      title,
      content,
      image: image || '',
      groupId,
      createdAt: new Date().toISOString()
    };
    posts.push(newPost);
    await writeJSON(POSTS_FILE, posts);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// DELETE post (admin only)
app.delete('/api/posts/:id', requireAdmin, async (req, res) => {
  try {
    const posts = await readJSON(POSTS_FILE);
    const filteredPosts = posts.filter(p => p.id !== req.params.id);
    if (filteredPosts.length === posts.length) {
      return res.status(404).json({ error: 'Post not found' });
    }
    await writeJSON(POSTS_FILE, filteredPosts);
    
    // Also delete associated comments
    const comments = await readJSON(COMMENTS_FILE);
    const filteredComments = comments.filter(c => c.postId !== req.params.id);
    await writeJSON(COMMENTS_FILE, filteredComments);
    
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// ==================== GROUPS API ====================

// GET all groups
app.get('/api/groups', async (req, res) => {
  try {
    const groups = await readJSON(GROUPS_FILE);
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// GET single group
app.get('/api/groups/:id', async (req, res) => {
  try {
    const groups = await readJSON(GROUPS_FILE);
    const group = groups.find(g => g.id === req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

// POST create group (admin only)
app.post('/api/groups', requireAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Group name is required' });
    }
    const groups = await readJSON(GROUPS_FILE);
    const newGroup = {
      id: crypto.randomUUID(),
      name,
      description: description || '',
      createdAt: new Date().toISOString()
    };
    groups.push(newGroup);
    await writeJSON(GROUPS_FILE, groups);
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group' });
  }
});

// DELETE group (admin only)
app.delete('/api/groups/:id', requireAdmin, async (req, res) => {
  try {
    const groups = await readJSON(GROUPS_FILE);
    const filteredGroups = groups.filter(g => g.id !== req.params.id);
    if (filteredGroups.length === groups.length) {
      return res.status(404).json({ error: 'Group not found' });
    }
    await writeJSON(GROUPS_FILE, filteredGroups);
    res.json({ message: 'Group deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

// ==================== COMMENTS API ====================

// GET comments for a post
app.get('/api/comments/:postId', async (req, res) => {
  try {
    const comments = await readJSON(COMMENTS_FILE);
    const postComments = comments.filter(c => c.postId === req.params.postId);
    res.json(postComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// GET all comments (admin only)
app.get('/api/comments', requireAdmin, async (req, res) => {
  try {
    const comments = await readJSON(COMMENTS_FILE);
    const posts = await readJSON(POSTS_FILE);
    const commentsWithPosts = comments.map(comment => ({
      ...comment,
      postTitle: posts.find(p => p.id === comment.postId)?.title || 'Unknown Post'
    }));
    res.json(commentsWithPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST create comment (anonymous)
app.post('/api/comments', async (req, res) => {
  try {
    const { postId, text } = req.body;
    if (!postId || !text) {
      return res.status(400).json({ error: 'Post ID and text are required' });
    }
    const comments = await readJSON(COMMENTS_FILE);
    const newComment = {
      id: crypto.randomUUID(),
      postId,
      text,
      createdAt: new Date().toISOString()
    };
    comments.push(newComment);
    await writeJSON(COMMENTS_FILE, comments);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// DELETE comment (admin only)
app.delete('/api/comments/:id', requireAdmin, async (req, res) => {
  try {
    const comments = await readJSON(COMMENTS_FILE);
    const filteredComments = comments.filter(c => c.id !== req.params.id);
    if (filteredComments.length === comments.length) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    await writeJSON(COMMENTS_FILE, filteredComments);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// ==================== MESSAGES API ====================

// POST support message
app.post('/api/messages', async (req, res) => {
  try {
    const { name, message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const messages = await readJSON(MESSAGES_FILE);
    const newMessage = {
      id: crypto.randomUUID(),
      name: name || 'Anonymous',
      message,
      createdAt: new Date().toISOString()
    };
    messages.push(newMessage);
    await writeJSON(MESSAGES_FILE, messages);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// GET messages (admin only)
app.get('/api/messages', requireAdmin, async (req, res) => {
  try {
    const messages = await readJSON(MESSAGES_FILE);
    res.json(messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// DELETE message (admin only)
app.delete('/api/messages/:id', requireAdmin, async (req, res) => {
  try {
    const messages = await readJSON(MESSAGES_FILE);
    const filteredMessages = messages.filter(m => m.id !== req.params.id);
    if (filteredMessages.length === messages.length) {
      return res.status(404).json({ error: 'Message not found' });
    }
    await writeJSON(MESSAGES_FILE, filteredMessages);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ==================== ADMIN API ====================

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admins = await readJSON(ADMINS_FILE);
    const admin = admins.find(a => a.username === username && a.password === password);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = await createSession(admin.id);
    res.json({ token, username: admin.username });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin logout
app.post('/api/admin/logout', requireAdmin, async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const sessions = await readJSON(SESSIONS_FILE);
    const filteredSessions = sessions.filter(s => s.token !== token);
    await writeJSON(SESSIONS_FILE, filteredSessions);
    res.json({ message: 'Logged out' });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Add admin (admin only)
app.post('/api/admin/add', requireAdmin, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const admins = await readJSON(ADMINS_FILE);
    if (admins.find(a => a.username === username)) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    const newAdmin = {
      id: crypto.randomUUID(),
      username,
      password,
      createdAt: new Date().toISOString()
    };
    admins.push(newAdmin);
    await writeJSON(ADMINS_FILE, admins);
    res.status(201).json({ id: newAdmin.id, username: newAdmin.username });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add admin' });
  }
});

// Remove admin (admin only)
app.post('/api/admin/remove', requireAdmin, async (req, res) => {
  try {
    const { username } = req.body;
    const admins = await readJSON(ADMINS_FILE);
    if (admins.length <= 1) {
      return res.status(400).json({ error: 'Cannot remove the last admin' });
    }
    const filteredAdmins = admins.filter(a => a.username !== username);
    if (filteredAdmins.length === admins.length) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    await writeJSON(ADMINS_FILE, filteredAdmins);
    res.json({ message: 'Admin removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove admin' });
  }
});

// Change password (admin only)
app.post('/api/admin/change-password', requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new passwords are required' });
    }
    const admins = await readJSON(ADMINS_FILE);
    const adminIndex = admins.findIndex(a => a.id === req.adminId);
    if (adminIndex === -1 || admins[adminIndex].password !== currentPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    admins[adminIndex].password = newPassword;
    await writeJSON(ADMINS_FILE, admins);
    res.json({ message: 'Password changed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Get all admins (admin only)
app.get('/api/admin/list', requireAdmin, async (req, res) => {
  try {
    const admins = await readJSON(ADMINS_FILE);
    res.json(admins.map(a => ({ id: a.id, username: a.username })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
});

// Validate token
app.get('/api/admin/validate', requireAdmin, async (req, res) => {
  res.json({ valid: true });
});

// Serve frontend pages
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

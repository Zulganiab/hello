import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(express.static(join(__dirname, '../public')));

// Basic rate limiter (quick win)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // limit each IP to 120 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', apiLimiter);

// Data paths
const DATA_DIR = join(__dirname, '../data');
const POSTS_FILE = join(DATA_DIR, 'posts.json');
const GROUPS_FILE = join(DATA_DIR, 'groups.json');
const COMMENTS_FILE = join(DATA_DIR, 'comments.json');
const MESSAGES_FILE = join(DATA_DIR, 'messages.json');
const ADMINS_FILE = join(DATA_DIR, 'admins.json');
const SESSIONS_FILE = join(DATA_DIR, 'sessions.json');
const PROJECTS_FILE = join(DATA_DIR, 'projects.json');
const MEMBERS_FILE = join(DATA_DIR, 'members.json');

// Migrate plaintext admin passwords to bcrypt hashes on startup
async function migrateAdminPasswords() {
  try {
    const admins = await readJSON(ADMINS_FILE);
    let changed = false;
    const migrated = admins.map(a => {
      if (a && typeof a.password === 'string' && !a.password.startsWith('$2')) {
        // Hash plaintext password
        a.password = bcrypt.hashSync(a.password, 10);
        changed = true;
      }
      return a;
    });
    if (changed) {
      await writeJSON(ADMINS_FILE, migrated);
      console.log('Migrated plaintext admin passwords to bcrypt hashes');
    }
  } catch (err) {
    console.error('Failed to migrate admin passwords', err);
  }
}

// Helper functions
async function readJSON(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    // If file does not exist, return empty array. If it exists but cannot be parsed, surface the error.
    try {
      await fs.access(filePath);
      console.error(`Failed to parse JSON file: ${filePath}`, err);
      throw err;
    } catch (_) {
      return [];
    }
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
  // Support token via Authorization header or httpOnly cookie named 'session'
  const headerToken = req.headers.authorization?.replace('Bearer ', '') || null;
  const cookieToken = req.cookies?.session || null;
  const token = headerToken || cookieToken;
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

// ==================== PROJECTS API ====================

// GET all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await readJSON(PROJECTS_FILE);
    res.json(projects.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const projects = await readJSON(PROJECTS_FILE);
    const project = projects.find(p => p.id === req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// POST create project (admin only)
app.post('/api/projects', requireAdmin, async (req, res) => {
  try {
    const { title, description, image, glbUrl } = req.body;
    if (!title || !description) return res.status(400).json({ error: 'Title and description required' });
    const projects = await readJSON(PROJECTS_FILE);
    const newProject = { id: crypto.randomUUID(), title, description, image: image||'', glbUrl: glbUrl||'', createdAt: new Date().toISOString() };
    projects.push(newProject);
    await writeJSON(PROJECTS_FILE, projects);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// PUT update project (admin only)
app.put('/api/projects/:id', requireAdmin, async (req, res) => {
  try {
    const projects = await readJSON(PROJECTS_FILE);
    const idx = projects.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Project not found' });
    const updated = { ...projects[idx], ...req.body };
    projects[idx] = updated;
    await writeJSON(PROJECTS_FILE, projects);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// DELETE project (admin only)
app.delete('/api/projects/:id', requireAdmin, async (req, res) => {
  try {
    const projects = await readJSON(PROJECTS_FILE);
    const filtered = projects.filter(p => p.id !== req.params.id);
    if (filtered.length === projects.length) return res.status(404).json({ error: 'Project not found' });
    await writeJSON(PROJECTS_FILE, filtered);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ==================== MEMBERS API ====================

// GET members
app.get('/api/members', async (req, res) => {
  try {
    const members = await readJSON(MEMBERS_FILE);
    res.json(members.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// POST add member (admin only)
app.post('/api/members', requireAdmin, async (req, res) => {
  try {
    const { name, role, bio, avatar } = req.body;
    if (!name || !role) return res.status(400).json({ error: 'Name and role required' });
    const members = await readJSON(MEMBERS_FILE);
    const newMember = { id: crypto.randomUUID(), name, role, bio: bio||'', avatar: avatar||'', createdAt: new Date().toISOString() };
    members.push(newMember);
    await writeJSON(MEMBERS_FILE, members);
    res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// PUT update member (admin only)
app.put('/api/members/:id', requireAdmin, async (req, res) => {
  try {
    const members = await readJSON(MEMBERS_FILE);
    const idx = members.findIndex(m => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Member not found' });
    members[idx] = { ...members[idx], ...req.body };
    await writeJSON(MEMBERS_FILE, members);
    res.json(members[idx]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update member' });
  }
});

// DELETE member (admin only)
app.delete('/api/members/:id', requireAdmin, async (req, res) => {
  try {
    const members = await readJSON(MEMBERS_FILE);
    const filtered = members.filter(m => m.id !== req.params.id);
    if (filtered.length === members.length) return res.status(404).json({ error: 'Member not found' });
    await writeJSON(MEMBERS_FILE, filtered);
    res.json({ message: 'Member deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

// ==================== ADMIN API ====================

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admins = await readJSON(ADMINS_FILE);
    const admin = admins.find(a => a.username === username);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Compare hashed password
    const match = bcrypt.compareSync(password, admin.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = await createSession(admin.id);
    // Set httpOnly cookie for session token (development: secure=false)
    res.cookie('session', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    });
    res.json({ username: admin.username });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Admin logout
app.post('/api/admin/logout', requireAdmin, async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies?.session;
    const sessions = await readJSON(SESSIONS_FILE);
    const filteredSessions = sessions.filter(s => s.token !== token);
    await writeJSON(SESSIONS_FILE, filteredSessions);
    // Clear cookie
    res.clearCookie('session');
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
      password: bcrypt.hashSync(password, 10),
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
    if (adminIndex === -1) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    const storedHash = admins[adminIndex].password;
    const match = bcrypt.compareSync(currentPassword, storedHash);
    if (!match) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    admins[adminIndex].password = bcrypt.hashSync(newPassword, 10);
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

;(async () => {
  try {
    await migrateAdminPasswords();
  } catch (err) {
    console.error('Error during admin migration', err);
  }
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})()

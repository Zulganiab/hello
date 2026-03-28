import express from 'express';const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Data files
const postsFile = path.join(__dirname, 'data/posts.json');
const groupsFile = path.join(__dirname, 'data/groups.json');

// Helper functions
function readData(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}

function writeData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ================= POSTS =================

// GET all posts
app.get('/posts', (req, res) => {
  const posts = readData(postsFile);
  res.json(posts);
});

// CREATE post
app.post('/posts', (req, res) => {
  const posts = readData(postsFile);
  
  const newPost = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date()
  };
  
  posts.push(newPost);
  writeData(postsFile, posts);
  
  res.json(newPost);
});

// DELETE post
app.delete('/posts/:id', (req, res) => {
  let posts = readData(postsFile);
  posts = posts.filter(p => p.id !== req.params.id);
  writeData(postsFile, posts);
  res.json({ success: true });
});

// ================= GROUPS =================

// GET groups
app.get('/groups', (req, res) => {
  const groups = readData(groupsFile);
  res.json(groups);
});

// CREATE group
app.post('/groups', (req, res) => {
  const groups = readData(groupsFile);
  
  const newGroup = {
    id: Date.now().toString(),
    ...req.body
  };
  
  groups.push(newGroup);
  writeData(groupsFile, groups);
  
  res.json(newGroup);
});

// DELETE group
app.delete('/groups/:id', (req, res) => {
  let groups = readData(groupsFile);
  groups = groups.filter(g => g.id !== req.params.id);
  writeData(groupsFile, groups);
  res.json({ success: true });
});

// ================= START SERVER =================

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
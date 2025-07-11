const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Visitor tracking data file
const STATS_FILE = path.join(__dirname, 'visitor-stats.json');
const COMMENTS_FILE = path.join(__dirname, 'comments.json');

// Initialize stats file if it doesn't exist
if (!fs.existsSync(STATS_FILE)) {
  const initialStats = {
    totalVisits: 0,
    lastUpdated: new Date().toISOString()
  };
  fs.writeFileSync(STATS_FILE, JSON.stringify(initialStats, null, 2));
}

// Initialize comments file if it doesn't exist
if (!fs.existsSync(COMMENTS_FILE)) {
  const initialComments = {
    comments: [],
    lastUpdated: new Date().toISOString()
  };
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(initialComments, null, 2));
}

// Helper functions for visitor tracking
function readStats() {
  try {
    const data = fs.readFileSync(STATS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading stats:', error);
    return { totalVisits: 0, lastUpdated: new Date().toISOString() };
  }
}

function writeStats(stats) {
  try {
    stats.lastUpdated = new Date().toISOString();
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
  } catch (error) {
    console.error('Error writing stats:', error);
  }
}

// Generate simple session ID
function generateSessionId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Middleware for visitor tracking
app.use(express.json());

// Track page visit
app.use((req, res, next) => {
  // Only track main page visits
  if (req.path === '/' || req.path === '/index.html') {
    const stats = readStats();
    const sessionId = req.headers['x-session-id'] || generateSessionId();
    
    // Check if this is a new session
    const hasVisited = req.headers['x-session-id'];
    
    // Only increment total visits for new sessions
    if (!hasVisited) {
      stats.totalVisits++;
      writeStats(stats);
    }
    
    // Set session ID in response header
    res.setHeader('X-Session-ID', sessionId);
  }
  next();
});

// API endpoint to get visitor stats
app.get('/api/stats', (req, res) => {
  const stats = readStats();
  
  res.json({
    totalVisits: stats.totalVisits,
    lastUpdated: stats.lastUpdated
  });
});

// Helper functions for comments
function readComments() {
  try {
    const data = fs.readFileSync(COMMENTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading comments:', error);
    return { comments: [], lastUpdated: new Date().toISOString() };
  }
}

function writeComments(commentsData) {
  try {
    commentsData.lastUpdated = new Date().toISOString();
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(commentsData, null, 2));
  } catch (error) {
    console.error('Error writing comments:', error);
  }
}

function generateCommentId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Basic content filter
function filterContent(text) {
  if (!text || typeof text !== 'string') return '';
  
  // Remove HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Basic profanity filter (add more words as needed)
  const badWords = ['spam', 'hate', 'abuse']; // Add more as needed
  badWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    text = text.replace(regex, '*'.repeat(word.length));
  });
  
  return text.trim();
}

// API endpoint to get comments
app.get('/api/comments', (req, res) => {
  const commentsData = readComments();
  // Sort comments by date (newest first)
  const sortedComments = commentsData.comments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  res.json({
    comments: sortedComments,
    total: sortedComments.length,
    lastUpdated: commentsData.lastUpdated
  });
});

// API endpoint to add a comment
app.post('/api/comments', (req, res) => {
  const { message, nickname } = req.body;
  
  if (!message || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  if (message.length > 500) {
    return res.status(400).json({ error: 'Message too long (max 500 characters)' });
  }
  
  const commentsData = readComments();
  
  const newComment = {
    id: generateCommentId(),
    message: filterContent(message),
    nickname: filterContent(nickname) || 'Anonymous',
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress || 'Unknown'
  };
  
  commentsData.comments.push(newComment);
  writeComments(commentsData);
  
  res.json({ success: true, comment: newComment });
});

// Serve static files from the root directory
app.use(express.static('.'));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve comments page
app.get('/comments', (req, res) => {
  res.sendFile(path.join(__dirname, 'comments.html'));
});

// Handle all other routes by serving index.html (for SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Mental Calculation Practice app running on port ${PORT}`);
  console.log('Visitor tracking enabled');
});
  res.sendFile(path.join(__dirname, 'index.html'));
// Serve comments page
app.get('/comments', (req, res) => {
  res.sendFile(path.join(__dirname, 'comments.html'));
});

// Handle all other routes by serving index.html (for SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Mental Calculation Practice app running on port ${PORT}`);
  console.log('Visitor tracking enabled');
});
  
  commentsData.comments.push(newComment);
  writeComments(commentsData);
  
  res.json({ success: true, comment: newComment });

// Serve static files from the root directory
app.use(express.static('.'));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve comments page
app.get('/comments', (req, res) => {
  res.sendFile(path.join(__dirname, 'comments.html'));
});

// Handle all other routes by serving index.html (for SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Mental Calculation Practice app running on port ${PORT}`);
  console.log('Visitor tracking enabled');
});

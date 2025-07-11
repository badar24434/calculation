const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Visitor tracking data file
const STATS_FILE = path.join(__dirname, 'visitor-stats.json');

// Initialize stats file if it doesn't exist
if (!fs.existsSync(STATS_FILE)) {
  const initialStats = {
    totalVisits: 0,
    activeUsers: {},
    lastUpdated: new Date().toISOString()
  };
  fs.writeFileSync(STATS_FILE, JSON.stringify(initialStats, null, 2));
}

// Helper functions for visitor tracking
function readStats() {
  try {
    const data = fs.readFileSync(STATS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading stats:', error);
    return { totalVisits: 0, activeUsers: {}, lastUpdated: new Date().toISOString() };
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

function cleanupInactiveUsers() {
  const stats = readStats();
  const now = Date.now();
  const TIMEOUT = 5 * 60 * 1000; // 5 minutes timeout
  
  Object.keys(stats.activeUsers).forEach(sessionId => {
    if (now - stats.activeUsers[sessionId].lastSeen > TIMEOUT) {
      delete stats.activeUsers[sessionId];
    }
  });
  
  writeStats(stats);
}

// Cleanup inactive users every minute
setInterval(cleanupInactiveUsers, 60000);

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
    
    // If new session, increment total visits
    if (!stats.activeUsers[sessionId]) {
      stats.totalVisits++;
    }
    
    // Update active user
    stats.activeUsers[sessionId] = {
      lastSeen: Date.now(),
      userAgent: req.get('User-Agent') || 'Unknown',
      ip: req.ip || req.connection.remoteAddress || 'Unknown'
    };
    
    writeStats(stats);
    
    // Set session ID in response header
    res.setHeader('X-Session-ID', sessionId);
  }
  next();
});

// API endpoint to get visitor stats
app.get('/api/stats', (req, res) => {
  const stats = readStats();
  const activeUserCount = Object.keys(stats.activeUsers).length;
  
  res.json({
    totalVisits: stats.totalVisits,
    currentlyViewing: activeUserCount,
    lastUpdated: stats.lastUpdated
  });
});

// API endpoint to update user activity (heartbeat)
app.post('/api/heartbeat', (req, res) => {
  const sessionId = req.headers['x-session-id'];
  
  if (sessionId) {
    const stats = readStats();
    if (stats.activeUsers[sessionId]) {
      stats.activeUsers[sessionId].lastSeen = Date.now();
      writeStats(stats);
    }
  }
  
  res.json({ success: true });
});

// Serve static files from the root directory
app.use(express.static('.'));

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle all other routes by serving index.html (for SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Mental Calculation Practice app running on port ${PORT}`);
  console.log('Visitor tracking enabled');
});

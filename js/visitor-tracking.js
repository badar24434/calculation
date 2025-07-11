class VisitorTracker {
  constructor() {
    this.sessionId = null;
    this.heartbeatInterval = null;
    this.init();
  }

  async init() {
    // Get session ID from server response or storage
    this.sessionId = localStorage.getItem('sessionId') || this.generateSessionId();
    localStorage.setItem('sessionId', this.sessionId);

    // Load initial stats
    await this.updateStats();

    // Start heartbeat to maintain active status
    this.startHeartbeat();

    // Update stats every 30 seconds
    setInterval(() => this.updateStats(), 30000);
  }

  generateSessionId() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  async updateStats() {
    try {
      const response = await fetch('/api/stats', {
        headers: {
          'X-Session-ID': this.sessionId
        }
      });
      
      if (response.ok) {
        const stats = await response.json();
        this.displayStats(stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  async sendHeartbeat() {
    try {
      await fetch('/api/heartbeat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': this.sessionId
        }
      });
    } catch (error) {
      console.error('Error sending heartbeat:', error);
    }
  }

  startHeartbeat() {
    // Send heartbeat every 1 minute to maintain active status
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 60000);

    // Send initial heartbeat
    this.sendHeartbeat();
  }

  displayStats(stats) {
    const totalVisitsEl = document.getElementById('totalVisits');
    const currentlyViewingEl = document.getElementById('currentlyViewing');

    if (totalVisitsEl) {
      totalVisitsEl.textContent = stats.totalVisits.toLocaleString();
    }

    if (currentlyViewingEl) {
      const viewerText = stats.currentlyViewing === 1 ? 'person' : 'people';
      currentlyViewingEl.textContent = `${stats.currentlyViewing} ${viewerText}`;
    }
  }

  cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }
}

// Initialize visitor tracking when page loads
document.addEventListener('DOMContentLoaded', () => {
  const tracker = new VisitorTracker();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    tracker.cleanup();
  });
});

class CommentsManager {
  constructor() {
    this.initializeElements();
    this.bindEvents();
    this.loadComments();
  }

  initializeElements() {
    this.commentForm = document.getElementById('commentForm');
    this.nicknameInput = document.getElementById('nickname');
    this.messageTextarea = document.getElementById('message');
    this.charCount = document.getElementById('charCount');
    this.submitBtn = document.getElementById('submitComment');
    this.refreshBtn = document.getElementById('refreshBtn');
    this.commentCount = document.getElementById('commentCount');
    this.commentsContainer = document.getElementById('commentsContainer');
  }

  bindEvents() {
    this.commentForm.addEventListener('submit', (e) => this.handleSubmit(e));
    this.messageTextarea.addEventListener('input', () => this.updateCharCount());
    this.refreshBtn.addEventListener('click', () => this.loadComments());
    
    // Auto-refresh comments every 30 seconds
    setInterval(() => this.loadComments(), 30000);
  }

  updateCharCount() {
    const length = this.messageTextarea.value.length;
    this.charCount.textContent = length;
    
    const parent = this.charCount.parentElement;
    parent.className = 'character-count';
    
    if (length > 450) {
      parent.classList.add('danger');
    } else if (length > 400) {
      parent.classList.add('warning');
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const message = this.messageTextarea.value.trim();
    const nickname = this.nicknameInput.value.trim();
    
    if (!message) {
      this.showMessage('Please enter a comment message.', 'error');
      return;
    }
    
    if (message.length > 500) {
      this.showMessage('Comment is too long. Please keep it under 500 characters.', 'error');
      return;
    }
    
    this.submitBtn.disabled = true;
    this.submitBtn.textContent = 'Posting...';
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message, nickname })
      });
      
      if (response.ok) {
        this.showMessage('Comment posted successfully!', 'success');
        this.commentForm.reset();
        this.updateCharCount();
        this.loadComments();
      } else {
        const error = await response.json();
        this.showMessage(error.error || 'Failed to post comment.', 'error');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      this.showMessage('Failed to post comment. Please try again.', 'error');
    } finally {
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = 'Post Comment';
    }
  }

  async loadComments() {
    try {
      const response = await fetch('/api/comments');
      
      if (response.ok) {
        const data = await response.json();
        this.displayComments(data.comments);
        this.commentCount.textContent = data.total;
      } else {
        this.showMessage('Failed to load comments.', 'error');
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      this.commentsContainer.innerHTML = '<div class="loading">Failed to load comments. Please refresh the page.</div>';
    }
  }

  displayComments(comments) {
    if (comments.length === 0) {
      this.commentsContainer.innerHTML = `
        <div class="no-comments">
          <h3>No comments yet</h3>
          <p>Be the first to share your thoughts!</p>
        </div>
      `;
      return;
    }

    let html = '';
    comments.forEach(comment => {
      const date = new Date(comment.timestamp);
      const formattedDate = this.formatDate(date);
      
      html += `
        <div class="comment-item">
          <div class="comment-header">
            <span class="comment-author">${this.escapeHtml(comment.nickname)}</span>
            <span class="comment-date">${formattedDate}</span>
          </div>
          <div class="comment-message">${this.escapeHtml(comment.message)}</div>
        </div>
      `;
    });
    
    this.commentsContainer.innerHTML = html;
  }

  formatDate(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    this.commentForm.parentNode.insertBefore(messageDiv, this.commentForm);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 5000);
  }
}

// Initialize comments manager when page loads
document.addEventListener('DOMContentLoaded', () => {
  new CommentsManager();
});

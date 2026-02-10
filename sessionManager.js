const GomokuEngine = require('./gameEngine');
const GomokuAI = require('./ai');

class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.cleanupInterval = setInterval(() => this.cleanup(), 60 * 60 * 1000); // Cleanup every hour
  }

  // Create or get a session
  getOrCreateSession(sessionId) {
    if (!sessionId || !this.sessions.has(sessionId)) {
      sessionId = this.generateSessionId();
      this.sessions.set(sessionId, {
        game: new GomokuEngine(),
        ai: new GomokuAI(),
        lastAccess: Date.now()
      });
    }
    return this.updateSessionAccess(sessionId);
  }

  // Update session last access time
  updateSessionAccess(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastAccess = Date.now();
      return session;
    }
    return null;
  }

  // Get a specific session
  getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastAccess = Date.now();
      return session;
    }
    return null;
  }

  // Delete a session
  deleteSession(sessionId) {
    this.sessions.delete(sessionId);
  }

  // Generate a unique session ID
  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }

  // Cleanup inactive sessions (older than 24 hours)
  cleanup() {
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastAccess > maxAge) {
        this.sessions.delete(sessionId);
      }
    }
  }

  // Get session count (for debugging)
  getSessionCount() {
    return this.sessions.size;
  }

  // Cleanup on shutdown
  destroy() {
    clearInterval(this.cleanupInterval);
    this.sessions.clear();
  }
}

module.exports = new SessionManager();

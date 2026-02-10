const express = require('express');
const sessionManager = require('./sessionManager');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Helper function to get or create session ID from request
function getSessionId(req) {
  // Try to get session ID from header, query parameter, or generate new one
  return req.headers['x-session-id'] || req.query.sessionId || null;
}

// API Routes
app.get('/api/game', (req, res) => {
  const sessionId = getSessionId(req);
  const session = sessionManager.getOrCreateSession(sessionId);
  res.json({ sessionId, state: session.game.getState() });
});

app.post('/api/game/reset', (req, res) => {
  const sessionId = getSessionId(req);
  const session = sessionManager.getOrCreateSession(sessionId);
  session.game.reset();
  res.json({ success: true, sessionId, state: session.game.getState() });
});

app.post('/api/game/move', (req, res) => {
  const sessionId = getSessionId(req);
  const session = sessionManager.getOrCreateSession(sessionId);
  const { x, y } = req.body;

  if (session.game.makeMove(x, y, 1)) {
    const response = { success: true, sessionId, state: session.game.getState() };

    // AI makes a move if game is not over
    if (!session.game.gameOver) {
      const aiMove = session.ai.getBestMove(session.game.getBoard());
      if (aiMove) {
        session.game.makeMove(aiMove.x, aiMove.y, 2);
        response.aiMove = aiMove;
        response.state = session.game.getState();
      }
    }

    res.json(response);
  } else {
    res.status(400).json({ success: false, message: 'Invalid move' });
  }
});

app.post('/api/game/undo', (req, res) => {
  const sessionId = getSessionId(req);
  const session = sessionManager.getSession(sessionId);

  if (!session) {
    return res.status(404).json({ success: false, message: 'Session not found' });
  }

  // Undo both player and AI moves
  session.game.undo();
  session.game.undo();
  res.json({ success: true, sessionId, state: session.game.getState() });
});

app.listen(PORT, () => {
  console.log(`Gomoku game server running at http://localhost:${PORT}`);
});

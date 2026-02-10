const express = require('express');
const path = require('path');
const GomokuEngine = require('./gameEngine');
const GomokuAI = require('./ai');

const app = express();
const PORT = process.env.PORT || 3000;

const game = new GomokuEngine();
const ai = new GomokuAI();

app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/game', (req, res) => {
  res.json(game.getState());
});

app.post('/api/game/reset', (req, res) => {
  game.reset();
  res.json({ success: true, state: game.getState() });
});

app.post('/api/game/move', (req, res) => {
  const { x, y } = req.body;

  if (game.makeMove(x, y, 1)) {
    const response = { success: true, state: game.getState() };

    // AI makes a move if game is not over
    if (!game.gameOver) {
      const aiMove = ai.getBestMove(game.getBoard());
      if (aiMove) {
        game.makeMove(aiMove.x, aiMove.y, 2);
        response.aiMove = aiMove;
        response.state = game.getState();
      }
    }

    res.json(response);
  } else {
    res.status(400).json({ success: false, message: 'Invalid move' });
  }
});

app.post('/api/game/undo', (req, res) => {
  // Undo both player and AI moves
  game.undo();
  game.undo();
  res.json({ success: true, state: game.getState() });
});

app.listen(PORT, () => {
  console.log(`Gomoku game server running at http://localhost:${PORT}`);
});

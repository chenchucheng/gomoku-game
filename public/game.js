const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');
const undoBtn = document.getElementById('undoBtn');
const resetBtn = document.getElementById('resetBtn');

const BOARD_SIZE = 15;
const CELL_SIZE = 35;
const PADDING = 25;

canvas.width = BOARD_SIZE * CELL_SIZE;
canvas.height = BOARD_SIZE * CELL_SIZE;

let gameState = null;
let isProcessing = false;
let sessionId = localStorage.getItem('gomoku_session_id') || generateSessionId();

// Generate a new session ID and save it to localStorage
function generateSessionId() {
  const id = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  localStorage.setItem('gomoku_session_id', id);
  return id;
}

// Draw the board
function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw grid lines
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 1;

  for (let i = 0; i < BOARD_SIZE; i++) {
    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(PADDING + i * CELL_SIZE, PADDING);
    ctx.lineTo(PADDING + i * CELL_SIZE, canvas.height - PADDING);
    ctx.stroke();

    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(PADDING, PADDING + i * CELL_SIZE);
    ctx.lineTo(canvas.width - PADDING, PADDING + i * CELL_SIZE);
    ctx.stroke();
  }

  // Draw star points
  const starPoints = [3, 7, 11];
  ctx.fillStyle = '#8B4513';
  for (const i of starPoints) {
    for (const j of starPoints) {
      ctx.beginPath();
      ctx.arc(PADDING + i * CELL_SIZE, PADDING + j * CELL_SIZE, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw stones
  if (gameState) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (gameState.board[i][j] !== 0) {
          drawStone(i, j, gameState.board[i][j]);
        }
      }
    }

    // Highlight last move
    if (gameState.moveHistory.length > 0) {
      const lastMove = gameState.moveHistory[gameState.moveHistory.length - 1];
      drawLastMoveMarker(lastMove.x, lastMove.y);
    }
  }
}

function drawStone(x, y, player) {
  const centerX = PADDING + x * CELL_SIZE;
  const centerY = PADDING + y * CELL_SIZE;
  const radius = CELL_SIZE * 0.42;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

  if (player === 1) {
    // Black stone
    const gradient = ctx.createRadialGradient(centerX - 3, centerY - 3, 0, centerX, centerY, radius);
    gradient.addColorStop(0, '#666');
    gradient.addColorStop(1, '#000');
    ctx.fillStyle = gradient;
  } else {
    // White stone
    const gradient = ctx.createRadialGradient(centerX - 3, centerY - 3, 0, centerX, centerY, radius);
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(1, '#ddd');
    ctx.fillStyle = gradient;
  }

  ctx.fill();
  ctx.strokeStyle = player === 2 ? '#ccc' : 'transparent';
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawLastMoveMarker(x, y) {
  const centerX = PADDING + x * CELL_SIZE;
  const centerY = PADDING + y * CELL_SIZE;

  ctx.beginPath();
  ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
  ctx.strokeStyle = '#ff0000';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function updateStatus() {
  if (!gameState) return;

  if (gameState.gameOver) {
    if (gameState.winner === 1) {
      statusEl.textContent = '恭喜！你赢了！';
      statusEl.style.color = '#4CAF50';
    } else if (gameState.winner === 2) {
      statusEl.textContent = 'AI 赢了！';
      statusEl.style.color = '#f44336';
    } else {
      statusEl.textContent = '平局！';
      statusEl.style.color = '#333';
    }
  } else {
    if (gameState.currentPlayer === 1) {
      statusEl.textContent = '黑子 (玩家) 回合';
      statusEl.style.color = '#333';
    } else {
      statusEl.textContent = '白子 (AI) 思考中...';
      statusEl.style.color = '#666';
    }
  }

  undoBtn.disabled = gameState.moveHistory.length < 2 || gameState.gameOver;
}

async function fetchGameState() {
  try {
    const response = await fetch('/api/game', {
      headers: { 'X-Session-ID': sessionId }
    });
    const data = await response.json();
    // Update session ID if server returned a new one
    if (data.sessionId) {
      sessionId = data.sessionId;
      localStorage.setItem('gomoku_session_id', sessionId);
    }
    gameState = data.state;
    drawBoard();
    updateStatus();
  } catch (error) {
    console.error('Error fetching game state:', error);
  }
}

async function makeMove(x, y) {
  if (isProcessing || !gameState || gameState.gameOver || gameState.currentPlayer !== 1) {
    return;
  }

  isProcessing = true;

  try {
    const response = await fetch('/api/game/move', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId
      },
      body: JSON.stringify({ x, y })
    });

    const data = await response.json();

    if (data.success) {
      // Update session ID if server returned a new one
      if (data.sessionId) {
        sessionId = data.sessionId;
        localStorage.setItem('gomoku_session_id', sessionId);
      }
      gameState = data.state;
      drawBoard();
      updateStatus();

      // Show AI move message
      if (data.aiMove) {
        statusEl.textContent = '白子 (AI) 落子: (' + (data.aiMove.x + 1) + ', ' + (data.aiMove.y + 1) + ')';
        setTimeout(updateStatus, 500);
      }
    }
  } catch (error) {
    console.error('Error making move:', error);
  } finally {
    isProcessing = false;
  }
}

async function resetGame() {
  if (isProcessing) return;

  isProcessing = true;

  try {
    const response = await fetch('/api/game/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId
      }
    });
    const data = await response.json();

    if (data.success) {
      // Update session ID if server returned a new one
      if (data.sessionId) {
        sessionId = data.sessionId;
        localStorage.setItem('gomoku_session_id', sessionId);
      }
      gameState = data.state;
      drawBoard();
      updateStatus();
    }
  } catch (error) {
    console.error('Error resetting game:', error);
  } finally {
    isProcessing = false;
  }
}

async function undoMove() {
  if (isProcessing || !gameState || gameState.moveHistory.length < 2) return;

  isProcessing = true;

  try {
    const response = await fetch('/api/game/undo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': sessionId
      }
    });
    const data = await response.json();

    if (data.success) {
      // Update session ID if server returned a new one
      if (data.sessionId) {
        sessionId = data.sessionId;
        localStorage.setItem('gomoku_session_id', sessionId);
      }
      gameState = data.state;
      drawBoard();
      updateStatus();
    }
  } catch (error) {
    console.error('Error undoing move:', error);
  } finally {
    isProcessing = false;
  }
}

// Event listeners
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const x = Math.round((e.clientX - rect.left) * scaleX / CELL_SIZE - PADDING / CELL_SIZE);
  const y = Math.round((e.clientY - rect.top) * scaleY / CELL_SIZE - PADDING / CELL_SIZE);

  if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
    makeMove(x, y);
  }
});

undoBtn.addEventListener('click', undoMove);
resetBtn.addEventListener('click', resetGame);

// Initialize
fetchGameState();

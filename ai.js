class GomokuAI {
  constructor(boardSize = 15) {
    this.boardSize = boardSize;
  }

  // Evaluate a position and return a score
  evaluatePosition(board, x, y, player) {
    let score = 0;
    const opponent = player === 1 ? 2 : 1;

    // Evaluate for both player (defense) and AI (offense)
    score += this.evaluateDirection(board, x, y, player) * 1.1; // Slight preference for offense
    score += this.evaluateDirection(board, x, y, opponent) * 1.0; // Also consider defense

    return score;
  }

  evaluateDirection(board, x, y, player) {
    let totalScore = 0;
    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];

    for (const [dx, dy] of directions) {
      const line = this.getLine(board, x, y, dx, dy, player);
      totalScore += this.scoreLine(line, player);
    }

    return totalScore;
  }

  getLine(board, x, y, dx, dy, player) {
    let line = [];
    // Get 4 positions in each direction
    for (let i = -4; i <= 4; i++) {
      const nx = x + dx * i;
      const ny = y + dy * i;
      if (nx < 0 || nx >= this.boardSize || ny < 0 || ny >= this.boardSize) {
        line.push(-1); // Boundary
      } else {
        line.push(board[nx][ny]);
      }
    }
    return line;
  }

  scoreLine(line, player) {
    const opponent = player === 1 ? 2 : 1;
    let score = 0;
    const center = 4; // The center position in our 9-element line

    // Score patterns
    const patterns = {
      five: 100000,           // XXXXX
      liveFour: 10000,        // _XXXX_
      deadFour: 1000,         // XXXX_ or _XXXX
      liveThree: 1000,        // _XXX_
      deadThree: 100,         // XXX_ or _XXX
      liveTwo: 100,           // _XX_
      deadTwo: 10             // XX_ or _XX
    };

    // Check for five in a row
    if (this.hasPattern(line, center, [player, player, player, player, player])) {
      score += patterns.five;
    }

    // Check for live four (open on both ends)
    if (this.hasPattern(line, center, [0, player, player, player, player, 0])) {
      score += patterns.liveFour;
    }

    // Check for dead four
    if (this.hasPattern(line, center, [player, player, player, player, 0]) ||
        this.hasPattern(line, center, [0, player, player, player, player])) {
      score += patterns.deadFour;
    }

    // Check for live three
    if (this.hasPattern(line, center, [0, player, player, player, 0])) {
      score += patterns.liveThree;
    }

    // Check for dead three
    if (this.hasPattern(line, center, [player, player, player, 0]) ||
        this.hasPattern(line, center, [0, player, player, player])) {
      score += patterns.deadThree;
    }

    // Check for live two
    if (this.hasPattern(line, center, [0, player, player, 0])) {
      score += patterns.liveTwo;
    }

    // Check for dead two
    if (this.hasPattern(line, center, [player, player, 0]) ||
        this.hasPattern(line, center, [0, player, player])) {
      score += patterns.deadTwo;
    }

    return score;
  }

  hasPattern(line, center, pattern) {
    for (let i = 0; i <= line.length - pattern.length; i++) {
      let match = true;
      for (let j = 0; j < pattern.length; j++) {
        if (pattern[j] !== -1 && line[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
    return false;
  }

  getBestMove(board) {
    let bestScore = -1;
    let bestMove = null;

    // If board is empty, play in center
    let isEmpty = true;
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (board[i][j] !== 0) {
          isEmpty = false;
          break;
        }
      }
    }
    if (isEmpty) {
      return { x: 7, y: 7 };
    }

    // Evaluate all empty positions near existing pieces
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (board[i][j] === 0 && this.hasNeighbor(board, i, j)) {
          const score = this.evaluatePosition(board, i, j, 2); // AI is player 2
          if (score > bestScore) {
            bestScore = score;
            bestMove = { x: i, y: j };
          }
        }
      }
    }

    return bestMove || { x: 7, y: 7 };
  }

  hasNeighbor(board, x, y) {
    const distance = 2;
    for (let i = Math.max(0, x - distance); i <= Math.min(this.boardSize - 1, x + distance); i++) {
      for (let j = Math.max(0, y - distance); j <= Math.min(this.boardSize - 1, y + distance); j++) {
        if (board[i][j] !== 0) return true;
      }
    }
    return false;
  }
}

module.exports = GomokuAI;

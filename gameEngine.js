class GomokuEngine {
  constructor(boardSize = 15) {
    this.boardSize = boardSize;
    this.reset();
  }

  reset() {
    // 0: empty, 1: black (player), 2: white (AI)
    this.board = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(0));
    this.currentPlayer = 1;
    this.gameOver = false;
    this.winner = null;
    this.moveHistory = [];
  }

  isValidMove(x, y) {
    return x >= 0 && x < this.boardSize && y >= 0 && y < this.boardSize && this.board[x][y] === 0;
  }

  makeMove(x, y, player = this.currentPlayer) {
    if (!this.isValidMove(x, y) || this.gameOver) {
      return false;
    }

    this.board[x][y] = player;
    this.moveHistory.push({ x, y, player });

    if (this.checkWin(x, y, player)) {
      this.gameOver = true;
      this.winner = player;
    } else if (this.moveHistory.length === this.boardSize * this.boardSize) {
      this.gameOver = true; // Draw
    } else {
      this.currentPlayer = player === 1 ? 2 : 1;
    }

    return true;
  }

  checkWin(x, y, player) {
    const directions = [
      [1, 0],   // horizontal
      [0, 1],   // vertical
      [1, 1],   // diagonal \
      [1, -1]   // diagonal /
    ];

    for (const [dx, dy] of directions) {
      let count = 1;

      // Check in positive direction
      let i = 1;
      while (true) {
        const nx = x + dx * i;
        const ny = y + dy * i;
        if (nx < 0 || nx >= this.boardSize || ny < 0 || ny >= this.boardSize) break;
        if (this.board[nx][ny] !== player) break;
        count++;
        i++;
      }

      // Check in negative direction
      i = 1;
      while (true) {
        const nx = x - dx * i;
        const ny = y - dy * i;
        if (nx < 0 || nx >= this.boardSize || ny < 0 || ny >= this.boardSize) break;
        if (this.board[nx][ny] !== player) break;
        count++;
        i++;
      }

      if (count >= 5) return true;
    }

    return false;
  }

  undo() {
    if (this.moveHistory.length === 0) return false;
    const lastMove = this.moveHistory.pop();
    this.board[lastMove.x][lastMove.y] = 0;
    this.currentPlayer = lastMove.player;
    this.gameOver = false;
    this.winner = null;
    return true;
  }

  getBoard() {
    return this.board;
  }

  getState() {
    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
      gameOver: this.gameOver,
      winner: this.winner,
      moveHistory: this.moveHistory
    };
  }
}

module.exports = GomokuEngine;

const socket = io();
const board = document.getElementById('board');
const message = document.getElementById('message');
let currentPlayer;

// Array representing the game board
const gameBoard = ['', '', '', '', '', '', '', '', ''];

// Function to render the game board UI
function renderBoard() {
  board.innerHTML = '';
  gameBoard.forEach((cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.dataset.index = index;
    cellElement.innerText = cell;
    cellElement.addEventListener('click', () => handleMove(index));
    board.appendChild(cellElement);
  });
}

// Function to handle player's move
function handleMove(index) {
  if (gameBoard[index] === '' && currentPlayer === 'X') {
    gameBoard[index] = currentPlayer;
    socket.emit('move', index);
  }
}

// Function to reset the game
function resetGame() {
  gameBoard.fill('');
  renderBoard();
  socket.emit('reset');
}

socket.on('board', (boardData, player) => {
  currentPlayer = player;
  gameBoard.splice(0, gameBoard.length, ...boardData);
  renderBoard();
});

socket.on('message', (msg) => {
  message.innerText = msg;
});

// Initialize the game
renderBoard();

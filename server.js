const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();


// Serve static files (HTML, CSS, JS) from a directory
app.use(express.static('public')); // Assuming your files are in a 'public' directory


const server = http.createServer(app);
const io = socketIo(server);

let gameBoard = ['', '', '', '', '', '', '', '', '']; // Represents the Tic Tac Toe game board
let currentPlayer = 'X'; // Player X starts the game

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle player move
  socket.on('move', (index) => {
    if (gameBoard[index] === '' && currentPlayer === 'X') {
      gameBoard[index] = currentPlayer;
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      io.sockets.emit('board', gameBoard, currentPlayer);
    }
  });

  // Reset the game board
  socket.on('reset', () => {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    io.sockets.emit('board', gameBoard, currentPlayer);
  });

  // Send initial game state to the new player
  socket.emit('board', gameBoard, currentPlayer);
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

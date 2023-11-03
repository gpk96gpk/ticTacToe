import express from 'express';
import { createServer } from "http";
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  }
});

type GameStateType = [string, string, string, string, string, string, string, string, string];

let isXTurn: Boolean;
let gameState:GameStateType = ['','','','','','','','',''];
const victoryConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

io.on('connection', (socket) => {
  isXTurn = true;
  let gameOver = false;
  gameState = ['','','','','','','','',''];
  console.log(`User connected with ID: ${socket.id}`);
  socket.on('tileClicked', (id) => {
    gameState[id] = isXTurn ? 'X' : 'O';
    for (let i = 0; i < victoryConditions.length; i++) {
      const condition = victoryConditions[i];
      if (gameState[condition[0]] === gameState[condition[1]] && gameState[condition[1]] === gameState[condition[2]] && gameState[condition[0]] !== '') {
        console.log('game over');
        socket.broadcast.emit('gameOver', true);
        gameOver = true;
      }
    }
    console.log(id);
    console.log(isXTurn);
    console.log('gameOver?'+gameOver);
    socket.emit('turnChange', isXTurn);
    socket.broadcast.emit('turnChange', isXTurn);
    if (gameOver) {
      isXTurn = undefined;
    } else {
      isXTurn = !isXTurn;
    }
  });
});

httpServer.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
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


let players = [];

io.on('connection', (socket) => {
  let xTurn = true;
  let gameOver = false;
  if (!players.includes(socket.id)) {
    players.push(socket.id);
  }
  let playerNumber = players.indexOf(socket.id) + 1;
  socket.emit('playerNumber', playerNumber);

  console.log(`Socket ${playerNumber} connected.`);
  
  socket.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });
  console.log(socket.rooms);
  socket.join("room1");
  console.log(socket.rooms);
  

  socket.on('tileState', (tileState) => {
    console.log('tile state');
    socket.broadcast.emit('tileState', tileState);
  });
  socket.on('gameState', (gameState) => {
    console.log('game state'+gameState);
    socket.broadcast.emit('gameState', gameState);
  } );
  socket.on('tileClicked', (xTurn) => {
    let playerNumber = players.indexOf(socket.id) + 1;
    if ((playerNumber === 1 && xTurn) || (playerNumber === 2 && !xTurn)) {
      console.log('tile clicked'+xTurn);
      xTurn = !xTurn; 
      socket.broadcast.emit('turn', xTurn);
    }
  });
  socket.on('gameOver', (isGameOver) => {
    console.log('game over');
    socket.broadcast.emit('gameOver', isGameOver);
  });
  socket.on('reset', () => {
    console.log('reset');
    gameOver = false; 
    socket.broadcast.emit('reset');
  });
  socket.on('disconnect', () => {
    players = players.filter(player => player !== socket);
    players = [];
  });
});



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

httpServer.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});

httpServer.on('error', (err) => {
  process.exit(1);
  console.error(`Server error: ${err}`);
  httpServer.close(() => {
      console.log('Server stopped due to an error');
  });
});
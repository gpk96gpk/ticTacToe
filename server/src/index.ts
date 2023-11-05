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

const players = {};

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected.`);

  socket.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });
  console.log(socket.rooms); // Set { <socket.id> }
  socket.join("room1");
  console.log(socket.rooms);

  if (!players[socket.id]) {
    players[socket.id] = socket.id;
    console.log(players);
  }
  socket.on('tileState', (tileState) => {
    console.log('tile state');
    //socket.broadcast.emit('tileState', tileState);
  });
  socket.on('tileClicked', (tiles) => {
    //socket.broadcast.emit('tileClicked', tiles);
    console.log('tile clicked');
  });
  socket.on('gameOver', (isGameOver) => {
    console.log('game over');
    // socket.broadcast.emit('gameOver', isGameOver);
  }); 
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

httpServer.listen(3001, () => {
  console.log('server running at http://localhost:3001');
});
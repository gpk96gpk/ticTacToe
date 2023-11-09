import express from 'express';
import { createServer } from "http";
import { Server, Socket } from 'socket.io';
import { SocketTypes } from '../types/serverTypes.ts';

const app = express();
const httpServer = createServer(app);
const io = new Server<SocketTypes>(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  }
});

let players = {};
let rooms = [];

io.on('connection', (socket: Socket) => {

  socket.on('createRoom', (roomCode) => {
    rooms[roomCode] = [socket.id];
    const playerNumber = 1;
    players[socket.id] = { roomCode, playerNumber };
    socket.emit('playerNumber', playerNumber);
  });

  socket.on('joinRoom', (roomCode) => {
    socket.join(roomCode);
    if (!rooms[roomCode]) {
      rooms[roomCode] = [];
    }
    rooms[roomCode].push(socket.id);
    const playerNumber = 2;
    players[socket.id] = { roomCode, playerNumber };
    socket.emit('playerNumber', playerNumber);
  });

  socket.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });

  socket.on('gameState', (gameState, roomCode) => {
    const otherPlayerSocketId = [...rooms[roomCode]].filter(id => id !== socket.id);
    io.to(otherPlayerSocketId).emit<any>('gameState', gameState);
  });

  socket.on('tileClicked', (xTurn, roomCode) => {
    const otherPlayerSocketId = [...rooms[roomCode]].filter(id => id !== socket.id);
    io.to(otherPlayerSocketId).emit<any>('turn', xTurn);
  });

  socket.on('gameOver', (isGameOver, roomCode) => {
    rooms[roomCode].gameOver = isGameOver;
    const otherPlayerSocketId = [...rooms[roomCode]].filter(id => id !== socket.id);
    io.to(roomCode).emit<any>('gameOver', rooms[roomCode].gamOver);
  });

  socket.on('reset', () => {
    const roomCode = players[socket.id].roomCode;
    io.to(roomCode).to(socket.id).emit<any>('reset');
    if (rooms[roomCode]) {
      const otherPlayerSocketId = [...rooms[roomCode]].filter(id => id !== socket.id);
      io.to(otherPlayerSocketId).to(socket.id).emit<any>('reset');
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

httpServer.listen(3002, () => {
  console.log('server running at http://localhost:3002');
});

httpServer.on('error', (err) => {
  process.exit(1);
  console.error(`Server error: ${err}`);
  httpServer.close(() => {
    console.log('Server stopped due to an error');
  });
});
import express from 'express';
import { createServer } from "http";
import { Server, Socket } from 'socket.io';
interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}
const app = express();
const httpServer = createServer(app);
const io = new Server<
ClientToServerEvents,
ServerToClientEvents,
InterServerEvents,
SocketData
>(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  }
});


let players = {};
const rooms = {};

io.on('connection', (socket: Socket) => {
  socket.on('createRoom', (roomCode) => {
    rooms[roomCode] = [socket.id];
    players[socket.id] = { roomCode, playerNumber: 1 };
    rooms[roomCode].xTurn = true;
    rooms[roomCode].gameOver = false;
    socket.emit('playerNumber', 1);
  });
  socket.on('joinRoom', (roomCode) => {
    socket.join(roomCode);

    rooms[roomCode].push(socket.id);
    const playerNumber = rooms[roomCode].length;
    players[socket.id] = { roomCode, playerNumber };
  
    socket.emit('playerNumber', playerNumber);
  });
  
  socket.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });


  socket.on('tileState', (tileState) => {
    const roomCode = players[socket.id].roomCode;
    console.log('tile state'+tileState);
    socket.to(roomCode).emit('tileState', tileState);
  });
  socket.on('gameState', (gameState) => {
    const roomCode = players[socket.id].roomCode;
    console.log('game state'+gameState);
    socket.to(roomCode).emit('gameState', gameState);
  });
  socket.on('tileClicked', (xTurn) => {
    const roomCode = players[socket.id].roomCode;
    const playerNumber = players[socket.id].playerNumber;

    if ((playerNumber === 1 && xTurn) || (playerNumber === 2 && !xTurn)) {
      console.log('player number'+playerNumber)
      console.log('tile clicked'+xTurn);
      xTurn = !xTurn;
      socket.to(roomCode).emit('turn', xTurn);
    }
  });
  socket.on('gameOver', (isGameOver) => {
    const roomCode = players[socket.id].roomCode;
    console.log('game over');
    rooms[roomCode].gameOver = isGameOver;
    socket.to(roomCode).emit('gameOver', rooms[roomCode].gamOver);
  });
  socket.on('reset', () => {
    const roomCode = players[socket.id].roomCode;
    console.log('reset');
    rooms[roomCode].gameOver = false; 
    rooms[roomCode].xTurn = true;
    socket.to(roomCode).emit('reset');
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
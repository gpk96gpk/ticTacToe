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
let rooms = [];
let readyPlayers = 0;

io.on('connection', (socket: Socket) => {
  socket.on('createRoom', (roomCode) => {
    console.log('create room'+roomCode);
    rooms[roomCode] = [socket.id];
    const playerNumber = 1;
    players[socket.id] = { roomCode, playerNumber };
    socket.emit('playerNumber', playerNumber);
  });
  socket.on('joinRoom', (roomCode) => {
    console.log(`Socket ${socket.id} is trying to join room ${roomCode}`);
    socket.join(roomCode);
    console.log(`Socket ${socket.id} joined room ${roomCode}`);
    if (!rooms[roomCode]) {
      rooms[roomCode] = [];
    }
    //rooms[roomCode][socket.id] = {};
    rooms[roomCode].push(socket.id);
    console.log(rooms[roomCode])
    const playerNumber = 2;
    
    players[socket.id] = { roomCode, playerNumber };
    
    socket.emit('playerNumber', playerNumber);
  });
  
  socket.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });


  // socket.on('ready', () => {
  //   readyPlayers += 1;

  //   if (readyPlayers === 2) {
  //     // Both players are ready, start the game
  //     io.emit<any>('startGame');
  //   }
  // });

  socket.on('tileState', (tileState, roomCode) => {
    //const roomCode = players[socket.id].roomCode;
    console.log(rooms[roomCode]);
    const otherPlayerSocketId = [...rooms[roomCode]].filter(id => id !== socket.id);
    io.to(otherPlayerSocketId).emit<any>('tileState', tileState);
    console.log('SENT tile state')
  });
  socket.on('gameState', (gameState, roomCode) => {
    //const roomCode = players[socket.id].roomCode;
    console.log('sending'+gameState);
    const otherPlayerSocketId = [...rooms[roomCode]].filter(id => id !== socket.id);
    io.to(otherPlayerSocketId).emit<any>('gameState', gameState);
    console.log('SENT game state')
  });
  socket.on('tileClicked', (xTurn, roomCode) => {
    console.log('tile clicked'+xTurn);
    console.log('room code'+roomCode);
    console.log(rooms[roomCode])
    const playerNumber = players[socket.id].playerNumber;

    const otherPlayerSocketId = [...rooms[roomCode]].filter(id => id !== socket.id);
    console.log(socket.id)
    console.log(otherPlayerSocketId)
    console.log(rooms[roomCode])
    console.log('other player socket id'+otherPlayerSocketId);
    io.to(otherPlayerSocketId).emit<any>('turn', xTurn);

    console.log(xTurn);
    console.log('SENT turn');
    
    // if ((playerNumber === 1 && xTurn) || (playerNumber === 2 && !xTurn)) {
    //   //console.log('player number'+playerNumber);
    //   //console.log('tile clicked'+rooms[roomCode].xTurn);
    // }
  });
  socket.on('gameOver', (isGameOver, roomCode) => {
    //const roomCode = players[socket.id].roomCode;
    console.log('game over');
    rooms[roomCode].gameOver = isGameOver;
    const otherPlayerSocketId = [...rooms[roomCode]].filter(id => id !== socket.id);
    io.to(roomCode).emit<any>('gameOver', rooms[roomCode].gamOver);
  });
  socket.on('reset', () => {
    const roomCode = players[socket.id].roomCode;
    console.log('SERVER RECEIVED reset');
    console.log(roomCode)
    io.to(roomCode).to(socket.id).emit<any>('reset');
    console.log(rooms[roomCode])
    if (rooms[roomCode]) {
      const otherPlayerSocketId = [...rooms[roomCode]].filter(id => id !== socket.id);
      io.to(otherPlayerSocketId).to(socket.id).emit<any>('reset');
      console.log('SENT reset');
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
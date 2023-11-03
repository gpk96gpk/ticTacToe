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

let isXTurn: Boolean;
io.on('connection', (socket) => {
  isXTurn = true;
  console.log('a user connected')
  socket.on('tileClicked', (id) => {
    console.log(id);
    console.log(isXTurn)
    socket.emit('turnChange', isXTurn);
    isXTurn = !isXTurn;
  });
  
});

httpServer.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
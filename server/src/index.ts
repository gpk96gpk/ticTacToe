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

// const path = require('path');
// const http = require('http');
// app.use(express.static(path.resolve('')));

// app.get('/', (req, res) => {
//   res.sendFile(new URL('../../client/index.html', import.meta.url).pathname);
// });


// why wont the console log appear when i connect to the server?  
let isXTurn = true;
io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('tileClicked', () => {
      isXTurn = !isXTurn;
      console.log(isXTurn);
      socket.emit('turnChange', isXTurn);
  });
});

httpServer.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
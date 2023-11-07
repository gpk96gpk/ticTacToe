import { io, Socket } from 'socket.io-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SocketContext } from './context/SocketContext';
import { ServerToClientEvents, ClientToServerEvents } from './types/tictactoe';
import LobbyPage from './components/LobbyPage';
import TicTacToe from './components/TicTacToe';


const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3001');

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Routes>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/game/:newRoomId" element={<TicTacToe />} />
        </Routes>
      </Router>
    </SocketContext.Provider>    
  )
}

export default App

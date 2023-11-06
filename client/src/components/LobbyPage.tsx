import { SocketContext } from "../context/SocketContext";
import CreateRoom from "./CreateRoom"
import JoinRoom from "./JoinRoom"
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';


function LobbyPage() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  // ...

if (socket) {
  socket.on('roomCreated', () => {
    navigate('/game');
  });

  socket.on('roomJoined', () => {
    navigate('/game');
  });
}

  // ...
    return (
        <>
            <h1>Welcome to Tic Tac Toe Lobby!</h1>
            <JoinRoom />
            <CreateRoom />
        </>
    )
}

export default LobbyPage
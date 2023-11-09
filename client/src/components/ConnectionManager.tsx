import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from "../context/SocketContext";
import { useContext } from 'react';

const ConnectionManager= () => {
    const socket = useContext(SocketContext);
    const [roomId, setRoomId] = useState(Number);
    const navigate = useNavigate();

    const createRoom = () => {
        const newRoomId = Math.floor(1000 + Math.random() * 9000);
        setRoomId(newRoomId);
        console.log(`Created room ${newRoomId}`);
        console.log('socket:', socket);
        if (socket) {
            socket.emit('createRoom', newRoomId);
            console.log('createRoom event emitted');
        }
        navigate(`/game/${newRoomId}`);
    }

    const joinRoom = () => {
        console.log('socket:', socket);
        console.log(`Joined room ${roomId}`);
        if (socket) {
            socket.emit('joinRoom', roomId);
        }
        navigate(`/game/${roomId}`);
        return Number(roomId);
    }

    return (
        <>
        <button onClick={createRoom}>Create Room</button>
        <form onSubmit={(e) => { e.preventDefault(); joinRoom(); }}>
            <input
                type="text"
                value={roomId}
                onChange={e => setRoomId(Number(e.target.value))}
                placeholder="Enter room ID"
            />
            <button type="submit">Join Room</button>
        </form>
        </>
    );
}

export default ConnectionManager;
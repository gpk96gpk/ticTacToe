import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from "../context/SocketContext";
import { useContext, useEffect } from 'react';



const ConnectionManager= () => {
    const socket = useContext(SocketContext);
    const [roomId, setRoomId] = useState(Number);
    const navigate = useNavigate();

    const createRoom = () => {
        const newRoomId = Math.floor(1000 + Math.random() * 9000);
        setRoomId(newRoomId);
        console.log(`Created room ${newRoomId}`);
        if (socket) {
            socket.emit('createRoom', newRoomId);
        }
        navigate(`/game/${newRoomId}`);
    }
    // useEffect(() => {
    //     if (socket) {
    //         socket.on('createRoom', (roomId) => {
    //             console.log(`Created room ${roomId}`);
    //         });
    //     }
    //     return () => {
    //         if (socket) {
    //             socket.off('createRoom');
    //         }
    //     };
    // }, [navigate, socket]);

    const joinRoom = () => {
        if (socket) {
            navigate(`/game/${roomId}`);
            socket.emit('joinRoom', roomId);
        }
        return Number(roomId);
    }

    useEffect(() => {
        if (socket) {
            socket.on('joinRoom', (roomId) => {
                console.log(`Joined room ${roomId}`);
            });
        }

        return () => {
            if (socket) {
                socket.off('joinRoom');
            }
        };
    }, [navigate, socket]);

    return (
        <>
            <button onClick={createRoom}>Create Room</button>
            <input
                type="text"
                value={roomId}
                onChange={e => setRoomId(Number(e.target.value))}
                placeholder="Enter room ID"
            />
            <button onClick={() => joinRoom()}>Join Room</button>
        </>
    );
}

export default ConnectionManager;
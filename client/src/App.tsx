import TicTacToe from './components/TicTacToe'
import { io, Socket } from 'socket.io-client';
import { SocketContext } from './context/SocketContext';

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}


const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3001');

function App() {
  return (
    <>
    <SocketContext.Provider value={socket}>
      <TicTacToe />
    </SocketContext.Provider>
    </>
  )
}

export default App

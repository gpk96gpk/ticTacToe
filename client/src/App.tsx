import { io } from 'socket.io-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import { useNavigate } from 'react-router-dom';
import { SocketContext } from './context/SocketContext';
//import { ServerToClientEvents, ClientToServerEvents } from './types/tictactoe';
import LobbyPage from './components/LobbyPage';
import TicTacToe from './components/TicTacToe';
import { useEffect, useState } from 'react';
import { GameStateType } from './types/tictactoe';


const socket = io('http://localhost:3002');


function App() {
  //const { roomCode } = useParams();
  const [playerNumber, setPlayerNumber] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [xTurn, setXTurn] = useState<boolean | null>(true);
  const [tileStates, setTileStates] = useState(Array(9).fill(''));
  const [gameState, setGameState] = useState<GameStateType>(['', '', '', '', '', '', '', '', '']);
  const [letterIcon, setLetterIcon] = useState('fa-solid fa-x fa-5x');
  const [isClicked, setIsClicked] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  useEffect(() => {
    socket.on('createRoom', (roomId) => {
      console.log(`Created room ${roomId}`);
      //navigate(`/game/${roomId}`);
    });

    return () => {
      socket.off('createRoom');
    }
  }, []);

  useEffect(() => {
    socket.on('joinRoom', (roomId) => {
      console.log(`Joined room ${roomId}`);
      //navigate(`/game/${roomId}`);
    });

    return () => {
      socket.off('joinRoom');
    };
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    socket.on('connect_error', (error: Error) => {
      console.error('Connection error:', error);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
    }

  }, []);

  useEffect(() => {
    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });

    return () => {
      socket.off('disconnect');
    };

  }, []);

  useEffect(() => {
    socket.on('playerNumber', (number: number) => {
      setPlayerNumber(number);
      console.log("playerNumber", number);
    });

    return () => {
      socket.off('playerNumber');
    }
  }, []);

  useEffect(() => {
    const turnChange = (arg: boolean | ((prevState: boolean | null) => boolean | null) | null) => {
      console.log('DEBUGturnChange' + arg)
      setXTurn(arg);
      //console.log("turnChange")
    }

    socket.on('turn', turnChange);

    return () => {

      socket.off('turn', turnChange)

    }
  }, []);

  useEffect(() => {
    const handleTileState = (newTileStates: string[]) => {
      console.log("DEBUGStileState" + tileStates)
      setTileStates([...newTileStates]);
    };

    socket.on('tileState', handleTileState);


    // Clean up the event listener when the component unmounts
    return () => {

      socket.off('tileState', handleTileState);

    };
  }, []);

  useEffect(() => {
    const handleGameState = (arg: GameStateType) => {
      console.log("DEBUGgameState" + arg)
      setGameState([...arg]);
      console.log("DEBUGgameState" + gameState)
    }

    socket.on('gameState', handleGameState);

    return () => {

      socket.off('gameState', handleGameState)

    }
  }, []);

  useEffect(() => {
    const gameOver = (arg: React.SetStateAction<boolean>) => {
      setGameOver(arg);
      console.log("gameOver")
    }

    socket.on("gameOver", gameOver);


    return () => {

      socket.off("gameOver", gameOver)

    }
  }, []);

  useEffect(() => {
    const handleResetEvent = () => {
      console.log('reset');
      handleReset();
    };

    socket.on('reset', handleResetEvent);


    return () => {

      socket.off('reset', handleResetEvent);

    };
  });

  const handleReset = () => {
    if (gameOver && socket) {
      socket.emit('reset');
    }
    resetGame();
  };
  
  const resetGame = () => {
    setTileStates(Array(9).fill(''));
    setGameState(['', '', '', '', '', '', '', '', '']);
    setGameOver(false);
    setXTurn(true);
    setClickedIndex(null);
    setWinner(null);
    setLetterIcon('fa-solid fa-x fa-5x');
    setIsClicked(false);
  
    console.log("reset")
  };

  const ticTacToeProps = {
    playerNumber,
    gameOver,
    xTurn,
    tileStates,
    gameState,
    letterIcon,
    isClicked,
    winner,
    clickedIndex,
    setPlayerNumber,
    setGameOver,
    setXTurn,
    setTileStates,
    setGameState,
    setLetterIcon,
    setIsClicked,
    setWinner,
    setClickedIndex,
    handleReset,
  };

  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <Routes>
          <Route path="/" element={<LobbyPage />} />
          <Route path="/game/:roomCode" element={<TicTacToe {...ticTacToeProps} />} />
        </Routes>
      </Router>
    </SocketContext.Provider>
  )
}

export default App

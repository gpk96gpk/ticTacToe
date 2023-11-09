import { io } from 'socket.io-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SocketContext } from './context/SocketContext';
import LobbyPage from './components/LobbyPage';
import TicTacToe from './components/TicTacToe';
import { useEffect, useState } from 'react';
import { GameStateType } from './types/clientTypes';

const socket = io('http://localhost:3002');

function App() {
  const [playerNumber, setPlayerNumber] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [xTurn, setXTurn] = useState<boolean | null>(true);
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
    });

    return () => {
      socket.off('playerNumber');
    }
  }, []);

  useEffect(() => {
    const turnChange = (arg: boolean | ((prevState: boolean | null) => boolean | null) | null) => {
      setXTurn(arg);
    }

    socket.on('turn', turnChange);

    return () => {
      socket.off('turn', turnChange)
    }
  }, []);

  useEffect(() => {
    const handleGameState = (arg: GameStateType) => {
      setGameState([...arg]);
    }

    socket.on('gameState', handleGameState);

    return () => {
      socket.off('gameState', handleGameState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const gameOver = (arg: React.SetStateAction<boolean>) => {
      setGameOver(arg);
    }

    socket.on("gameOver", gameOver);


    return () => {
      socket.off("gameOver", gameOver)
    }
  }, []);

  useEffect(() => {
    const handleResetEvent = () => {
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
    setGameState(['', '', '', '', '', '', '', '', '']);
    setGameOver(false);
    setXTurn(true);
    setClickedIndex(null);
    setWinner(null);
    setLetterIcon('fa-solid fa-x fa-5x');
    setIsClicked(false);
  };

  const ticTacToeProps = {
    playerNumber,
    gameOver,
    xTurn,
    gameState,
    letterIcon,
    isClicked,
    winner,
    clickedIndex,
    setPlayerNumber,
    setGameOver,
    setXTurn,
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
import { SetStateAction, useEffect, useState, useContext } from "react"
import Board from "./Board"
import GameOver from "./GameOver"
import { GameStateType } from "../types/tictactoe"
import { SocketContext } from "../context/SocketContext";
//import { useParams } from 'react-router-dom';


const TicTacToe = () => {
    //const { roomId } = useParams();
    const socket = useContext(SocketContext);

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
              console.log('Connected to the server');
            });    
        }
        if (socket) {
            socket.on('connect_error', (error: Error) => {
                console.error('Connection error:', error);
            });
        }
        return () => {
        if (socket) {
            socket.off('connect');
            socket.off('connect_error');
        }  
        };
      }, [socket]);
    const [gameOver, setGameOver] = useState(false);
    const [xTurn, setXTurn] = useState<boolean | null>(true);
    const [letterIcon, setLetterIcon] = useState('fa-solid fa-x fa-5x');
    const [isClicked, setIsClicked] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [tileStates, setTileStates] = useState(Array(9).fill(''));
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);
    const [gameState, setGameState] = useState<GameStateType>(['', '', '', '', '', '', '', '', '']);
    const [playerNumber, setPlayerNumber] = useState<number | null>(null);
    
    
    useEffect(() => {
        if (socket) {
          socket.on('connect', () => {
            console.log('Connected to the server');
          });
      
          socket.on('connect_error', (error: Error) => {
            console.error('Connection error:', error);
          });
      
          // Clean up the event listeners when the component unmounts
          return () => {
            socket.off('connect');
            socket.off('connect_error');
          };
        }
      }, [socket]);
    useEffect(() => {
        if (socket) {
            socket.on('playerNumber', (number: number) => {
                setPlayerNumber(number);
                console.log("playerNumber", number);
            });
        }
        return () => { 
            if (socket) {
                socket.off('playerNumber'); 
            }
        }
    }, [socket]);      
    useEffect(() => {
        const gameOver = (arg: React.SetStateAction<boolean>) => {
            setGameOver(arg);
            console.log("gameOver")
        }
        if (socket) {
            socket.on("gameOver", gameOver);
        }
        return () => { 
            if (socket) {
                socket.off("gameOver", gameOver)
            } 
        }  
    }, [gameOver, socket]);


    const handleTileClick = (index: number) => {
        console.log("playerNumber"+playerNumber)
        if ((playerNumber === 1 && xTurn) || (playerNumber === 2 && !xTurn)) {
            if (gameState[index] !== '' || gameOver) {
                return;
            } 
            setClickedIndex(index);
            const newGameState: GameStateType = [...gameState];
            console.log(gameState)
            console.log(xTurn)
            if (socket) {
                console.log('sentPlayerNumber'+playerNumber)
                socket.emit('tileClicked', xTurn);
            }            
            console.log('before'+index)
            newGameState[index] = xTurn ? 'X' : 'O';
            console.log('after'+index)
            console.log(newGameState[index])
            if (socket) {
                console.log("sentGameState"+newGameState)
                socket.emit('gameState', newGameState);
            }            
            setXTurn(!xTurn); 
        }
    }

    useEffect(() => {
        const turnChange = (arg: boolean | ((prevState: boolean | null) => boolean | null) | null) => {
            setXTurn(arg);
            console.log("turnChange")
            console.log('turnChange'+arg)
        }
        if (socket) {
            socket.on("turn", turnChange);
        }
        return () => {
            if (socket) {
                socket.off("turn", turnChange)
            }           
        }
    }, [socket]);
    useEffect(() => {
        const gameOver = (arg: React.SetStateAction<boolean>) => {
            setGameOver(arg);
            console.log("gameOver")
        }
        if (socket) {
            socket.on("gameOver", gameOver);
        }

        return () => {
            if (socket) {
                socket.off("gameOver", gameOver) 
            } 
        }  
    }, [gameOver, socket]);
    useEffect(() => {
        if (gameOver) {
            setXTurn(null);
        }
        if (isClicked && xTurn !== null && !gameOver) {
            setLetterIcon(xTurn ? 'fa-solid fa-x fa-5x' : 'fa-solid fa-o fa-5x');
            //console.log(letterIcon)
        }
        if (xTurn === null && gameOver) {
            setLetterIcon('hidden');
        }
        !gameOver && setIsClicked(true);
        
    }, [isClicked, xTurn, gameOver, letterIcon])

    useEffect(() => {
        const victoryConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (let i = 0; i < victoryConditions.length; i++) {
            const condition = victoryConditions[i];
        
            if (gameState[condition[0]] === gameState[condition[1]] && gameState[condition[1]] === gameState[condition[2]] && gameState[condition[0]] !== '') {
                console.log('game over');
                if (socket) {
                    socket.emit('gameOver', true);
                }
                setGameOver(true);
            }
        }
    }, [clickedIndex, xTurn, isClicked, gameState, socket]);
    
    useEffect(() => {
        const handleTileState = (newTileStates: SetStateAction<string[]>) => {
            setTileStates(newTileStates);
        };
        if (socket) {
            socket.on('tileState', handleTileState);
            console.log("tileState"+tileStates)
        }
    
        // Clean up the event listener when the component unmounts
        return () => {
            if (socket) {
                socket.off('tileState', handleTileState);
            }
        };
    }, [socket, tileStates]);
    useEffect(() => {
        const newTileStates: string[] = [...tileStates];
        if (letterIcon !== null && clickedIndex !== null && newTileStates[clickedIndex] === '' ) {
            console.log(tileStates)
            const newTileStates = [...tileStates];
            if (clickedIndex !== null) {
                newTileStates[clickedIndex] = letterIcon;
            }
            setTileStates(newTileStates);
            if (socket) {
                socket.emit('tileState', newTileStates);
            }
        }
        
    }, [tileStates, letterIcon, clickedIndex, socket])
    useEffect(() => {
        const handleGameState = (arg: GameStateType) => {
            console.log("gameState"+arg)
            setGameState([...arg]);
        }
        if (socket) {
            socket.on('gameState', handleGameState);
        }
        return () => {
            if (socket) {
                socket.off('gameState', handleGameState) 
            } 
        }
    }, [socket]);
    useEffect(() => {
        if (letterIcon !== null && clickedIndex !== null && gameState[clickedIndex] === '') {
            const newGameState = [...gameState];
            newGameState[clickedIndex] = letterIcon;
            setGameState(newGameState);
            if (socket) {
                console.log("sentGameState"+newGameState)
                socket.emit('gameState', newGameState);
            }
        }
    }, [gameState, letterIcon, clickedIndex, socket]);    
    useEffect(() => {
        if (gameOver && winner === null) {
            setWinner(!xTurn ? 'X' : 'O');
        }
    }, [winner, xTurn, gameOver]);

    
    const handleReset = () => {
        setTileStates(Array(9).fill(null));
        setGameState(['', '', '', '', '', '', '', '', '']);
        setGameOver(false);
        setXTurn(true);
        setClickedIndex(null);
        setWinner(null);
        setLetterIcon('fa-solid fa-x fa-5x');
        setIsClicked(false);

        console.log("reset")
        if (gameOver && socket) {
            socket.emit('reset');
        }
    };

    useEffect(() => {
        const handleResetEvent = () => {
            console.log('reset');
            handleReset();
        };
        if (socket) {
            socket.on('reset', handleResetEvent);
        }

        return () => {
            if (socket) {
                socket.off('reset', handleResetEvent);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    return (
    <div className="ticTacToe">
        <h1>Tic Tac Toe</h1>
        <GameOver handleReset={handleReset} isGameOver={gameOver} gameWinner={winner}/>
        <Board isClicked={isClicked} tileStates={tileStates} onTileClick={handleTileClick} letterIcon={letterIcon} setIsClicked={setIsClicked} gameOver={gameOver}/>
    </div>
    )
}

export default TicTacToe
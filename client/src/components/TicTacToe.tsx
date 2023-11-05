import { SetStateAction, useEffect, useState } from "react"
import Board from "./Board"
import GameOver from "./GameOver"
import { io } from "socket.io-client"
import { GameStateType } from "../types/tictactoe"

const socket = io("http://localhost:3001")

socket.on('connect', () => {
    console.log('Connected to the server');
  });
  
  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
  });



const TicTacToe = () => {
    const [gameOver, setGameOver] = useState(false);
    const [xTurn, setXTurn] = useState<boolean | null>(true);
    const [letterIcon, setLetterIcon] = useState('fa-solid fa-x fa-5x');
    const [isClicked, setIsClicked] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [tileStates, setTileStates] = useState(Array(9).fill(null));
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);
    const [gameState, setGameState] = useState<GameStateType>(['', '', '', '', '', '', '', '', '']);
    const [playerNumber, setPlayerNumber] = useState<number | null>(null);
    
    
    useEffect(() => {
        socket.on('playerNumber', (number: number) => {
            setPlayerNumber(number);
            console.log("playerNumber", number);
        });
        return () => { socket.off('playerNumber'); }
    }, []);

    useEffect(() => {
        const gameOver = (arg: React.SetStateAction<boolean>) => {
            setGameOver(arg);
            console.log("gameOver")
        }

        socket.on("gameOver", gameOver);
        return () => { socket.off("gameOver", gameOver) }  
    }, [gameOver]);


    const handleTileClick = (index: number) => {
        if ((playerNumber === 1 && xTurn) || (playerNumber === 2 && !xTurn)) {
            if (gameState[index] !== '' || gameOver) {
                return;
            } 
            setClickedIndex(index);
            const newGameState: GameStateType = [...gameState];
            console.log(gameState)
            console.log(xTurn)
            socket.emit('tileClicked', xTurn);
            console.log('before'+index)
            newGameState[index] = xTurn ? 'X' : 'O';
            console.log('after'+index)
            console.log(newGameState[index])
            socket.emit('gameState', newGameState);
            setXTurn(!xTurn); 
        }
    }

    useEffect(() => {
        const turnChange = (arg: boolean | ((prevState: boolean | null) => boolean | null) | null) => {
            setXTurn(arg);
            console.log("turnChange")
            console.log('turnChange'+arg)
        }
    
        socket.on("turn", turnChange);
        return () => { socket.off("turn", turnChange) }
    }, []);
    useEffect(() => {
        const gameOver = (arg: React.SetStateAction<boolean>) => {
            setGameOver(arg);
            console.log("gameOver")
        }
        socket.on("gameOver", gameOver);
        return () => { socket.off("gameOver", gameOver) }  
    }, [gameOver]);
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
                socket.emit('gameOver', true);
                setGameOver(true);
            }
        }
    }, [clickedIndex, xTurn, isClicked, gameState]);
    
    useEffect(() => {
        const handleTileState = (newTileStates: SetStateAction<string[]>) => {
            setTileStates(newTileStates);
        };
    
        socket.on('tileState', handleTileState);
    
        // Clean up the event listener when the component unmounts
        return () => {
            socket.off('tileState', handleTileState);
        };
    }, []);
    useEffect(() => {
        const newTileStates: string[] = [...tileStates];
        if (letterIcon !== null && clickedIndex !== null && newTileStates[clickedIndex] === null ) {
            console.log(tileStates)
            const newTileStates = [...tileStates];
            if (clickedIndex !== null) {
                newTileStates[clickedIndex] = letterIcon;
            }
            setTileStates(newTileStates);
            socket.emit('tileState', newTileStates);
        }
        
    }, [tileStates, letterIcon, clickedIndex])
    useEffect(() => {
        const handleGameState = (arg: GameStateType) => {
            setGameState([...arg]);
            console.log("gameState"+arg)
        }

        socket.on('gameState', handleGameState);
        return () => { socket.off('gameState', handleGameState) }
    }, []);
    useEffect(() => {
        if (letterIcon !== null && clickedIndex !== null && gameState[clickedIndex] === '') {
            const newGameState = [...gameState];
            newGameState[clickedIndex] = letterIcon;
            setGameState(newGameState);
            socket.emit('gameState', newGameState);
        }
    }, [gameState, letterIcon, clickedIndex]);    
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
        if (gameOver) {
            socket.emit('reset');
        }
    };

    useEffect(() => {
        const handleResetEvent = () => {
            console.log('reset');
            handleReset();
        };
    
        socket.on('reset', handleResetEvent);

        return () => {
            socket.off('reset', handleResetEvent);
        };
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
import { SetStateAction, useEffect, useState } from "react"
import Board from "./Board"
import GameOver from "./GameOver"
import Reset from "./Reset"
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

    useEffect(() => {
        const gameOver = (arg: React.SetStateAction<boolean>) => {
            setGameOver(arg);
            console.log("gameOver")
        }

        socket.on("gameOver", gameOver);
        return () => { socket.off("gameOver", gameOver) }  
    }, [gameOver]);

    useEffect(() => {
        const turnChange = (arg: boolean | ((prevState: boolean | null) => boolean | null) | null) => {
            setXTurn(arg);
        }
    
        socket.on("turnChange", turnChange);
        return () => { socket.off("turnChange", turnChange) }
    }, []);
    const handleTileClick = (index: number) => { 
        setClickedIndex(index);
        setXTurn(!xTurn); 
        const newGameState: GameStateType = [...gameState];
        newGameState[index] = xTurn ? 'X' : 'O';
        setGameState(newGameState);
        console.log(gameState)
        socket.emit('tileClicked', xTurn);
        
    }
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
        if (clickedIndex !== null) {
            gameState[clickedIndex] = !xTurn ? 'X' : 'O';
        }
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
        const newTileStates = [...tileStates];
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
        if (gameOver && winner === null) {
            setWinner(!xTurn ? 'X' : 'O');
        }
    }, [winner, xTurn, gameOver]);

    return (
    <div className="ticTacToe">
        <h1>Tic Tac Toe</h1>
        <GameOver isGameOver={gameOver} gameWinner={winner}/>
        <Reset />
        <Board isClicked={isClicked} tileStates={tileStates} onTileClick={handleTileClick} letterIcon={letterIcon} setIsClicked={setIsClicked} gameOver={gameOver}/>
    </div>
    )
}

export default TicTacToe
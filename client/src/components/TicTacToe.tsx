import { useEffect, useState } from "react"
import Board from "./Board"
import GameOver from "./GameOver"
import Reset from "./Reset"
import { io } from "socket.io-client"

const socket = io("http://localhost:3000")


const TicTacToe = () => {
    const [gameOver, setGameOver] = useState(false);
    const [xTurn, setXTurn] = useState(true);
    const [letterIcon, setLetterIcon] = useState('fa-solid fa-x fa-5x');
    const [isClicked, setIsClicked] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);
    const [tileStates, setTileStates] = useState(Array(9).fill(null));
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);
    
    const handleTileClick = (index: React.SetStateAction<number | null>) => {   
        console.log(xTurn)
        console.log(isClicked)
        console.log(gameOver)
        if (xTurn === null && gameOver) {
            setLetterIcon('hidden');
        }
        setXTurn(!xTurn); 
        setClickedIndex(index);
        
    }
    useEffect(() => {
        if (isClicked && xTurn !== null && !gameOver) {
            setLetterIcon(xTurn ? 'fa-solid fa-x fa-5x' : 'fa-solid fa-o fa-5x');
            console.log(letterIcon)
        }
        !gameOver && setIsClicked(true);
        
    }, [isClicked, xTurn, gameOver, letterIcon])
    
    useEffect(() => {
        const newTileStates = [...tileStates];
        if (letterIcon !== null && clickedIndex !== null && newTileStates[clickedIndex] === null ) {
            console.log(clickedIndex)
            const newTileStates = [...tileStates];
            if (clickedIndex !== null) {
                newTileStates[clickedIndex] = letterIcon;
            }
            setTileStates(newTileStates);
        }
        
    }, [clickedIndex, letterIcon, tileStates])

    useEffect(() => {
        if (gameOver && winner === null) {
            setWinner(!xTurn ? 'X' : 'O');
        }
    }, [gameOver, xTurn, winner]);

    useEffect(() => {
        const gameOver = (arg: React.SetStateAction<boolean>) => {
            setGameOver(arg);
            console.log("gameOver")
        }

        socket.on("gameOver", gameOver);
        return () => { socket.off("gameOver", gameOver) }  
    }, [gameOver]);

    useEffect(() => {
        const turnChange = (arg: React.SetStateAction<boolean>) => {
            console.log("turnChange")
            console.log(arg)
            setXTurn(arg);
            if (arg === null && gameOver) {
                setLetterIcon('hidden');
            }
            if (isClicked && arg !== null && !gameOver) {
                setLetterIcon(!arg ? 'fa-solid fa-x fa-5x' : 'fa-solid fa-o fa-5x');
            } else {
                setLetterIcon('hidden');
            }
        }
        socket.on("turnChange", turnChange);
        return () => { socket.off("turnChange", turnChange) }
    }, [gameOver, isClicked, xTurn]);

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
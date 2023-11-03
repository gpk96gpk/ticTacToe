import { useEffect, useState } from "react"
import Board from "./Board"
import GameOver from "./GameOver"
import Reset from "./Reset"
import { io } from "socket.io-client"

const socket = io("http://localhost:3000")


const TicTacToe = () => {
    const [gameOver, setGameOver] = useState(false);
    const [xTurn, setXTurn] = useState(Boolean);
    const [letterIcon, setLetterIcon] = useState('fa-solid fa-x fa-5x');
    const [isClicked, setIsClicked] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);


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
        <Board letterIcon={letterIcon} setIsClicked={setIsClicked} gameOver={gameOver}/>
    </div>
    )
}

export default TicTacToe
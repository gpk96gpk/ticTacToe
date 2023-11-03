import { useEffect, useState } from "react"
import Board from "./Board"
import GameOver from "./GameOver"
import Reset from "./Reset"
import { io } from "socket.io-client"

const socket = io("http://localhost:3000")


const TicTacToe = () => {
    const [gameOver, setGameOver] = useState(false);
    const [xTurn, setXTurn] = useState(Boolean);

    useEffect(() => {
        socket.on("gameOver", (arg) => {
            setGameOver(arg);
            console.log("gameOver")
        });
        return () => { socket.off("gameOver") }  
    }, []);

    useEffect(() => {
        socket.on("turnChange", (arg) => {
            setXTurn(arg);
            console.log("turnChange")
        });
        return () => { socket.off("turnChange") }
    }, []);

    return (
    <div className="ticTacToe">
        <h1>Tic Tac Toe</h1>
        <GameOver isGameOver={gameOver} isXTurn={xTurn}/>
        <Reset />
        <Board />
    </div>
    )
}

export default TicTacToe
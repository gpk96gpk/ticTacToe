import Reset from "./ResetButton";
import { GameOverTypes } from "../types/tictactoe";



const GameOver: React.FC<GameOverTypes> = ({ handleReset, isGameOver, gameWinner }) => {
    let gameOverClass = "hidden";
    if (isGameOver) {
        gameOverClass = "gameOver";
    }
    return (
    <div className={gameOverClass}>
        <h1>Game Over</h1>
        <h1>{gameWinner}</h1>
        <Reset handleReset={handleReset} isGameOver={isGameOver} />
    </div>
    )
}

export default GameOver
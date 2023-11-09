import Reset from "./ResetButton";
import { GameOverTypes } from "../types/clientTypes";

const GameOver: React.FC<GameOverTypes> = ({ handleReset, isGameOver, gameWinner }) => {
    let gameOverClass = "display-none";
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
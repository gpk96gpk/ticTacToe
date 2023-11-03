type GameOverProps = {
    isGameOver: boolean;
    isXTurn: boolean;
  };


const GameOver: React.FC<GameOverProps> = ({ isGameOver, isXTurn }) => {
    let gameOverClass = "display-none";
    if (isGameOver) {
        gameOverClass = "gameOver";
    }
    return (
    <div className={gameOverClass}>
        <h1>Game Over</h1>
        <h1>{isXTurn ? "X" : "O"} Wins!</h1>
    </div>
    )
}

export default GameOver
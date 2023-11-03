type GameOverProps = {
    isGameOver: boolean;
    gameWinner: string | null;
  };


const GameOver: React.FC<GameOverProps> = ({ isGameOver, gameWinner }) => {
    let gameOverClass = "display-none";
    if (isGameOver) {
        gameOverClass = "gameOver";
    }
    return (
    <div className={gameOverClass}>
        <h1>Game Over</h1>
        <h1>{gameWinner} Wins!</h1>
    </div>
    )
}

export default GameOver
import Board from "./Board"
import GameOver from "./GameOver"
import Reset from "./Reset"

const TicTacToe = () => {
    return (
    <div className="ticTacToe">
        <Board />
        <GameOver />
        <Reset />
    </div>
    )
}

export default TicTacToe
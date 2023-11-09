import { ResetButtonProps } from "../types/tictactoe";

const ResetButton: React.FC<ResetButtonProps> = ({handleReset, isGameOver}) => {
    let resetClass = "hidden";
    if (isGameOver) {
        resetClass = "gameOver";
    }
    return (
        <div className={resetClass}>
            <button onClick={handleReset}>Reset</button>
        </div>
    )
}

export default ResetButton
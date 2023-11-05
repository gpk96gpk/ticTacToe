interface ResetButtonProps {
    isGameOver: boolean;
    handleReset: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({handleReset, isGameOver}) => {
    let resetClass = "display-none";
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
import Tile from './Tile';
import { BoardTypes } from '../types/clientTypes';

const Board:React.FC<BoardTypes> = ({gameState, onTileClick, isClicked, setIsClicked}) => {

    return (
        <>
            <div className="board">
                {gameState.map((letterIcon, index) => (
                    <Tile onClick={() => onTileClick(index)} letterIcon={letterIcon} 
                    isClicked={isClicked} key={index} setIsClicked={setIsClicked} />
                ))}
            </div>
        </>
    );
                }
export default Board;
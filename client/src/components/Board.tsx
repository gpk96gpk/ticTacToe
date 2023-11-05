import Tile from './Tile';
import { BoardTypes } from '../types/tictactoe';


const Board:React.FC<BoardTypes> = ({tileStates, onTileClick, isClicked, setIsClicked}) => {


    return (
        <>
            <div className="board">
                {tileStates.map((letterIcon, index) => (
                    <Tile onClick={() => onTileClick(index)} letterIcon={letterIcon} isClicked={isClicked} key={index} setIsClicked={setIsClicked} />
                ))}
            </div>
        </>
    );
                }
export default Board;
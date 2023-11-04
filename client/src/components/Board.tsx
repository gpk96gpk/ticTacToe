import Tile from './Tile';
import { BoardTypes } from '../types/tictactoe';


const Board:React.FC<BoardTypes> = ({tileStates, onTileClick, setIsClicked}) => {


    return (
        <>
            <div className="board">
                {tileStates.map((letterIcon, index) => (
                    <Tile onClick={() => onTileClick(index)} letterIcon={letterIcon} key={index} setIsClicked={setIsClicked} />
                ))}
            </div>
        </>
    );
                }
export default Board;
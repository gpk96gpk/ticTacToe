import { useState } from 'react';
import Tile from './Tile';


const Board = () => {
    const [tileStates, setTileStates] = useState(Array(9).fill(false));

    const handleTileClick = (index: number) => {
        const newTileStates = [...tileStates];
        if (!newTileStates[index]) {
            newTileStates[index] = true;
            setTileStates(newTileStates);
        }
    }

    return (
        <>
            <div className="board">
                {tileStates.map((isClicked, index) => (
                    <Tile key={index} id={index} isClicked={isClicked} handleClick={() => handleTileClick(index)} />
                ))}
            </div>
        
        </>
    );
}

export default Board;
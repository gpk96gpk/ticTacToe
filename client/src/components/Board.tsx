import { useState } from 'react';
import Tile from './Tile';

const Board = () => {
    const [tileStates, setTileStates] = useState(Array(9).fill(null));

    const handleTileClick = (index: number) => {
        const newTileStates = [...tileStates];
        if (!newTileStates[index]) {
            newTileStates[index] = true;
            setTileStates(newTileStates);
        }
    }

    return (
        <>
            <h1>Tic Tac Toe</h1>
            <div className="board">
                {tileStates.map((isClicked, index) => (
                    <Tile key={index} id={index} isClicked={isClicked} handleClick={() => handleTileClick(index)} />
                ))}
            </div>
        
        </>
    );
}

export default Board;
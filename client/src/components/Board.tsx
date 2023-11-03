import { useState } from 'react';
import Tile from './Tile';
import { io } from 'socket.io-client';
import { BoardTypes } from '../types/tictactoe';
const socket = io('http://localhost:3000')


const Board:React.FC<BoardTypes> = ({letterIcon, isClicked, setIsClicked, gameOver}) => {
    const [tileStates, setTileStates] = useState(Array(9).fill(null));
    
    const handleTileClick = (index: number) => {
        const newTileStates = [...tileStates];
        const allNull = tileStates.every(element => element === null);
        console.log('handleTileClick')
        console.log('isClicked'+isClicked)
        console.log('allNull'+allNull)
        if (!newTileStates[index] || allNull) {
            !gameOver && setIsClicked(true);
            newTileStates[index] = letterIcon;
            setTileStates(newTileStates);
            socket.emit('tileClicked', index);
            console.log(index)
        }
    }

    return (
        <>
            <div className="board">
                {tileStates.map((tileLetterIcon, index) => (
                    <Tile letterIcon={tileLetterIcon} key={index} setIsClicked={setIsClicked} isClicked={isClicked} handleClick={() => handleTileClick(index)} />
                ))}
            </div>
        </>
    );
                }
export default Board;
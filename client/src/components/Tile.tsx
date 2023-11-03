import { useContext, useEffect, useState} from "react"
import { TicTacToeContext } from "../context/TicTacToeContext"
import { TileProps } from "../types/tictactoe"
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000')



const Tile = ({ id, children }: TileProps) => {
    const { isXTurn } = useContext(TicTacToeContext);
    const [isClicked, setIsClicked] = useState(false);
    const [letterIcon, setLetterIcon] = useState('hidden');

    useEffect(() => {
        socket.on('turnChange', (arg) => {
            console.log(arg)
            if (arg === null) {
                setLetterIcon('hidden');
            }
            if (isClicked && arg !== null) {
                setLetterIcon(arg ? 'fa-solid fa-x fa-5x' : 'fa-solid fa-o fa-5x');
            } else {
                setLetterIcon('hidden');
            }
        });
        return () => {
            socket.off('turnChange');
        };
        
    }, [isClicked, isXTurn]);
    
    const handleClick = () => {
        if (!isClicked) {
            setIsClicked(true);
            socket.emit('tileClicked', id);
            console.log(id)
        }
        
    }

    return (
        <div id={String(id)} className={'tile'} onClick={handleClick}>
            <i className={ letterIcon }></i>
            {children}
        </div>
    )

}

export default Tile
    // const [isClicked, setIsClicked] = useState(false)
import { useContext, useEffect, useState} from "react"
import { TicTacToeContext } from "../context/TicTacToeContext"
import { TicTacToeContextState, TileProps } from "../types/tictactoe"
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000')



const Tile = ({ id, children }: TileProps) => {
    const { isXTurn, setIsXTurn } = useContext(TicTacToeContext);
    const [isClicked, setIsClicked] = useState(false);
    const [letterIcon, setLetterIcon] = useState('hidden');

    console.log('isXTurn'+isXTurn);
    useEffect(() => {
        socket.on('turnChange', (arg) => {
            if (isClicked) {
                setLetterIcon(arg ? 'fa-solid fa-x fa-5x' : 'fa-solid fa-o fa-5x');
                console.log(arg)
            }
            console.log('isXTurn'+arg);
        });

        // if (isClicked) {
        //     setLetterIcon(isXTurn ? 'fa-solid fa-x fa-5x' : 'fa-solid fa-o fa-5x');
        //     console.log(isXTurn)
        // }
        return () => {
            socket.off('turnChange');
        };
    }, [isClicked, isXTurn]);

    const handleClick = () => {
        if (!isClicked) {
            console.log('isClicked'+isClicked);
            
            setIsClicked(true);
            // setIsXTurn(!isXTurn);
            setLetterIcon(isXTurn ? 'fa-solid fa-x fa-5x' : 'fa-solid fa-o fa-5x');
            socket.emit('tileClicked', true);
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
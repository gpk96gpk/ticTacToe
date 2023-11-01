import { useContext, useState} from "react"
import { TicTacToeContext } from "../context/TicTacToeContext"
import { TicTacToeContextState, TileProps } from "../types/tictactoe"
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000')


const Tile = ({ id, children }: TileProps) => {
    const { isXTurn }:TicTacToeContextState = useContext(TicTacToeContext);
    

    const [isClicked, setIsClicked] = useState(Boolean)
    const handleClick = () => {
        setIsClicked(true)
        console.log(isClicked)
        console.log(isXTurn)
        socket.emit('tileClicked', true)
        let letterIcon: string = 'hidden';
        if (isXTurn && isClicked) {
            letterIcon = 'fa-solid fa-x fa-5x';
        } else if (!isXTurn && isClicked) {
            letterIcon = 'fa-solid fa-o fa-5x';
        }
        console.log(letterIcon)
    }

    return (
        <div id={String(id)} className={'tile'} onClick={handleClick}>
            <i className={ isXTurn && isClicked ? 'fa-solid fa-x fa-5x' : !isXTurn && isClicked ? 'fa-solid fa-o fa-5x' : 'hidden' }></i>
            {children}
        </div>
    )

}

export default Tile
    // const [isClicked, setIsClicked] = useState(false)
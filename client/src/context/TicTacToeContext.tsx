import {createContext, useState} from 'react';
import { io } from 'socket.io-client';
import { TicTacToeContextProps } from '../types/tictactoe';


const socket = io("http://localhost:3000")

export const TicTacToeContext = createContext({
    isClicked: false,
    setIsClicked: () => {},
    isXTurn: true,
    setIsXTurn: () => {},
})


export const TicTacToeContextProvider: React.FC<TicTacToeContextProps> = (props) => {
    const [isClicked, setIsClicked] = useState(false)
    const [isXTurn, setIsXTurn] = useState(true)

    const handleClick = () => {
        setIsClicked(true)
        setIsXTurn(!isXTurn)
        //socket.emit('tileClicked', isClicked)

    }
    //make isXTurn from socket.on to log turn
    socket.on('changeTurn', (isPlayerTurn) => {
        setIsXTurn(isPlayerTurn);
    })

    return (
        <TicTacToeContext.Provider value={{ isXTurn, setIsXTurn, isClicked, setIsClicked, handleClick }}>
            {props.children}
        </TicTacToeContext.Provider>
    );
}
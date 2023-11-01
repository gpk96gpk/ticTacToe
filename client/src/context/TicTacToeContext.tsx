import {createContext, useState} from 'react';
import { io } from 'socket.io-client';
import { TicTacToeContextProps } from '../types/tictactoe';


const socket = io("http://localhost:3000")

export const TicTacToeContext = createContext({

})

import React from 'react';

export const TicTacToeContextProvider: React.FC<TicTacToeContextProps> = ({ children }) => {
    const [isClicked, setIsClicked] = useState(false)
    let isXTurn: boolean= true;

    const handleClick = () => {
        setIsClicked(!isClicked)
        console.log(isClicked)
        socket.emit('tileClicked', isClicked)
        console.log(isXTurn)

    }
    //make isXTurn from socket.on to log turn
    socket.on('isXTurn', (isPlayerTurn) => {
        console.log(isPlayerTurn)
        isXTurn = isPlayerTurn;
        console.log(isXTurn)
    })

    return (
        <TicTacToeContext.Provider value={{ isXTurn, isClicked, setIsClicked, handleClick }}>
            {children}
        </TicTacToeContext.Provider>
    );
}
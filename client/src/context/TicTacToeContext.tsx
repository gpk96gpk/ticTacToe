// import {createContext, useState} from 'react';
// import { TicTacToeContextProps } from '../types/tictactoe';
// // import { io } from 'socket.io-client';


// // const socket = io("http://localhost:3000")

// export const TicTacToeContext = createContext({
//     isXTurn: true,
// })


// export const TicTacToeContextProvider: React.FC<TicTacToeContextProps> = (props) => {
//     // const [isXTurn, setIsXTurn] = useState(true)

//     // socket.on('changeTurn', (isPlayerTurn) => {
//     //     setIsXTurn(isPlayerTurn);
//     // })

//     return (
//         <TicTacToeContext.Provider value={{ isXTurn }}>
//             {props.children}
//         </TicTacToeContext.Provider>
//     );
// }
import { useEffect, useContext } from "react"
import Board from "./Board"
import GameOver from "./GameOver"
import { GameStateType, TicTacToeProps } from "../types/tictactoe"
import { SocketContext } from "../context/SocketContext";
import { useParams } from "react-router-dom";
//import { useParams } from 'react-router-dom';


const TicTacToe: React.FC<TicTacToeProps> = (props) => {
    const { roomCode } = useParams();
    console.log(roomCode)
    const socket = useContext(SocketContext);

    const handleTileClick = (index: number) => {
        console.log("playerNumber" + props.playerNumber)
        console.log("xTurn" + props.xTurn)
        console.log(socket)
        if ((props.playerNumber === 1 && props.xTurn) || (props.playerNumber === 2 && !props.xTurn)) {
            if (props.gameState[index] !== '' || props.gameOver) {
                return;
            }
            props.setClickedIndex(index);
            const newGameState: GameStateType = [...props.gameState];
            newGameState[index] = props.xTurn ? 'fa-solid fa-x fa-5x' : 'fa-solid fa-o fa-5x';
            console.log(props.gameState)
            console.log(props.xTurn)
            props.setGameState(newGameState)
            props.setTileStates([...newGameState]);
            if (socket) {
                //console.log('sentPlayerNumber'+playerNumber)
                socket.emit('tileClicked', !props.xTurn, roomCode);
            }
            props.setXTurn(!props.xTurn);
            if (socket) {
                console.log("sentGameState" + newGameState)
                socket.emit('gameState', newGameState, roomCode);
            }
        }
    }

    useEffect(() => {
        if (props.gameOver) {
            props.setXTurn(null);
        }
        if (props.isClicked && props.xTurn !== null && !props.gameOver) {
            props.setLetterIcon(props.xTurn ? 'fa-solid fa-x fa-5x' : 'fa-solid fa-o fa-5x');
            //console.log(letterIcon)
        }
        if (props.xTurn === null && props.gameOver) {
            props.setLetterIcon('hidden');
        }
        !props.gameOver && props.setIsClicked(true);

    }, [props, props.isClicked, props.xTurn])

    useEffect(() => {
        const victoryConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (let i = 0; i < victoryConditions.length; i++) {
            const condition = victoryConditions[i];

            if (props.gameState[condition[0]] === props.gameState[condition[1]] && props.gameState[condition[1]] === props.gameState[condition[2]] && props.gameState[condition[0]] !== '') {
                console.log('game over');
                if (socket) {
                    socket.emit('gameOver', true, roomCode);
                }
                props.setGameOver(true);
            } else if (!props.gameState.includes('')) {
                console.log('draw');
                props.setWinner('Its a Draw')
                if (socket) {
                    socket.emit('draw', true, roomCode);
                }
                props.setGameOver(true);
            }
        }
    }, [props.gameState, socket, props, roomCode]);

    useEffect(() => {
        const newTileStates: string[] = [...props.gameState];
        console.log("newTileStates" + props.gameState)
        // console.log("letterIcon"+letterIcon)
        // console.log("clickedIndex"+clickedIndex)
        if (props.letterIcon !== null && props.clickedIndex !== null && newTileStates[props.clickedIndex] === '') {
            //console.log(tileStates)
            const newTileStates = [...props.gameState];
            if (props.clickedIndex !== null) {
                newTileStates[props.clickedIndex] = props.letterIcon;
            }
            props.setTileStates([...newTileStates]);
            if (socket) {
                console.log("sendingTileState" + newTileStates)
                socket.emit('tileState', newTileStates, roomCode);
            }
        }

    }, [props.tileStates, props.letterIcon, props.clickedIndex, props.gameState, socket, props, roomCode])

    useEffect(() => {
        if (props.letterIcon !== null && props.clickedIndex !== null && props.gameState[props.clickedIndex] === '') {
            const newGameState = [...props.gameState];
            newGameState[props.clickedIndex] = props.letterIcon;
            props.setGameState(newGameState);
            // if (socket) {
            //     console.log("sentGameState"+newGameState)
            //     socket.emit('gameState', newGameState);
            // }
        }
    }, [props.gameState, props.letterIcon, props.clickedIndex, props]);

    useEffect(() => {
        if (props.gameOver && props.winner === null) {
            let newWinner;
            if (!props.xTurn) {
                newWinner = 'X Wins!'
            } else if (props.xTurn) {
                newWinner = 'O Wins!'
            } else {
                newWinner = 'Its a Draw';
            }

            props.setWinner(newWinner);
        }
    }, [props.winner, props.xTurn, props]);

    return (
        <div className="ticTacToe">
            <h1>Tic Tac Toe</h1>
            <GameOver handleReset={props.handleReset} isGameOver={props.gameOver} gameWinner={props.winner} />
            <Board isClicked={props.isClicked} tileStates={props.gameState} onTileClick={handleTileClick} letterIcon={props.letterIcon} setIsClicked={props.setIsClicked} gameOver={props.gameOver} />
        </div>
    )
}

export default TicTacToe
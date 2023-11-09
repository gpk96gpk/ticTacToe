import { useEffect, useContext } from "react"
import Board from "./Board"
import GameOver from "./GameOver"
import { GameStateType, TicTacToeProps } from "../types/clientTypes"
import { SocketContext } from "../context/SocketContext";
import { useParams } from "react-router-dom";

const TicTacToe: React.FC<TicTacToeProps> = (props) => {
    const { roomCode } = useParams();
    const socket = useContext(SocketContext);

    const handleTileClick = (index: number) => {
        if ((props.playerNumber === 1 && props.xTurn) || (props.playerNumber === 2 && !props.xTurn)) {
            if (props.gameState[index] !== '' || props.gameOver) {
                return;
            }
            props.setClickedIndex(index);
            const newGameState: GameStateType = [...props.gameState];
            newGameState[index] = props.xTurn ? 'fa-solid fa-x fa-5x' : 'fa-solid fa-o fa-5x';
            props.setGameState([...newGameState])
            props.setTileStates([...newGameState]);
            if (socket) {
                socket.emit('tileClicked', !props.xTurn, roomCode);
            }
            props.setXTurn(!props.xTurn);
            if (socket) {
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

            if (props.gameState[condition[0]] === props.gameState[condition[1]] &&
                props.gameState[condition[1]] === props.gameState[condition[2]] &&
                props.gameState[condition[0]] !== '') {
                if (socket) {
                    socket.emit('gameOver', true, roomCode);
                }
                props.setGameOver(true);
            } else if (!props.gameState.includes('')) {
                props.setWinner('Its a Draw')
                if (socket) {
                    socket.emit('draw', true, roomCode);
                }
                props.setGameOver(true);
            }
        }
    }, [props.gameState, socket, props, roomCode]);

    useEffect(() => {
        if (props.letterIcon !== null && props.clickedIndex !== null &&
            props.gameState[props.clickedIndex] === '') {
            const newGameState = [...props.gameState];
            newGameState[props.clickedIndex] = props.letterIcon;
            props.setGameState([...newGameState]);
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
            <h3>Room Code:{roomCode}</h3>
            {props.playerNumber === 1 && props.xTurn && <h2>Your turn</h2>}
            {props.playerNumber === 2 && props.xTurn && <h2>Opponent's turn</h2>}
            {props.playerNumber === 2 && !props.xTurn && <h2>Your turn</h2>}
            {props.playerNumber === 1 && !props.xTurn && <h2>Opponent's turn</h2>}
            <GameOver handleReset={props.handleReset} isGameOver={props.gameOver} gameWinner={props.winner} />
            <Board isClicked={props.isClicked} gameState={props.gameState} onTileClick={handleTileClick}
                letterIcon={props.letterIcon} setIsClicked={props.setIsClicked} gameOver={props.gameOver} />
        </div>
    )
}

export default TicTacToe
import Tile from "./Tile"
import Strike from "./Strike"
import TurnIndicator from "./TurnIndicator"
import { TicTacToeContextProvider } from "../context/TicTacToeContext"

const Board = () => {
    return (
        <>
            <h1>Tic Tac Toe</h1>
            <TurnIndicator />
            <div className="board">
                <TicTacToeContextProvider>
                    <Tile id={0o0}/>
                    <Tile id={0o1}/>
                    <Tile id={0o2}/>
                    <Tile id={10}/>
                    <Tile id={11}/>
                    <Tile id={12}/>
                    <Tile id={20}/>
                    <Tile id={21}/>
                    <Tile id={22}/>
                </TicTacToeContextProvider>
            </div>
            <Strike />
        </>
    )
}

export default Board
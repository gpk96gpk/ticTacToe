import { socket } from "../socket"

const TurnIndicator = () => {
    socket.on('isXTurn', () => {
        isXTurn ? document.querySelector('.yourTurn')?.classList.add('turn') : document.querySelector('.opponentsTurn')?.classList.add('turn')
    }   )
    return (
        <div>
            <h2 className='yourTurn'>Your Turn</h2>
            <h2 className='opponentsTurn'>Opponent's Turn</h2>
        </div>
    )
}

export default TurnIndicator
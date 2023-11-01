import CreateRoom from "./CreateRoom"
import JoinRoom from "./JoinRoom"

const LobbyPage = () => {
    return (
        <>
            <h1>Welcome to Tic Tac Toe Lobby!</h1>
            <JoinRoom />
            <CreateRoom />
        </>
    )
}

export default LobbyPage
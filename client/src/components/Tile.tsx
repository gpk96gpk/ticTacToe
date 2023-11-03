import { TileProps } from "../types/tictactoe"

const Tile = ({ id, letterIcon, handleClick, children }: TileProps) => {
    
    return (
        <div id={String(id)} className={'tile'} onClick={handleClick}>
            <i className={ letterIcon }></i>
            {children}
        </div>
    )

}

export default Tile
    // const [isClicked, setIsClicked] = useState(false)
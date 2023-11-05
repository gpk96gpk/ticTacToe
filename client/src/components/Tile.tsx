import { TileProps } from "../types/tictactoe"

const Tile = ({ onClick, id, letterIcon, isClicked, children }: TileProps) => {
    
    return (
        <div id={String(id)} className={'tile'} isClicked={isClicked} onClick={onClick}>
            <i className={ letterIcon }></i>
            {children}
        </div>
    )

}

export default Tile
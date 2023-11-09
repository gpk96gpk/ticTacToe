import { TileProps } from "../types/clientTypes"

const Tile = ({ onClick, id, letterIcon, children }: TileProps) => {
    
    return (
        <div id={String(id)} className={'tile'} onClick={onClick}>
            <i className={ letterIcon }></i>
            {children}
        </div>
    )

}

export default Tile
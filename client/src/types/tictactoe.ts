export interface TileProps {
    id: number;
    children?: React.ReactNode;
}

export type VisibleLetter = 'x-is-visible' | 'o-is-visible' | 'hidden' | 'display-none'

export type TicTacToeContextProps = {
    children: React.ReactNode;
}

export interface TicTacToeContextState {
    handleClick?: () => void,
    isXTurn?: boolean,
    isClicked?: boolean,
}
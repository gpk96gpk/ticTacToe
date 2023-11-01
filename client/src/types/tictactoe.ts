export interface TileProps {
    id: number;
    children?: React.ReactNode;
    isClicked: boolean;
    handleClick: () => void;
}

export type VisibleLetter = 'x-is-visible' | 'o-is-visible' | 'hidden' | 'display-none'

export type TicTacToeContextProps = {
    children: React.ReactNode;
    setIsClicked: () => void;
    setIsXTurn: () => void;
}

export interface TicTacToeContextState {
    isXTurn: boolean;
    setIsXTurn: () => void;
    isClicked: boolean;
    setIsClicked: () => void;
    handleClick: () => void;
    
}
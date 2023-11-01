export interface TileProps {
    id: number;
    children?: React.ReactNode;
    isClicked: boolean;
    handleClick: () => void;
}

export type VisibleLetter = 'x-is-visible' | 'o-is-visible' | 'hidden' | 'display-none'

export type TicTacToeContextProps = {
    children: React.ReactNode;
}

export interface TicTacToeContextState {
    isXTurn: boolean;
    setIsXTurn: React.Dispatch<React.SetStateAction<boolean>>;
    isClicked: boolean;
    setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
    handleClick: () => void;
    
}
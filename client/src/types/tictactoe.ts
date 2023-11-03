import { Dispatch, SetStateAction } from "react";

export interface TileProps {
    id: number;
    children?: React.ReactNode;
    isClicked: boolean;
    handleClick: () => void;
}

export type TicTacToeContextProps = {
    children: React.ReactNode;
    setIsClicked: Dispatch<SetStateAction<boolean>>;
    setIsXTurn: Dispatch<SetStateAction<boolean>>;
}
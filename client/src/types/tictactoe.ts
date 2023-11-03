import { Dispatch, SetStateAction } from "react";

export interface TileProps {
    id?: number;
    letterIcon: string;
    key: number;
    children?: React.ReactNode;
    isClicked: boolean | null | undefined;
    setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
    handleClick: React.MouseEventHandler<HTMLDivElement>;
}

export type BoardTypes = {
    letterIcon: string;
    isClicked?: boolean | null;
    setIsClicked: Dispatch<React.SetStateAction<boolean>>;
    gameOver: boolean | null;
}

export type TicTacToeContextProps = {
    children: React.ReactNode;
    setIsClicked: Dispatch<SetStateAction<boolean>>;
    setIsXTurn: Dispatch<SetStateAction<boolean>>;
}
import { Dispatch, SetStateAction } from "react";

export interface TileProps {
    id?: number;
    letterIcon: string;
    key: number;
    children?: React.ReactNode;
    isClicked?: boolean | null | undefined;
    setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
    handleClick?: React.MouseEventHandler<HTMLDivElement>;
    onClick: React.MouseEventHandler<HTMLDivElement>;
}

export type BoardTypes = {
    letterIcon: string;
    isClicked?: boolean | null;
    setIsClicked: Dispatch<React.SetStateAction<boolean>>;
    gameOver: boolean | null;
    tileStates: string[];
    onTileClick: (index: number) => void;
}

export type GameOverTypes = {
    isGameOver: boolean;
    gameWinner: string | null;
    handleReset: () => void;
};

export type GameStateType = [string, string, string, string, string, string, string, string, string] | string[];

export type TicTacToeContextProps = {
    children: React.ReactNode;
    setIsClicked: Dispatch<SetStateAction<boolean>>;
    setIsXTurn: Dispatch<SetStateAction<boolean>>;
}
import { Dispatch, SetStateAction } from "react";


export interface TileProps {
    id?: number;
    letterIcon: string;
    key: number;
    children?: React.ReactNode;
    isClicked?: boolean | null | undefined;
    setIsClicked: React.Dispatch<React.SetStateAction<boolean>> | SetStateAction<boolean>;
    handleClick?: React.MouseEventHandler<HTMLDivElement>;
    onClick: React.MouseEventHandler<HTMLDivElement>;
}

export type BoardTypes = {
    gameState: string[];
    letterIcon: string;
    isClicked?: boolean | null;
    setIsClicked: React.Dispatch<React.SetStateAction<boolean>> | SetStateAction<boolean>;
    gameOver: boolean;
    onTileClick: (index: number) => void;
}

export type GameOverTypes = {
    isGameOver: boolean;
    gameWinner: string | null;
    handleReset: () => void;
};

export type GameStateType = [string, string, string, string, string, string, string, string, string] | string[];

export interface TicTacToeProps {
    playerNumber: number | null;
    gameOver: boolean;
    xTurn: boolean | null;
    gameState: GameStateType;
    letterIcon: string;
    isClicked: boolean;
    winner: string | null;
    clickedIndex: number | null;
    setClickedIndex: (index: number) => void;
    setWinner: (winner: string | null) => void;
    setIsClicked: React.Dispatch<React.SetStateAction<boolean>>;
    setLetterIcon: (letterIcon: string) => void;
    setGameState: (gameState: GameStateType) => void;
    setXTurn: (xTurn: boolean | null) => void;
    setGameOver: (gameOver: boolean) => void;
    handleReset: () => void;
}

export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
    hello: () => void;
}

export interface ResetButtonProps {
    isGameOver: boolean;
    handleReset: () => void;
}


export type TicTacToeContextProps = {
    children: React.ReactNode;
    setIsClicked: Dispatch<SetStateAction<boolean>>;
    setIsXTurn: Dispatch<SetStateAction<boolean>>;
}
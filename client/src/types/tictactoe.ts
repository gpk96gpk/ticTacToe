import { Dispatch, SetStateAction } from "react";

export interface ConnectionManagerProps {

}

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
    gameState?: string[];
    tileState?: string[];
    letterIcon: string;
    isClicked?: boolean | null;
    setIsClicked: Dispatch<React.SetStateAction<boolean>>;
    gameOver: boolean ;
    tileStates: string[];
    onTileClick: (index: number) => void;
}

export type GameOverTypes = {
    isGameOver: boolean;
    gameWinner: string | null;
    handleReset: () => void;
};

export type GameStateType = [string, string, string, string, string, string, string, string, string] | string[];


export interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
  }
  
export interface ClientToServerEvents {
    hello: () => void;
}



export type TicTacToeContextProps = {
    children: React.ReactNode;
    setIsClicked: Dispatch<SetStateAction<boolean>>;
    setIsXTurn: Dispatch<SetStateAction<boolean>>;
}
type GameState = {
    board: Board;
    castleSwapStatus: CastleStatus;
    yourTurn: boolean;
    enpassant: string;
    upgrade: boolean;
    upgradeData: any;
    yourPieces: string[];
};

type Taking = { [key: string]: string };
type Board = { [key: string]: string };
type Keys = string[];
type CastleStatus = { [key: string]: boolean };
type MoveArr = {
    effects: { pos: string; piece: string }[];
    taking: Taking;
    enpassant?: string;
    upgrade?: boolean;
};

type MovePayload = {
    newBoard: Board;
    enpassant: string;
    taking: Taking;
    move: string;
};

type SetUpData = { [key: string]: string };

type Effects = { [key: string]: string };
type FallenPieces = { [key: string]: string[] };

type SquareEvent = React.FormEvent<HTMLDivElement>;
type ChatEvent = React.FormEvent<HTMLTextAreaElement>;

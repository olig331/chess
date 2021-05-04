type GameState = {
    lobbyId: string;
    oppoId: string;
    color: string;
    board: Board;
    castleSwapStatus: CastleStatus;
    fallenPieces: FallenPieces;
    yourTurn: boolean;
    enpassant: string;
};

type Board = { [key: string]: string };
type Keys = string[];
type CastleStatus = { [key: string]: boolean };
type MoveArr = {
    effects: { pos: string; piece: string }[];
    taking: string;
    enpassant?: string;
};

type Effects = { [key: string]: string };
type FallenPieces = { [key: string]: string[] };

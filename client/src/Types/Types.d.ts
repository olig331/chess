type coords = {
    y: number;
    x: number;
};

type vectorsArr = coords[];

type GameState = {
    lobbyId: string;
    board: Board;
    selected: any;
    player: Player;
};

type Pieces = King | Queen | Rook | Bishop | Pawn | Knight;

type BoardNode = Node;

type KingsPos = { coords: coords; color: string };

type castleSwapResult = { qside: boolean; kside: boolean };

type legalMovesResult = {
    move: coords;
    effects: { coords: coords; new: Piece | null; newProps: any }[];
    taking: string;
};

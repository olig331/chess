type coords = {
    y: number;
    x: number;
};

type vectorsArr = coords[];

type GameState = {
    board: Board;
    selected: any;
};

type Pieces = King | Queen | Rook | Bishop | Pawn | Knight;

type BoardNode = Node;

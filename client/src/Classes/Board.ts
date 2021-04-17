import { getClass } from "../HelperFunctions/getClass";
import { Piece } from "../Classes/Piece";

export class Board {
    public board: Node[][];
    private static startingPositions: string =
        "rnbqkbnrpppppppp................................PPPPPPPPRNBQKBNR";

    constructor() {
        this.board = this.initBoard();
    }

    public initBoard = () => {
        let result: any[][] = [],
            row: number,
            col: number;

        for (row = 0; row < 8; row++) {
            result.push([]);
            for (col = 0; col < 8; col++) {
                result[row].push(
                    new Node(
                        row,
                        col,
                        getClass(Board.startingPositions[row * 8 + col])
                    )
                );
            }
        }
        return result;
    };
}

class Node {
    public y: number;
    public x: number;
    public data: Piece | null;

    constructor(y: number, x: number, piece: any) {
        this.y = y;
        this.x = x;
        this.data = piece;
    }
}

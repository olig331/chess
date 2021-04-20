import { getClass } from "../HelperFunctions/getClass";
import { Piece } from "../Classes/Piece";
import { getVectors } from "../HelperFunctions/getVectors";

export class Board {
    public board: Node[][];
    private static startingPositions: string =
        "rnbqkbnrpp....pp................................PP....PPRNBQKBNR";

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
    //prettier-ignore
    public applyMove = (selected:any, newPos:any):Node[][] | false => {
       // console.log("apply move called")
        let i:number;
        for(i = 0; i < selected.data.moves.length; i++){
            let curr:coords = selected.data.moves[i],
                to:coords = newPos.getCoords();
            if(JSON.stringify(curr) === JSON.stringify(to)){ // if the coords in possible moves match the new sqaure allow it
                this.updateTheBoard(selected, newPos);
                return this.board;
            }
        }
        return false;
    }

    public updateTheBoard = (old: Node, newPos: Node): void => {
        this.board[newPos.y][newPos.x].data = old.data;
        this.board[old.y][old.x].data = null;
    };

    public getDeepCopy = () => {
        return JSON.parse(JSON.stringify(this.board));
    };
}

class Node {
    public y: number;
    public x: number;
    public data: Pieces | null;
    private static kingCheckVectors = [...getVectors("n"), ...getVectors("k")];
    public oppoClr: { [key: string]: string };

    constructor(y: number, x: number, piece: any) {
        this.y = y;
        this.x = x;
        this.data = piece;
        this.oppoClr = { white: "black", black: "white" };
    }

    public setNewCoords = (coords: coords) => {
        this.y = coords.y;
        this.x = coords.x;
    };

    public getCoords = (): coords => {
        return { y: this.y, x: this.x };
    };

    public getOccupiedPiece = (): Piece | null => {
        return this.data;
    };

    public getName = (): string => {
        return this.data ? this.data.getName() : "";
    };

    public getColor = (): string => {
        return this.data ? this.data.color : "";
    };

    private static inRange = (val: number): boolean => {
        return val <= 7 && val >= 0;
    };

    //pass in the board class so we can make a deep copy and update the board accoridningly and check for check
    public getPiecesMoves = (board: Board): coords[] => {
        //prettier-ignore
        let moves:coords[] = this.data.getLegalMoves({ y: this.y, x: this.x }, board.board),
            i:number,
            result:coords[] = [],
            kingData = {coords:{y:7, x:4}, color:"white"}

        if (moves) {
            for (i = 0; i < moves.length; i++) {
                let newBoard = board.getDeepCopy();
                console.log("newboard deep copy", newBoard);

                newBoard[moves[i].y][moves[i].x].data = this.data;
                newBoard[this.y][this.x].data = null;
                console.log("deep copy after moves", newBoard);

                if (!this.checkForKingInCheck(kingData, newBoard)) {
                    result.push(moves[i]);
                }
            }
        }
        return result;
    };

    // this function takes in the current kings position
    // and it takes in a copy of the board updated as if the move has been made
    // based on that fake updated board the function calculates whether the king is in check
    // if the king is in check the function returns true and the attempted move will be discarded
    public checkForKingInCheck = (kingData: any, board: Node[][]): boolean => {
        let i: number,
            kingColor = kingData.color,
            result: boolean = false;
        console.log("board in check for check", board);
        for (i = 0; i < Node.kingCheckVectors.length; i++) {
            let y: number = kingData.coords.y + Node.kingCheckVectors[i].y,
                x: number = kingData.coords.x + Node.kingCheckVectors[i].x;

            if (Node.inRange(y) && Node.inRange(x)) {
                let newSq = board[y][x],
                    name = newSq.data ? newSq.data.name : "",
                    color = newSq.data ? newSq.data.color : "";
                // checking for knights
                if (i < 8) {
                    //prettier-ignore
                    if(name === "knight" && color === this.oppoClr[kingColor]){
                        result = true;
                        console.log("knight")
                    }
                }
                // checking for diagonals
                if (i > 7 && i < 12) {
                    while (Node.inRange(y) && Node.inRange(x)) {
                        let loopCount: number = 0;
                        newSq = board[y][x];
                        name = newSq.data ? newSq.data.name : "";
                        color = newSq.data ? newSq.data.color : "";

                        if (color === kingColor) { break; } // prettier-ignore
                        if (name === "rook" || name === "knight") { break; } // prettier-ignore

                        // white king black pawns
                        if (i < 10 && loopCount < 1 && kingColor === "white") {
                            if (name === "pawn" && color === "black") { console.log("white king black pawn");result = true;break; } // prettier-ignore
                        }
                        // black king white pawns
                        if (i > 9 && loopCount < 1 && kingColor === "black") {
                            if (name === "pawn" && color === "white") { console.log("black king whitepawn"); result = true;break; } // prettier-ignore
                        }
                        if (loopCount < 1) {
                            if(name === "king" && color === this.oppoClr[kingColor]){console.log("diag count <1"); result = true; break;} // prettier-ignore
                        }

                        if (color === this.oppoClr[kingColor]) {
                            if (name === "queen" || name === "bishop") {
                                result = true;
                                console.log("diag count diag");
                                break;
                            }
                        }
                        loopCount++;
                        y += Node.kingCheckVectors[i].y;
                        x += Node.kingCheckVectors[i].x;
                    }
                }
                // Lateral checking (rooks queens)
                if (i > 11) {
                    while (Node.inRange(y) && Node.inRange(x)) {
                        let loopCount: number = 0;
                        newSq = board[y][x];
                        name = newSq.data ? newSq.data.name : "";
                        color = newSq.data ? newSq.data.color : "";

                        if(color === kingColor) { break; } //prettier-ignore
                        if(name === "bishop" || name === "pawn" || name === "knight"){ break; } // prettier-ignore

                        if (loopCount < 1) {
                            if(name === "king" && color === this.oppoClr[kingColor]){console.log("lateral count <1"); result = true; break } // prettier-ignore
                        }

                        if (color === this.oppoClr[kingColor]) {
                            if (name === "queen" || name === "rook") {
                                result = true;
                                console.log("lateral count lateral");
                                break;
                            }
                        }

                        loopCount++;
                        y += Node.kingCheckVectors[i].y;
                        x += Node.kingCheckVectors[i].x;
                    }
                }
            }
        }
        console.log(result);
        return result;
    };
}

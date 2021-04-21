import { getClass } from "../HelperFunctions/getClass";
import { Piece } from "../Classes/Piece";
import { getVectors } from "../HelperFunctions/getVectors";
import { getTag } from "../HelperFunctions/getTag";
const socket = require("../SocketConnection/Socket").socket;

export class Board {
    public board: Node[][];
    private static startingPositions: string =
        "rnbqkbnrpp....pp................................PP....PPR...K..R";

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
    public applyMove = (selected:any, newPos:any, oppoId:string):Node[][] | false => {
       // lled")
        let i:number;
        for(i = 0; i < selected.data.moves.length; i++){
            let curr:coords = selected.data.moves[i].move,
                to:coords = newPos.getCoords();
            if(JSON.stringify(curr) === JSON.stringify(to)){ // if the coords in possible moves match the new sqaure allow it
                console.log(selected.data.moves[i])
                socket.emit("sendMove", JSON.stringify({toId:oppoId, data:selected.data.moves[i]}));
                return this.updateTheBoard(selected.data.moves[i]);
            }
        }
        return false;
    }

    public updateTheBoard = (update: legalMovesResult): any => {
        let i: number;
        for (i = 0; i < update.effects.length; i++) {
            let curr: effectInstance = update.effects[i],
                name: string = curr.new ? curr.new.name : ".",
                color: string = curr.new ? curr.new.color : "";
            //prettier-ignore
            this.board[update.effects[i].coords.y][update.effects[i].coords.x]
                .data = getClass(getTag(name, color));
        }
        return this.board;
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
    //prettier-ignore
    public getPiecesMoves = (board: Board, kingData: KingsPos, inCheck:boolean): legalMovesResult[] => {
        //prettier-ignore
        let moves:legalMovesResult[] = this.data.getLegalMoves({ y: this.y, x: this.x }, board.board, inCheck),
            i:number,
            j:number,
            result:legalMovesResult[] = [];
        console.log("moves get peices moves", moves)
        if (moves) {
            for (i = 0; i < moves.length; i++) {
                console.log(moves[i])
                let newBoard = board.getDeepCopy();
                //console.log("new board",newBoard)
                let kingDataToPass;
                if (this.getName() === "king") {
                    kingDataToPass = {
                        coords: { y: moves[i].move.y, x: moves[i].move.x },
                        color: this.getColor(),
                    };
                } else {
                    kingDataToPass = kingData;
                }
                for(j = 0; j < moves[i].effects.length; j++){
                    const curr = moves[i].effects[j]
                    newBoard[curr.coords.y][curr.coords.x].data = curr.new
                }

                if (!this.checkForKingInCheck(kingDataToPass, newBoard)) {
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
                    }
                }
                // checking for diagonals
                if (i > 7 && i < 12) {
                    let loopCount: number = 0;
                    while (Node.inRange(y) && Node.inRange(x)) {
                        newSq = board[y][x];
                        name = newSq.data ? newSq.data.name : "";
                        color = newSq.data ? newSq.data.color : "";

                        if (color === kingColor) { break; } // prettier-ignore
                        if (name === "rook" || name === "knight") { break; } // prettier-ignore

                        // white king black pawns
                        if (i < 10 && loopCount < 1 && kingColor === "white") {
                            if (name === "pawn" && color === "black") { result = true;break; } // prettier-ignore
                        }
                        // black king white pawns
                        if (i > 9 && loopCount < 1 && kingColor === "black") {
                            if (name === "pawn" && color === "white") { result = true;break; } // prettier-ignore
                        }
                        if (loopCount < 1) {
                            if(name === "king" && color === this.oppoClr[kingColor]){ result = true; break;} // prettier-ignore
                        }

                        if (color === this.oppoClr[kingColor]) {
                            if (name === "queen" || name === "bishop") {
                                result = true;
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
                    let loopCount: number = 0;
                    while (Node.inRange(y) && Node.inRange(x)) {
                        newSq = board[y][x];
                        name = newSq.data ? newSq.data.name : "";
                        color = newSq.data ? newSq.data.color : "";

                        if(color === kingColor) { break; } //prettier-ignore
                        if(name === "bishop" || name === "pawn" || name === "knight"){ break; } // prettier-ignore

                        if (loopCount < 1) {
                            if(name === "king" && color === this.oppoClr[kingColor]){result = true; break } // prettier-ignore
                        }

                        if (color === this.oppoClr[kingColor]) {
                            if (name === "queen" || name === "rook") {
                                result = true;
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
        return result;
    };
}

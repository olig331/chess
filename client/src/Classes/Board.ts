import { getClass } from "../HelperFunctions/getClass";
import { Piece } from "../Classes/Piece";
import { getVectors } from "../HelperFunctions/getVectors";

export class Board {
    public board: Node[][];
    private static kingCheckVectors = [...getVectors("n"), ...getVectors("k")];
    private static startingPositions: string =
        "rnbqkbnrpp..pppp................................PP..PPPPRNBQKBNR";

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

    public isKingChecked = (kingsPos: coords, color: string): boolean => {
        let i: number;

        for (i = 0; i < Board.kingCheckVectors.length; i++) {
            console.log(kingsPos, Board.kingCheckVectors[i]);
            let posY = kingsPos.y + Board.kingCheckVectors[i].y,
                posX = kingsPos.x + Board.kingCheckVectors[i].x;

            if (Board.validCoords(posY) && Board.validCoords(posX)) {
                let tempNode = this.board[posY][posX];
                //prettier-ignore
                if(i < 8){ // Checking knights
                    if(tempNode.getName() === "knight" && tempNode.getColor() !== color){
                        console.log("knight")
                        return true;// king is in check 
                    }
                }
                //prettier-ignore
                if (i > 7 && i < 12) { // checking diagonals
                    while(Board.validCoords(posY) && Board.validCoords(posX)){ // checking the new board coords are valid
                        tempNode = this.board[posY][posX];
                        let nodeName = tempNode.getName(),
                            loopCount = 0;
                        if(tempNode.data){
                            if(tempNode.getColor() === color){break}
                            if(loopCount < 1){ // check for pawns and king
                                if(i < 10 && color === "white"){ // check for white pawns 
                                    //prettier-ignore
                                    if(nodeName === "pawn" || nodeName === "king" || nodeName === "queen" || nodeName ==="bishop"){console.log("pawn white 1");return true;}
                                    if(nodeName === "king" || nodeName === "bishop" || nodeName ==="queen"){ console.log("pawn white 2");return true;}
                                }
                                if(i > 9 && color === "black"){
                                    //prettier-ignore
                                    if(tempNode.getColor() !== color){
                                        if(nodeName === "pawn" || nodeName === "king" || nodeName === "queen" || nodeName ==="bishop"){console.log("pawn black 1");return true;}
                                        if(nodeName === "king" || nodeName === "bishop" || nodeName ==="queen"){console.log("pawn black 2");return true}
                                    }
                                }
                                if(tempNode.getColor() !== color){
                                    if(nodeName === "king" || nodeName === "queen" || nodeName=== "bishop"){console.log("last loop count diag");return true}
                                }
                            }
                        
                            if (nodeName === "queen" || nodeName === "rook") {
                                console.log("queen rook")
                                return true;
                            }
                            break;
                        }
                        loopCount++
                        posY += Board.kingCheckVectors[i].y
                        posX += Board.kingCheckVectors[i].x
                    }
                }

                if (i > 11) {
                    while (Board.validCoords(posY) && Board.validCoords(posX)) {
                        tempNode = this.board[posY][posX];
                        let nodeName = tempNode.getName(),
                            loopCount = 0;

                        if (tempNode.data) {
                            if (tempNode.getColor() === color) {
                                break;
                            }
                            if (loopCount < 1) {
                                //prettier-ignore
                                if(tempNode.getColor() !== color){
                                    if(nodeName === "king" || nodeName ==="rook" || nodeName ==="rook"){
                                        console.log(tempNode, nodeName, color, i, loopCount)
                                        console.log("king i > 11")
                                        return true;
                                    }
                                }
                            }

                            if (nodeName === "queen" || nodeName === "rook") {
                                console.log("queen or rook");
                                return true;
                            }
                            break;
                        }

                        loopCount++;
                        posY += Board.kingCheckVectors[i].y;
                        posX += Board.kingCheckVectors[i].x;
                    }
                }
            }
        }
        console.log("not checked");
        return false;
    };

    public updateTheBoard = (old: Node, newPos: Node) => {
        this.board[newPos.y][newPos.x].data = old.data;
        this.board[old.y][old.x].data = null;
    };

    private static validCoords = (val: number): boolean => {
        return val <= 7 && val >= 0;
    };
}

class Node {
    public y: number;
    public x: number;
    public data: Pieces | null;

    constructor(y: number, x: number, piece: any) {
        this.y = y;
        this.x = x;
        this.data = piece;
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

    // public getPiecesMoves = () => {
    //     if (this.data) {
    //         this.data.getLegalMoves(this.getCoords());
    //     }
    // };

    public getPiecesMoves = (board: any[][]): coords[] => {
        return this.data.getLegalMoves({ y: this.y, x: this.x }, board);
    };
}

import { getClass } from "../HelperFunctions/getClass";
import { Piece } from "../Classes/Piece";
import { getVectors } from "../HelperFunctions/getVectors";

export class Board {
    public board: Node[][];
    private static kingCheckVectors = [...getVectors("n"), ...getVectors("k")];
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
    //prettier-ignore
    public verifyAttemptedMove = (selected: any, newPos: any):Node[][] | null => {
        let oldCoords = selected.getCoords(),
            newCoords = newPos.getCoords(),
            derivedVector = {
                y: newCoords.y - oldCoords.y,
                x: newCoords.x - oldCoords.x,
            },
            vectorsMatch: boolean = false;
        //prettier-ignore
        for(let i:number = 0; i < selected.data.vectors.length; i++){
            console.log("in for loop")
            console.log("vectorCheck",Board.vectorEqualityCheck(derivedVector, selected.data.vectors[i]));
            if(Board.vectorEqualityCheck(derivedVector, selected.data.vectors[i])){
                vectorsMatch = true;
                break;
            }
        }

        if (vectorsMatch) {
            //prettier-ignore
            if(selected.getColor() === newPos.getColor() || newPos.getName() === "king"){
                console.log("vector was a match but sqaure is un availble")
                return null;   
            }
            //Check if the move will result in the king being in check
            if(this.isKingChecked({y:7,x:4}, selected.getColor())){

            }
            this.updateTheBoard(selected, newPos);
            return this.board;
        }
        return null;
    };

    public isKingChecked = (kingsPos: coords, color: string): boolean => {
        let i: number;

        for (i = 0; i < Board.kingCheckVectors.length; i++) {
            let posY = kingsPos.y + Board.kingCheckVectors[i].y,
                posX = kingsPos.x + Board.kingCheckVectors[i].x,
                tempNode = this.board[posY][posX];
            //prettier-ignore
            if(i < 8){ // Checking knights
                if(tempNode.getName() === "knight" && tempNode.getColor() !== color){
                    return true;// king is in check 
                }
            }
            //prettier-ignore
            if (i > 7 && i < 12) { // checking diagonals
                while(Board.validCoords(posY) && Board.validCoords(posX)){ // checking the new board coords are valid

                }
            }
        }
        return false;
    };

    public updateTheBoard = (old: Node, newPos: Node) => {
        this.board[newPos.y][newPos.x].data = old.data;
        this.board[old.y][old.x].data = null;
    };

    private static vectorEqualityCheck = (a: coords, b: coords) => {
        if (JSON.stringify(a) === JSON.stringify(b)) {
            return true;
        }
        return false;
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

    public getPiecesMoves = () => {
        if (this.data) {
            this.data.getLegalMoves(this.getCoords());
        }
    };
}

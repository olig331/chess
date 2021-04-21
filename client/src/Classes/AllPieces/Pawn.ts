import { Piece } from "../Piece";
import { getTag } from "../../HelperFunctions/getTag";

export class Pawn extends Piece {
    public color: string;
    public vectors: vectorsArr;
    public renderImage: any;
    public startingRank: number;
    public endRank: number;
    public name: string;
    public openForEnPassant: boolean;

    constructor(color: string, vectors: vectorsArr, renderImage: any) {
        super();
        this.color = color;
        this.vectors = vectors;
        this.renderImage = renderImage;
        this.startingRank = color === "white" ? 6 : 1;
        this.endRank = color === "white" ? 0 : 7;
        this.name = this.getName();
        this.openForEnPassant = true;
    }

    public getLegalMoves = (
        coords: coords,
        board: any[]
    ): legalMovesResult[] => {
        let i: number,
            result: legalMovesResult[] = [];

        for (i = 0; i < this.vectors.length; i++) {
            let y: number = coords.y + this.vectors[i].y,
                x: number = coords.x + this.vectors[i].x;

            //prettier-ignore
            if(this.inRange(y) && this.inRange(x)){
                const newSq = board[y][x];
                const name = newSq.getName();
                if(name === "king"){
                    break
                }

                if(i < 1 && !name){ // handle moving forward 
                    result.push({ 
                        move:{y: y, x: x },
                        effects: [
                            {coords:{y:y, x:x}, new:this.serialise(this), newProps:null},
                            {coords:{y:coords.y, x:coords.x}, new:null, newProps:null}
                        ],
                        taking: ""
                    });
                    // handles moving forward 2 sqauares
                    if(coords.y === this.startingRank && !board[y + this.vectors[i].y][x].getName()){
                        result.push({ 
                            move:{y: y + this.vectors[i].y, x: x },
                            effects: [
                                {coords:{y:y + this.vectors[i].y, x:x}, new:this.serialise(this), newProps:{openForEnPassant:true}},
                                {coords:{y:coords.y, x:coords.x}, new:null, newProps:null}
                            ],
                            taking: ""
                        });
                    }
                }
                // sideways taking
                if (i > 0) {
                    if (name && newSq.getColor() === this.oppoClr[this.color]) {
                        result.push({ 
                            move:{y: y, x: x },
                            effects: [
                                {coords:{y:y, x:x}, new:this.serialise(this), newProps:null},
                                {coords:{y:coords.y, x:coords.x}, new:null, newProps:null}
                            ],
                            taking: getTag(board[y][x].getName(), board[y][x].getColor())
                        });
                    }
                }

                // Handle Enpassent as move gen;
                if(this.inRange(coords.x - 1)){
                    let passant = board[coords.y][coords.x - 1];
                    console.log(passant.getName(), passant.getColor())
                    if(passant.getName() === "pawn" && passant.getColor() === this.oppoClr[this.color] && passant.data.openForEnPassant){
                        result.push({
                            move:{y:coords.y + this.vectors[0].y, x: coords.x - 1},
                            effects: [
                                {coords:{y:coords.y + this.vectors[0].y, x: coords.x - 1}, new:this.serialise(this), newProps:null},
                                {coords:{y:coords.y, x:coords.x}, new:null, newProps:null},
                                {coords:{y:coords.y, x:coords.x - 1}, new:null, newProps:null}
                            ],
                            taking: getTag(board[y][x].getName(), board[y][x].getColor())
                        })
                    }
                    console.log("failed enpassent, -1")
                }
                if(this.inRange(coords.x + 1)){
                    let passant = board[coords.y][coords.x + 1];
                    if(passant.getName() === "pawn" && passant.getColor() === this.oppoClr[this.color] && passant.data.openForEnPassant){
                        result.push({
                            move:{y:coords.y + this.vectors[0].y, x: coords.x + 1},
                            effects: [
                                {coords:{y:coords.y + this.vectors[0].y, x: coords.x + 1}, new:this.serialise(this), newProps:null},
                                {coords:{y:coords.y, x:coords.x}, new:null, newProps:null},
                                {coords:{y:coords.y, x:coords.x + 1}, new:null, newProps:null}
                            ],
                            taking: getTag(board[y][x].getName(), board[y][x].getColor())
                        })
                    }
                    console.log("failed enpassent,  + 1")
                }
            }
        }
        this.moves = result;
        return result;
    };

    public getName = (): string => {
        return "pawn";
    };
}

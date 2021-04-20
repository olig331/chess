import { Piece } from "../Piece";

export class Pawn extends Piece {
    public color: string;
    public vectors: vectorsArr;
    public renderImage: any;
    public startingRank: number;
    public endRank: number;
    public name: string;
    constructor(color: string, vectors: vectorsArr, renderImage: any) {
        super();
        this.color = color;
        this.vectors = vectors;
        this.renderImage = renderImage;
        this.startingRank = color === "white" ? 6 : 1;
        this.endRank = color === "white" ? 0 : 7;
        this.name = this.getName();
    }

    public getLegalMoves = (coords: coords, board: any[]): coords[] => {
        let i: number,
            result: coords[] = [];

        for (i = 0; i < this.vectors.length; i++) {
            let y: number = coords.y + this.vectors[i].y,
                x: number = coords.x + this.vectors[i].x;

            //prettier-ignore
            if(this.inRange(y) && this.inRange(x)){
                const newSq = board[y][x];
                const name = newSq.getName();

                if(i < 1 && !name){ // handle moving forward 
                    result.push({y:y, x:x}) 
                    // handles moving forward 2 sqauares
                    if(coords.y === this.startingRank && !board[y + this.vectors[i].y][x].getName()){
                        result.push({y:y + this.vectors[i].y, x:x})
                    }
                }
                // sideways taking
                if (i > 0) {
                    if (name && newSq.getColor() === this.oppoClr[this.color]) {
                        result.push({ y: y, x: x });
                    }
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

import { Piece } from "../Piece";
import { getTag } from "../../HelperFunctions/getTag";

export class Bishop extends Piece {
    public color: string;
    public vectors: vectorsArr;
    public renderImage: any;
    public name: string;
    constructor(color: string, vectors: vectorsArr, renderImage: any) {
        super();
        this.color = color;
        this.vectors = vectors;
        this.renderImage = renderImage;
        this.name = this.getName();
    }
    //prettier-ignore
    public getLegalMoves = (coords: coords, board: any[][]): legalMovesResult[] => {
        let i: number,
            result: legalMovesResult[] = [];
        console.log("cords passed", coords);

        for (i = 0; i < this.vectors.length; i++) {
            let y: number = coords.y + this.vectors[i].y,
                x: number = coords.x + this.vectors[i].x;

            while (this.inRange(y) && this.inRange(x)) {
                const newSq = board[y][x];
                const name = newSq.getName();

                if (newSq && newSq.getColor() === this.color) {
                    break;
                }
                //prettier-ignore
                if (newSq && newSq.getColor() === this.oppoClr[this.color] && name !== "king") {
                    result.push({ 
                        move:{y: y, x: x },
                        effects: [
                            {coords:{y:y, x:x}, new:this.serialise(this), newProps:null},
                            {coords:{y:coords.y, x:coords.x}, new:null, newProps:null}
                        ],
                        taking: getTag(board[y][x].getName(), board[y][x].getColor())
                    });
                    break;
                }
                //prettier-ignore
                result.push({ 
                    move:{y: y, x: x },
                    effects: [
                        {coords:{y:y, x:x}, new:this.serialise(this), newProps:null},
                        {coords:{y:coords.y, x:coords.x}, new:null, newProps:null}
                    ],
                    taking: getTag(board[y][x].getName(), board[y][x].getColor())
                });
                y += this.vectors[i].y;
                x += this.vectors[i].x;
            }
        }
        this.moves = result;
        return result;
    };

    public getName = (): string => {
        return "bishop";
    };
}

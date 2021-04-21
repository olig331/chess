import { Piece } from "../Piece";

export class Rook extends Piece {
    public color: string;
    public vectors: vectorsArr;
    public renderImage: any;
    public name: string;
    public hasNeverMoved: boolean;

    constructor(color: string, vectors: vectorsArr, renderImage: any) {
        super();
        this.color = color;
        this.vectors = vectors;
        this.renderImage = renderImage;
        this.name = this.getName();
        this.hasNeverMoved = true;
    }
    //prettier-ignore
    public getLegalMoves = (coords: coords, board: any[]): legalMovesResult[] => {
        let i: number,
            result: legalMovesResult[] = [];

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
                        taking: board[y][x].getName()
                    });
                    break;
                }
                result.push({ 
                    move:{y: y, x: x },
                    effects: [
                        {coords:{y:y, x:x}, new:this.serialise(this), newProps:null},
                        {coords:{y:coords.y, x:coords.x}, new:null, newProps:null}
                    ],
                    taking: board[y][x].getName()
                });
                y += this.vectors[i].y;
                x += this.vectors[i].x;
            }
        }
        this.moves = result;
        return result;
    };

    public getName = (): string => {
        return "rook";
    };
}

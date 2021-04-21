import { Piece } from "../Piece";

export class Knight extends Piece {
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

    public getLegalMoves = (
        coords: coords,
        board: any[][]
    ): legalMovesResult[] => {
        let i: number,
            result: legalMovesResult[] = [];

        for (i = 0; i < this.vectors.length; i++) {
            let y: number = coords.y + this.vectors[i].y,
                x: number = coords.x + this.vectors[i].x;

            if (this.inRange(y) && this.inRange(x)) {
                const newSq = board[y][x];
                const name = newSq.getName();

                if (name !== "king" && newSq.getColor() !== this.color) {
                    // prettier-ignore
                    result.push({ 
                        move:{y: y, x: x },
                        effects: [
                            {coords:{y:y, x:x}, new:this.serialise(this), newProps:null},
                            {coords:{y:coords.y, x:coords.x}, new:null, newProps:null}
                        ],
                        taking: board[y][x].getName()
                    });
                }
            }
        }
        this.moves = result;
        return result;
    };

    public getName = (): string => {
        return "knight";
    };
}

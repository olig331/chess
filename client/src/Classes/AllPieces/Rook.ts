import { Piece } from "../Piece";

export class Rook extends Piece {
    public color: string;
    public vectors: vectorsArr;
    public renderImage: any;

    constructor(color: string, vectors: vectorsArr, renderImage: any) {
        super();
        this.color = color;
        this.vectors = vectors;
        this.renderImage = renderImage;
    }

    public getLegalMoves = (coords: coords, board: any[]): coords[] => {
        let i: number,
            result: coords[] = [];

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
                    result.push({ y: y, x: x });
                    break;
                }

                result.push({ y: y, x: x });
                y += this.vectors[i].y;
                x += this.vectors[i].x;
            }
        }
        return result;
    };

    public getName = (): string => {
        return "rook";
    };
}

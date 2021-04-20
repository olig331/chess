import { Piece } from "../Piece";

export class King extends Piece {
    public color: string;
    public vectors: vectorsArr;
    public renderImage: any;

    constructor(color: string, vectors: vectorsArr, renderImage: any) {
        super();
        this.color = color;
        this.vectors = vectors;
        this.renderImage = renderImage;
    }

    public getLegalMoves = (coords: coords, board: any[][]): coords[] => {
        let i: number,
            result: coords[] = [];

        for (i = 0; i < this.vectors.length; i++) {
            let y: number = coords.y + this.vectors[i].y,
                x: number = coords.x + this.vectors[i].x;

            if (this.inRange(y) && this.inRange(x)) {
                const newSq = board[y][x];
                const name = newSq.getName();

                if (newSq.getColor() === this.color) {
                    continue;
                } else {
                    result.push({ y: y, x: x });
                }
            }
        }
        return result;
    };

    public getName = (): string => {
        return "king";
    };
}

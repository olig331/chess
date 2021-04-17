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
}

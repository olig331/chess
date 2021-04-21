export class Game {
    public fallenPieces: { [key: string]: string[] };
    constructor() {
        this.fallenPieces = { white: [], black: [] };
    }

    public updateFallenPieces = (piece: any) => {
        if (piece.color === "white") {
            this.fallenPieces.white.push(piece);
        } else {
            this.fallenPieces.white.push(piece);
        }
    };
}

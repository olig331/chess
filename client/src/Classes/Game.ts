export class Game {
    public fallenPieces: { [key: string]: string[] };
    public gameOver: boolean;
    constructor() {
        this.fallenPieces = { white: [], black: [] };
        this.gameOver = false;
    }

    public updateFallenPieces = (tag: string) => {
        if (tag.charCodeAt(0) < 91) {
            this.fallenPieces.white.push(tag);
        } else {
            this.fallenPieces.black.push(tag);
        }
    };
}

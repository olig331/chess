export class Game {
    public fallenPieces: { [key: string]: string[] };
    public gameOver: boolean;
    public winner: boolean | null;
    constructor() {
        this.fallenPieces = { white: [], black: [] };
        this.gameOver = false;
        this.winner = null;
    }

    public updateFallenPieces = (tag: string) => {
        if (tag.charCodeAt(0) < 91) {
            this.fallenPieces.white.push(tag);
        } else {
            this.fallenPieces.black.push(tag);
        }
        console.log("fallenpiece after update", this.fallenPieces);
    };
}

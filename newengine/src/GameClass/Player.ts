export class Player {
    public color: string;
    public oppoId: string;
    public castleSwapStatus: { [key: string]: boolean };

    constructor(color: string, oppoId: string) {
        this.color = color;
        this.oppoId = oppoId;
        this.castleSwapStatus = { qside: true, kside: true };
    }
}

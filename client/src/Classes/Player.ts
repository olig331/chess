import { Game } from "./Game";

export class Player extends Game {
    public color: string;
    public oppoId: string;
    public kingsPos: KingsPos;
    public yourTurn: boolean;
    public inCheck: boolean;

    constructor(color: string, oppoId: string) {
        super();
        this.color = color;
        this.oppoId = oppoId;
        this.kingsPos =
            color === "white"
                ? { coords: { y: 7, x: 4 }, color: "white" }
                : { coords: { y: 0, x: 4 }, color: "black" };
        this.yourTurn = color === "white" ? true : false;
        this.inCheck = false;
    }

    public getKingsPos = (): KingsPos => {
        return this.kingsPos;
    };

    public updateKingsPos = (newCoords: coords): void => {
        this.kingsPos.coords = newCoords;
        return;
    };

    public setCheckStatus = (status: boolean) => {
        this.inCheck = status;
    };
}

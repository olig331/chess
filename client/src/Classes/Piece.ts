export abstract class Piece {
    public oppoClr: {[key:string]: string}
    constructor(){
        this.oppoClr = {"white": "black", "black": "white"}
    }

    private static abstractErrorMsg: string =
        "function must be defined in all classes that inherit from Piece";

    public abstract getLegalMoves = (coords: coords, board: Node[][]): any => {
        throw new Error("getLegalMoves " + Piece.abstractErrorMsg);
    };

    public abstract getName = (): string => {
        throw new Error("getName " + Piece.abstractErrorMsg);
    };

    public inRange = (val: number): boolean => {
        return val <= 7 && val >= 0;
    };
}

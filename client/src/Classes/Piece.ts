export abstract class Piece {
    public oppoClr: { [key: string]: string };
    public moves: legalMovesResult[];
    constructor() {
        this.oppoClr = { white: "black", black: "white" };
        this.moves = [];
    }

    private static abstractErrorMsg: string =
        "function must be defined in all classes that inherit from Piece";

    //prettier-ignore
    public abstract getLegalMoves = (coords: coords, board: Node[][], inCheck?:boolean): any => {
        throw new Error("getLegalMoves " + Piece.abstractErrorMsg);
    };

    public abstract getName = (): string => {
        throw new Error("getName " + Piece.abstractErrorMsg);
    };

    public inRange = (val: number): boolean => {
        return val <= 7 && val >= 0;
    };

    public serialise = (data: any) => {
        return JSON.parse(JSON.stringify(data));
    };
}

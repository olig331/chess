export abstract class Piece {
    private static abstractErrorMsg: string =
        "function must be defined in all classes that inherit from Piece";

    public abstract getLegalMoves = (coords: coords): any => {
        throw new Error("getLegalMoves " + Piece.abstractErrorMsg);
    };

    public abstract getName = (): string => {
        throw new Error("getName " + Piece.abstractErrorMsg);
    };
}

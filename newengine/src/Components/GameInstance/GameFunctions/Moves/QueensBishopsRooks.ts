import { validPos } from "../getLegalMoves";
import { getVectors } from "../getLegalMoves";
import { filterByCheck } from "../getLegalMoves";

// prettier-ignore
export const freePiecesMoves = (tag: string,boardKeys: Keys,board: Board,boardPos: number): MoveArr[] => {
    const vectors: number[] = getVectors(tag);
    let i: number,
        legalMoves: MoveArr[] = [],
        color: string = tag.charCodeAt(0) < 91 ? "white" : "black";

    for (i = 0; i < vectors.length; i++) {
        let tempSq = boardPos + vectors[i];
        while (validPos(tempSq)) {
            let piece: string = board[boardKeys[tempSq]],
                key: string = boardKeys[tempSq],
                prevKey: string = boardKeys[tempSq - vectors[i]];

            if (Math.abs(key.charCodeAt(0) - prevKey.charCodeAt(0)) > 1) {
                break;
            } // test to make sure we dont wrap round the other side of the board when moving
            if (piece && piece.toLowerCase() === "k") {
                break;
            } // if the piece is a king we break;
            if (piece && color === "white") {
                if (piece.charCodeAt(0) > 91) {
                    legalMoves.push({
                        effects: [
                            { pos: boardKeys[tempSq], piece: tag },
                            { pos: boardKeys[boardPos], piece: "" },
                        ],
                        taking: piece,
                    });
                }
                break;
            }
            if (piece && color === "black") {
                if (piece.charCodeAt(0) < 91) {
                    legalMoves.push({
                        effects: [
                            { pos: boardKeys[tempSq], piece: tag },
                            { pos: boardKeys[boardPos], piece: "" },
                        ],
                        taking: piece,
                    });
                }
                break;
            }
            legalMoves.push({
                effects: [
                    { pos: boardKeys[tempSq], piece: tag },
                    { pos: boardKeys[boardPos], piece: "" },
                ],
                taking: "piece",
            });
            tempSq += vectors[i];
        }
    }
    return filterByCheck(tag, legalMoves, board, boardPos);
};

import { validPos } from "./getLegalMoves";

// prettier-ignore
const kingCheckVectors = [1, -1, -8, 8, 7, 9, -9, -7, -17, -15, -10, -6, 17, 15, 10, 6];

export const checkForCheck = (board: any, color: string) => {
    let boardKeys: any = Object.keys(board);
    // prettier-ignore
    let kingTag = color === "white" ? "K" : "k"
    //prettier-ignore
    let king: any = Object.keys(board).filter((key: string) => board[key] === kingTag);
    let index: any = boardKeys.indexOf(`${king}`);
    let i: number;
    let result: boolean = false;
    for (i = 0; i < kingCheckVectors.length; i++) {
        let newSq = index + kingCheckVectors[i];

        if (i < 8) {
            while (validPos(newSq)) {
                let pos = boardKeys[newSq];
                let piece = board[pos],
                    key = boardKeys[newSq],
                    lastKey = boardKeys[newSq - kingCheckVectors[i]];
                if (Math.abs(key.charCodeAt(0) - lastKey.charCodeAt(0)) > 2) {
                    break;
                }
                if (i < 4) {
                    // laterals
                    if (piece) {
                        if (color === "white") {
                            if (piece === "r" || piece === "q") {
                                result = true;
                                console.log("true white diag");
                                break;
                            }
                        }
                        if (color === "black") {
                            if (piece === "R" || piece === "Q") {
                                result = true;
                                console.log("true black lateral");
                                break;
                            }
                        }
                    }
                }
                if (i > 3) {
                    if (piece) {
                        if (color === "white") {
                            if (piece === "b" || piece === "q") {
                                // incheck
                                result = true;
                                console.log("true white diag");
                                break;
                            }
                        }
                        if (color === "black") {
                            if (piece === "B" || piece === "Q") {
                                // incheck
                                result = true;
                                console.log("true black diag");
                                break;
                            }
                        }
                    }
                }
                newSq += kingCheckVectors[i];
            }
        }

        if (i > 7 && validPos(newSq)) {
            let pos = boardKeys[newSq];
            let piece = board[pos];
            if (color === "white" && piece === "n") {
                // in check
                result = true;
                console.log("true white n");
                break;
            }
            if (color === "black" && piece === "N") {
                // in check
                result = true;
                console.log("true black n");
                break;
            }
        }
    }
    return result;
};

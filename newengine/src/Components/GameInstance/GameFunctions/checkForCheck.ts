import { validPos } from "./getLegalMoves";

// prettier-ignore
const kingCheckVectors = [1, -1, -8, 8, 7, 9, -9, -7, -17, -15, -10, -6, 17, 15, 10, 6];

export const checkForCheck = (board: any, color: string) => {
    let boardKeys: any = Object.keys(board);
    // prettier-ignore
    let kingTag = color === "white" ? "K" : "k";
    //prettier-ignore
    let king: any = Object.keys(board).filter((key: string) => board[key] === kingTag);
    let index: any = boardKeys.indexOf(`${king}`);
    let i: number;
    let result: boolean = false;
    for (i = 0; i < kingCheckVectors.length; i++) {
        let newSq = index + kingCheckVectors[i];

        if (i < 8) {
            let pos = boardKeys[newSq];
            let piece = board[pos];
            if (color === "black" && i > 3 && i < 6) {
                if (piece === "P") {
                    result = true;
                    continue;
                }
            }
            if (color === "white" && i > 5 && i < 8) {
                if (piece === "p") {
                    result = true;
                    continue;
                }
            }
            while (validPos(newSq)) {
                let pos = boardKeys[newSq];
                let piece = board[pos],
                    lastKey = boardKeys[newSq - kingCheckVectors[i]];
                //prettier-ignore
                if (validPos(lastKey) && Math.abs(pos.charCodeAt(0) - lastKey.charCodeAt(0)) > 2) { 
                    break;
                }

                if (i < 4) {
                    // laterals
                    if (piece) {
                        if (color === "white") {
                            if (piece === "r" || piece === "q") {
                                result = true;
                                break;
                            }
                            break;
                        }
                        if (color === "black") {
                            if (piece === "R" || piece === "Q") {
                                result = true;
                                break;
                            }
                            break;
                        }
                    }
                }
                if (i > 3) {
                    if (piece) {
                        if (color === "white") {
                            if (piece === "b" || piece === "q") {
                                // incheck
                                result = true;
                                break;
                            }
                            break;
                        }
                        if (color === "black") {
                            if (piece === "B" || piece === "Q") {
                                // incheck
                                result = true;
                                break;
                            }
                            break;
                        }
                    }
                }
                newSq += kingCheckVectors[i];
            }
        }

        if (i > 7 && validPos(newSq)) {
            let pos = boardKeys[newSq];
            let piece = board[pos],
                lastKey = boardKeys[newSq - kingCheckVectors[i]];
            //prettier-ignore
            if (validPos(lastKey) && Math.abs(pos.charCodeAt(0) - lastKey.charCodeAt(0)) > 2) { 
                continue;
            }
            if (color === "white" && piece === "n") {
                // in check
                result = true;
                break;
            } else if (color === "black" && piece === "N") {
                // in check
                result = true;
                break;
            } else {
                break;
            }
        }
    }
    return result;
};

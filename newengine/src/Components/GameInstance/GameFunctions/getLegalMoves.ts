import { checkForCheck } from "./checkForCheck";
import { freePiecesMoves } from "./Moves/QueensBishopsRooks";
import { pawnsMoves } from "./Moves/Pawns";
import { knightMoves } from "./Moves/Knights";
import { kingMoves } from "./Moves/Kings";
//prettier-ignore

export const getLegalMoves = (tag: string, boardKeys: Keys, board: Board, boardPos:number) => {
    const playerPiece = tag.toLowerCase()
    if(playerPiece === "q" || playerPiece === "b" || playerPiece === "r"){
        return freePiecesMoves(tag, boardKeys, board, boardPos);
    }
    if(playerPiece === "p"){
        return pawnsMoves(tag, boardKeys, board, boardPos);
    }
    if(playerPiece === "n"){
        return knightMoves(tag, boardKeys, board, boardPos);
    }
    if(playerPiece === "k"){
        return kingMoves(tag, boardKeys, board, boardPos);
    }
    return [];
};

//prettier-ignore
export const filterByCheck = (tag:string, movesList: string[], board:Board, boardPos: number): string[] => {
    let keys:string[] = Object.keys(board),
        color:string = tag.charCodeAt(0) < 91 ? "white" : "black"; 

    return movesList.filter((move:string) => {
        let copy = {...board},
            oldPos = keys.indexOf(`${boardPos}`);
        copy[move] = tag;
        copy[oldPos] = "";
        return !checkForCheck(copy, color);
    });
};

export const getVectors = (tag: string): any => {
    switch (tag) {
        case "p":
            return [9, 7, 8];
        case "P":
            return [-9, -7, -8];
        case "r":
            return [1, -1, -8, 8];
        case "b":
            return [7, 9, -9, -7];
        case "q":
            return [1, -1, -8, 8, 7, 9, -9, -7];
        case "k":
            return [1, -1, -8, 8, 7, 9, -9, -7];
        case "R":
            return [1, -1, -8, 8];
        case "B":
            return [7, 9, -9, -7];
        case "Q":
            return [1, -1, -8, 8, 7, 9, -9, -7];
        case "K":
            return [1, -1, -8, 8, 7, 9, -9, -7];
        case "n":
            return [-17, -15, -10, -6, 17, 15, 10, 6];
        case "N":
            return [-17, -15, -10, -6, 17, 15, 10, 6];
        default:
            break;
    }
};

export const validPos = (pos: number) => {
    return pos >= 0 && pos <= 63;
};

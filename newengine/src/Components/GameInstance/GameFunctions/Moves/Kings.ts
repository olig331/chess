import { validPos } from "../getLegalMoves";
import { getVectors } from "../getLegalMoves";
import { filterByCheck } from "../getLegalMoves";

//prettier-ignore
export const kingMoves = (tag: string, boardKeys: Keys, board: Board, boardPos: number):string[] => {
    const vectors = getVectors(tag)
    let i:number,
        legalMoves:string[] = [],
        color = tag.charCodeAt(0) < 91 ? "white" : "black";

    for(i = 0; i < vectors.length; i++){
        let tempSq = boardPos + vectors[i];
        
        if(validPos(tempSq)){
            let piece: string = board[boardKeys[tempSq]],
                key: string = boardKeys[tempSq],
                prevKey: string = boardKeys[tempSq - vectors[i]];
            
            if (Math.abs(key.charCodeAt(0) - prevKey.charCodeAt(0)) > 1) {
                continue;
            } 
            if(piece){
                if(color === "white" && piece.charCodeAt(0) > 91){
                    legalMoves.push(boardKeys[tempSq])
                }
                if(color === "black" && piece.charCodeAt(0) < 91){
                    legalMoves.push(boardKeys[tempSq])
                }
            }
            legalMoves.push(boardKeys[tempSq])
        }
    }
    return filterByCheck(tag, legalMoves, boardPos);
}

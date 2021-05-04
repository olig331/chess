import { validPos } from "../getLegalMoves";
import { getVectors } from "../getLegalMoves";
import { filterByCheck } from "../getLegalMoves";

//prettier-ignore
export const knightMoves = (tag: string, boardKeys: Keys, board: Board, boardPos: number):MoveArr[] => {
    const vectors = getVectors(tag)
    let i: number,
        legalMoves: MoveArr[] = [],
        color = tag.charCodeAt(0) < 91 ? "white" : "black";

    for( i =0; i < vectors.length; i++) {
        let tempSq = boardPos + vectors[i];

        if(validPos(tempSq)){
            let piece: string = board[boardKeys[tempSq]],
                key: string = boardKeys[tempSq],
                prevKey: string = boardKeys[tempSq - vectors[i]];
            if (Math.abs(key.charCodeAt(0) - prevKey.charCodeAt(0)) > 2) {
                continue
            } // test to make sure we dont wrap round the other side of the board when moving
            if(piece){
                if(piece.toLocaleLowerCase() === "k"){
                    continue;
                }
                if(color === "white"){
                    if(piece.charCodeAt(0) > 91){
                        legalMoves.push({
                            effects:[
                                {pos:boardKeys[tempSq], piece:tag},
                                {pos:boardKeys[boardPos], piece:""}
                            ],
                            taking:piece
                        });
                    }
                    continue;
                }
                if(color === "black"){
                    if(piece.charCodeAt(0) < 91){
                        legalMoves.push({
                            effects:[
                                {pos:boardKeys[tempSq], piece:tag},
                                {pos:boardKeys[boardPos], piece:""}
                            ],
                            taking:piece
                        });
                    }
                    continue;
                }
            }
            legalMoves.push({
                effects:[
                    {pos:boardKeys[tempSq], piece:tag},
                    {pos:boardKeys[boardPos], piece:""}
                ],
                taking:""
            })
        }
    };
    console.log("knight moves",legalMoves)
    return filterByCheck(tag, legalMoves, board);
}

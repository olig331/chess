import { validPos } from "../getLegalMoves";
import { getVectors } from "../getLegalMoves";
import { filterByCheck } from "../getLegalMoves";

//prettier-ignore
export const pawnsMoves = (tag:string, boardKeys:Keys, board:Board, boardPos:number):MoveArr[] => {
    const vectors = getVectors(tag);
    let i:number,
        legalMoves:MoveArr[] = [],
        color = tag.charCodeAt(0) < 91 ? "white" : "black";
    
    for(i = 0; i < vectors.length; i++){
        let tempSq = boardPos + vectors[i];
        if(validPos(tempSq)){
            let piece:string = board[boardKeys[tempSq]],
                key:string = boardKeys[tempSq],
                prevKey:string = boardKeys[tempSq - vectors[i]];  
            
            
            if( i < 2){ // handle sideways taking of pawns (first 2 vectors in the array are sideways taking )
                if(Math.abs(key.charCodeAt(0) - prevKey.charCodeAt(0)) > 1){ //test to make sure we dont wrap round the other side of the board when moving
                    continue;
                }
                if(piece){
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
                continue;
            }   
            if(i > 1){ // moving forward
                if(!piece){
                    legalMoves.push({
                        effects:[
                            {pos:boardKeys[tempSq], piece:tag},
                            {pos:boardKeys[boardPos], piece:""}
                        ],
                        taking:""
                    });
                }
                let doubleMove:number = tempSq + vectors[i];
                if(!piece && !board[doubleMove]){   
                    if(color === "white" && Math.floor(boardPos / 8) === 6){ // check they are on their starting ranks (0 indexed)
                        legalMoves.push({
                            effects:[
                                {pos:boardKeys[doubleMove], piece:tag},
                                {pos:boardKeys[boardPos], piece:""}
                            ],
                            taking:""
                        });
                    }
                    if(color === "black" && Math.floor(boardPos / 8) === 1){ // check they are on their starting ranks (0 indexed)
                        legalMoves.push({
                            effects:[
                                {pos:boardKeys[doubleMove], piece:tag},
                                {pos:boardKeys[boardPos], piece:""}
                            ],
                            taking:""
                        });
                    }
                }
            }
        }
    }
    return filterByCheck(tag, legalMoves, board, boardPos);
};
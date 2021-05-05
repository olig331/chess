import { validPos } from "../getLegalMoves";
import { getVectors } from "../getLegalMoves";
import { filterByCheck } from "../getLegalMoves";

//prettier-ignore
export const pawnsMoves = (tag:string, boardKeys:Keys, board:Board, boardPos:number, enpassant:any):MoveArr[] => {
    const vectors = getVectors(tag);
    let i:number,
        legalMoves:MoveArr[] = [],
        color = tag.charCodeAt(0) < 91 ? "white" : "black",
        endRank = color === "white" ? 8 : 1;
        
    
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
                                taking:{piece:piece, pos:boardKeys[tempSq]},
                                upgrade: parseInt(boardKeys[tempSq].split("")[1]) === endRank ? true : false
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
                                taking:{piece:piece, pos:boardKeys[tempSq]},
                                upgrade: parseInt(boardKeys[tempSq].split("")[1]) === endRank ? true : false
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
                        taking:{piece:"", pos:""},
                        upgrade: parseInt(boardKeys[tempSq].split("")[1]) === endRank ? true : false
                    });
                }
                let doubleMove:string = boardKeys[tempSq + vectors[i]];
                if(!piece && !board[doubleMove]){   
                    if(color === "white" && Math.floor(boardPos / 8) === 6){ // check they are on their starting ranks (0 indexed)
                        legalMoves.push({
                            effects:[
                                {pos:doubleMove, piece:tag},
                                {pos:boardKeys[boardPos], piece:""}
                            ],
                            taking:{piece:"", pos:""},
                            enpassant:doubleMove
                        });
                    }
                    if(color === "black" && Math.floor(boardPos / 8) === 1){ // check they are on their starting ranks (0 indexed)
                        legalMoves.push({
                            effects:[
                                {pos:doubleMove, piece:tag},
                                {pos:boardKeys[boardPos], piece:""}
                            ],
                            taking:{piece:"", pos:""},
                            enpassant:doubleMove
                        });
                    }
                }
            }
        }
        // enpassent
        if(boardKeys[boardPos - 1] === enpassant){
            legalMoves.push({
                effects:[
                    {pos:boardKeys[boardPos + vectors[0]], piece:tag},
                    {pos:boardKeys[boardPos - 1], piece: ""},
                    {pos:boardKeys[boardPos], piece:""}
                ],
                taking: {piece:color ==="white" ? "p" : "P", pos:boardKeys[boardPos - 1]}
            });
        }
        if(boardKeys[boardPos + 1] === enpassant){
            legalMoves.push({
                effects:[
                    {pos:boardKeys[boardPos + vectors[1]], piece:tag},
                    {pos:boardKeys[boardPos + 1], piece: ""},
                    {pos:boardKeys[boardPos], piece:""}
                ],
                taking:{piece:color ==="white" ? "p" : "P", pos:boardKeys[boardPos + 1]}
            });
        }
    }
    return filterByCheck(tag, legalMoves, board);
};

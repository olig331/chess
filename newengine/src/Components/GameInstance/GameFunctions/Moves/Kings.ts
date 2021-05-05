import { checkForCheck } from "../checkForCheck";
import { validPos } from "../getLegalMoves";
import { getVectors } from "../getLegalMoves";
import { filterByCheck } from "../getLegalMoves";

//prettier-ignore
export const kingMoves = (tag: string, boardKeys: Keys, board: Board, boardPos: number, castleStatus:CastleStatus):MoveArr[] => {
    const vectors = getVectors(tag)
    let i:number,
        legalMoves:MoveArr[] = [],
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
                    legalMoves.push({
                        effects:[
                            {pos:boardKeys[tempSq], piece:tag},
                            {pos:boardKeys[boardPos], piece:""}
                        ],
                        taking:{piece:piece, pos:boardKeys[tempSq]}
                    });
                } 
                if(color === "black" && piece.charCodeAt(0) < 91){
                    legalMoves.push({
                        effects:[
                            {pos:boardKeys[tempSq], piece:tag},
                            {pos:boardKeys[boardPos], piece:""}
                        ],
                        taking:{piece:piece, pos:boardKeys[tempSq]}
                    });
                } 
                continue;
            }
            legalMoves.push({
                effects:[
                    {pos:boardKeys[tempSq], piece:tag},
                    {pos:boardKeys[boardPos], piece:""}
                ],
                taking:{piece:"", pos:""}
            });
        }
    }

    canCastleSwap(board, boardKeys, castleStatus, color, tag) // gets the results from castle swaping and then adds them to legal moves array
        .map((move:MoveArr) => legalMoves.push(move));
    return filterByCheck(tag, legalMoves, board); 
}

//prettier-ignore
const canCastleSwap = (board:Board, boardKeys:Keys, castleStatus:CastleStatus, color:string, tag:string):MoveArr[] => {
    let rank = color === "white" ? 1 : 7,
        result:MoveArr[] = [],
        qSidePositions = [
        {king:`d${rank}`, empty:`e${rank}`}, 
        {king:`c${rank}`, empty:`e${rank}`}
    ],
    kSidePositions = [
        {king:`f${rank}`, empty:`e${rank}`}, 
        {king:`g${rank}`, empty:`e${rank}`}
    ];
    if(!checkForCheck(board, color)){ // check if the king is in check    
        if(castleStatus.qside){ // second we need to check if the king or the rooks have moved null and voiding castle swap (true means we can castle swap)        
            if(!board[`d${rank}`] && !board[`c${rank}`]){
                let canQueenSide = true;
                for(let i:number = 0; i < qSidePositions.length; i++){
                    let pos = qSidePositions[i],
                        copy:Board = {...board};

                    copy[pos.king] = tag
                    copy[pos.empty] = ""
                    if(checkForCheck(copy, color)){
                        canQueenSide = false
                    }
                }
                if(canQueenSide){
                    result.push({
                        effects: [
                            { pos: `c${rank}`, piece: tag },
                            { pos: `d${rank}`, piece: board[`a${rank}`] },
                            { pos: `e${rank}`, piece:""},
                            { pos: `a${rank}`, piece:""},
                        ],
                        taking: {piece:"", pos:""},
                    })
                }
            }
        }   
        if(castleStatus.kside){
            if(!board[`f${rank}`] && !board[`g${rank}`]){
                let canKingSide = true
                for(let i:number = 0; i < kSidePositions.length; i++){
                    let pos = kSidePositions[i],
                        copy:Board = {...board};

                    copy[pos.king] = tag;
                    copy[pos.empty] = "";
                    if(checkForCheck(copy, color)){
                        canKingSide = false
                    }
                }
                if(canKingSide){
                    result.push({
                        effects: [
                            { pos: `g${rank}`, piece: tag },
                            { pos: `f${rank}`, piece: board[`h${rank}`] },
                            { pos: `e${rank}`, piece:""},
                            { pos: `h${rank}`, piece:""},
                        ],
                        taking: {piece:"", pos:""},
                    })
                }
            }
        }
    }
    return result;
};

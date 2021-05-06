import React, { useContext, useState, useEffect } from 'react'
import { getImage } from '../../HelperFunctions/getImage';
import { getLegalMoves } from '../GameInstance/GameFunctions/getLegalMoves';
import { simulateCastleSound, simulateMoveSound, simulateTakeSound } from '../../HelperFunctions/triggerAudio'
import { getPieceColor, getSqaureColor } from '../GameInstance/GameFunctions/getPiecesColor';
import { createDragImage } from '../GameInstance/GameFunctions/createDragImage';
import { removeHighlights } from '../GameInstance/GameFunctions/highlightFunctions';
import { MovesContext } from './ChessBoard';
import { BoardContext, FallenPiecesContext, TurnContext, EnpassantContext } from '../GameInstance/GameInstance';
import useWindowDimensions from '../../CustomHooks/WIndowDimensions';
const socket = require('../../SocketConnection/Socket').socket;

interface PassedProps {
    pos: string;
    index: number;
    oppoId: string;
    castleSwapStatus: CastleStatus;
    color: string;
    setUpgrade: (val: boolean, move: MoveArr) => void
    updatePieces: (move: MoveArr) => void
}

export const Square: React.FC<PassedProps> = ({ pos, index, oppoId, castleSwapStatus, color, setUpgrade, updatePieces }) => {

    const [dragActive, set_dragActive] = useState<string>("0")
    const { moves, set_moves } = useContext(MovesContext);
    const { setFallenPieces } = useContext(FallenPiecesContext);
    const { yourTurn, setTurn } = useContext(TurnContext)
    const { board, setBoard } = useContext(BoardContext)
    const { enpassant } = useContext(EnpassantContext);
    const { width, height } = useWindowDimensions();
    const [nodeWidthHeight, set_nodeWidthHeight] = useState<number>();

    useEffect(() => {
        if (width > height) {
            set_nodeWidthHeight(Math.floor(height / 8))
        } else {
            set_nodeWidthHeight(Math.floor(width / 8))
        }
    }, [width, height])

    const handleDragEnter = (e: SquareEvent): void => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragLeave = (e: SquareEvent): void => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragOver = (e: SquareEvent): void => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleMove = (e: SquareEvent, key: string, index: number): void => {
        if (yourTurn && getPieceColor(board[key]) === color) {
            set_dragActive("1"); // when the val is 1 the original piece will be hidden and the only the drag piece will be visiible
            createDragImage(e); // Create the draggable image
            const moves: MoveArr[] = getLegalMoves(board[key], Object.keys(board), board, index, castleSwapStatus, enpassant); // returns an array of all aquares we can move to
            moves && moves.forEach((move: MoveArr) => {
                document.getElementsByClassName(`node ${move.effects[0].pos}`)[0].className = `node ${move.effects[0].pos} highlight`
            }) // this function just highlights all the squares the selected piece can move to
            set_moves(moves) // add the moves to state
        }
        // set the piece we are moving to state
        set_dragActive("0")
        return;
    }

    const handleDrop = (e: SquareEvent, key: string): void => {
        set_dragActive("0")
        if (moves.length > 0) {
            let possible: MoveArr[] = moves.filter((move: any) => move.effects[0].pos === key),
                move: MoveArr = possible[0];
            if (move && move.hasOwnProperty("upgrade") && move.upgrade) {
                setUpgrade(true, move);
                removeHighlights();
                return;
            }
            if (possible.length > 0) {
                let copy: Board = { ...board };
                for (let i: number = 0; i < move.effects.length; i++) {
                    let curr: Effects = move.effects[i];
                    copy[curr.pos] = curr.piece;
                }
                let enpassantData: any = move.hasOwnProperty("enpassant") ? move.enpassant : "";
                updatePieces(move);
                setFallenPieces(move.taking)
                setBoard(copy)
                set_moves([])
                removeHighlights()
                if (move.taking.piece) {
                    simulateTakeSound()
                } else if (move.effects.length === 4) {
                    simulateCastleSound()
                } else {
                    simulateMoveSound()
                }
                socket.emit("sendMove", JSON.stringify({ oppoId: oppoId, data: copy, enpassant: enpassantData, taking: move.taking }));
                setTurn(false)
            }
        }
        removeHighlights();
        return;
    };

    return (
        <div
            onDrop={(e: SquareEvent) => { handleDrop(e, pos) }}
            onDragOver={(e: SquareEvent) => handleDragOver(e)}
            onDragEnter={(e: SquareEvent) => handleDragEnter(e)}
            onDragLeave={(e: SquareEvent) => handleDragLeave(e)}
            onDragStart={(e: SquareEvent) => handleMove(e, pos, index)}
            onDragEnd={() => set_dragActive("0")}
            key={index}
            style={color === "black"
                ? {
                    transform: "rotate(180deg)",
                    background: getSqaureColor(index + 1),
                    width: `${nodeWidthHeight}px`,
                    height: `${nodeWidthHeight}px`
                }
                : {
                    transform: "rotate(0deg)",
                    background: getSqaureColor(index + 1),
                    width: `${nodeWidthHeight}px`,
                    height: `${nodeWidthHeight}px`
                }}
            className={`node ${pos}`}>
            <span data-active={dragActive} className="img_parent">{getImage(board[pos])}</span>
            <p>{pos[0].toUpperCase()}{pos[1]}</p>
        </div >
    )
}

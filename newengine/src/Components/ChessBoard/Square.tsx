import React, { useContext, useState } from 'react'
import { getImage } from '../../HelperFunctions/getImage';
import { getLegalMoves } from '../GameInstance/GameFunctions/getLegalMoves';
import { simulateMoveSound } from '../../HelperFunctions/triggerAudio'
import { MovesContext } from './ChessBoard';
import { BoardContext, FallenPiecesContext, TurnContext } from '../GameInstance/GameInstance';
const socket = require('../../SocketConnection/Socket').socket;

interface PassedProps {
    pos: string;
    index: number;
    oppoId: string;
    castleSwapStatus: CastleStatus;
    color: string;
}

export const Square: React.FC<PassedProps> = ({ pos, index, oppoId, castleSwapStatus, color }) => {

    const [dragActive, set_dragActive] = useState<string>("0")
    const { moves, set_moves } = useContext(MovesContext);
    const { setFallenPieces } = useContext(FallenPiecesContext);
    const { yourTurn, setTurn } = useContext(TurnContext)
    const { board, setBoard } = useContext(BoardContext)

    const darkSqaure = `radial-gradient(
        circle,
        rgba(78, 90, 101, 1) 0%,
        rgba(65, 75, 84, 1) 100%
    )`

    // Color of the lighter board sqaures
    const lightSqare = `radial-gradient(
        circle,
        rgba(111, 128, 144, 1) 0%,
        rgba(100, 115, 129, 1) 100%
    )`

    const getSqaureColor = (index: number) => {
        let row = Math.ceil(index / 8)
        if (row % 2) {
            if (index % 2) {
                return lightSqare
            }
            return darkSqaure
        } else {
            if (index % 2) {
                return darkSqaure
            }
            return lightSqare
        }
    }

    const handleDragEnter = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragLeave = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDragOver = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const removeHighlights = () => {
        document.querySelectorAll(".highlight").forEach((ele: any) => {
            let newClass = ele.className.replace(/\shighlight/, "");
            return ele.className = newClass
        })
    }
    const createDragImage = (e: any) => {
        var crt = e.target.cloneNode(true);
        crt.style.background = "none"
        crt.style.position = "absolute"; crt.style.top = "0px"; crt.style.right = "0px";
        crt.style.width = "85px"; crt.style.height = "85px"; crt.style.transform = "rotate(0deg)";
        document.body.appendChild(crt)
        e.dataTransfer.setDragImage(crt, 45, 50);
    }

    const getPieceColor = (piece: string) => {
        if (piece) {
            if (piece.charCodeAt(0) < 91) {
                return "white"
            } else {
                return "black"
            }
        }
        return
    }

    const handleMove = (e: any, key: string, index: number) => {
        if (yourTurn && getPieceColor(board[key]) === color) {
            set_dragActive("1"); // when the val is 1 the original piece will be hidden and the only the drag piece will be visiible
            createDragImage(e); // Create the draggable image
            const moves: MoveArr[] = getLegalMoves(board[key], Object.keys(board), board, index, castleSwapStatus); // returns an array of all aquares we can move to
            moves && moves.forEach((move: MoveArr) => {
                document.getElementsByClassName(`node ${move.effects[0].pos}`)[0].className = `node ${move.effects[0].pos} highlight`
            }) // this function just highlights all the squares the selected piece can move to
            set_moves(moves) // add the moves to state
        }
        // set the piece we are moving to state
        set_dragActive("0")
        return;
    }

    const handleDrop = (e: any, key: any) => {
        set_dragActive("0")
        if (moves.length > 0) {
            let possible = moves.filter((move: any) => move.effects[0].pos === key),
                move = possible[0];
            if (possible.length > 0) {
                let copy = { ...board };
                for (let i: number = 0; i < move.effects.length; i++) {
                    let curr = move.effects[i];
                    copy[curr.pos] = curr.piece;
                    let ele: any = document.getElementsByClassName(`node ${curr.pos}`)[0]
                    console.log("set-arrt", ele, curr.pos)
                    ele.setAttribute('data-active', "0");
                }
                setBoard(copy)
                set_moves([])
                removeHighlights()
                simulateMoveSound()
                socket.emit("sendMove", JSON.stringify({ oppoId: oppoId, data: copy }));
                setTurn(false)
            } else {
                removeHighlights()
                return;
            }
            removeHighlights()
            return;
        }
        removeHighlights()

        return;
    };
    return (
        <div
            onDrop={(e) => { handleDrop(e, pos) }}
            onDragOver={(e) => handleDragOver(e)}
            onDragEnter={(e) => handleDragEnter(e)}
            onDragLeave={(e) => handleDragLeave(e)}
            onDragStart={(e) => handleMove(e, pos, index)}
            onDragEnd={() => set_dragActive("0")}
            key={index}
            style={color === "black" ? { transform: "rotate(180deg)", background: getSqaureColor(index + 1) } : { transform: "rotate(0deg)", background: getSqaureColor(index + 1) }}
            className={`node ${pos}`}>
            <span data-active={dragActive} className="img_parent">{getImage(board[pos])}</span>
            {pos}
        </div>
    )
}

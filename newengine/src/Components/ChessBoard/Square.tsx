import React, { useContext, useState } from 'react'
import { getImage } from '../../HelperFunctions/getImage';
import { getLegalMoves } from '../GameInstance/GameFunctions/getLegalMoves';
import { simulateMoveSound } from '../../HelperFunctions/triggerAudio'
import { MovesContext, PieceContext } from './ChessBoard';
const socket = require('../../SocketConnection/Socket').socket;

interface PassedProps {
    board: any;
    pos: string;
    index: number;
    oppoId: string;
}

export const Square: React.FC<PassedProps> = ({ board, pos, index, oppoId }) => {

    const [dragActive, set_dragActive] = useState<string>("0")
    const { moves, set_moves } = useContext(MovesContext)
    const { piece, set_piece } = useContext(PieceContext)

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

    const getColor = (index: number) => {
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

    const handleMove = (e: any, key: string, index: number) => {
        set_dragActive("1");
        createDragImage(e)
        const moves: string[] = getLegalMoves(board[key], Object.keys(board), board, index);
        console.log("returned moves", moves)
        moves && moves.forEach((move: string) => {
            document.getElementsByClassName(`node ${move}`)[0].className = `node ${move} highlight`
        })
        set_moves(moves)
        set_piece({ pos: key, piece: board[key] });
    }

    const handleDrop = (e: any, key: any) => {
        set_dragActive("0")
        if (moves.length > 0) {
            let possible = moves.filter((move: any) => move === key)
            if (possible.length > 0) {
                board[possible[0]] = piece.piece
                board[piece.pos] = ""
                set_piece({ pos: "", piece: "" })
                set_moves([])
                removeHighlights()
                simulateMoveSound()
                socket.emit("sendMove", JSON.stringify({ oppoId: oppoId, data: board }));
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
            style={{ background: getColor(index + 1) }}
            className={`node ${pos}`}>
            <span data-active={dragActive} className="img_parent">{getImage(board[pos])}</span>
            {pos}
        </div>
    )
}

import React, { useState, useContext } from 'react'
import { GameContext, PlayerContext, SelectedContext } from '../GameInstance/GameInstance';

interface PassedProps {
    col: any;
    rowIndex: number;
    colIndex: number;
    rotateDegree: number;
    handleMoving: (col: any) => void
}

export const Square: React.FC<PassedProps> = ({ col, rowIndex, colIndex, rotateDegree, handleMoving }) => {

    const { selected, setSelected } = useContext(SelectedContext);
    const { player } = useContext(PlayerContext)
    const { game } = useContext(GameContext)
    const [dragActive, set_dragActive] = useState<string>("0");

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
    const handleDrop = (e: any) => {
        if (selected === null) return
        e.preventDefault();
        e.stopPropagation();
        handleMoving(col)
        set_dragActive("0")
    };
    const handleDragStart = (e: any) => {
        if (col.data) {
            if (col.data.color === player.color) {
                var crt = e.target.cloneNode(true);
                crt.style.background = "none"
                crt.style.position = "absolute"; crt.style.top = "0"; crt.style.right = "0";
                crt.style.fontSize = "5rem"
                crt.style.opacity = "1"
                crt.style.transform = "rotate(0deg)";
                document.body.appendChild(crt);
                e.dataTransfer.setDragImage(crt, 48, 50);
                setSelected(col);
                set_dragActive("1");
            }
            return
        }
        return;
    }

    return (
        <div
            key={`${rowIndex}${colIndex}`}
            className={`node ${rowIndex}-${colIndex}`}
            onDrop={(e) => handleDrop(e)}
            onDragOver={(e) => handleDragOver(e)}
            onDragEnter={(e) => handleDragEnter(e)}
            onDragLeave={(e) => handleDragLeave(e)}
        >
            {game && <span
                onDragStart={(e) => handleDragStart(e)}
                onDragEnd={() => set_dragActive("0")}
                draggable={player && col.data && col.data.color === player.color ? true : false}
                data-active={dragActive}
                style={{ color: col.data && col.data.color, transform: `rotate(${rotateDegree}deg)` }}
                className="piece">
                {col.data && col.data.renderImage}
            </span>}
        </div>
    )
}

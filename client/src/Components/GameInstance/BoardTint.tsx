import React from 'react'

interface PassedProps {
    boardWidthHeight: number;
    gameOver: boolean
}

export const BoardTint: React.FC<PassedProps> = ({ boardWidthHeight, gameOver }) => {
    return (
        <>
            {gameOver && <div className="board_tint" style={{ width: boardWidthHeight, height: boardWidthHeight }}>
            </div>}
        </>
    )
}

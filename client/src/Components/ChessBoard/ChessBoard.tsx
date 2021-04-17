import React from 'react'

interface PassedProps {
    board: any
}

export const ChessBoard: React.FC<PassedProps> = ({ board }) => {

    console.log("board in board:", board);

    return (
        <div className="board_wrapper">
            {board.map((row: any, rowIndex: number) => (
                <div key={rowIndex} className={`row ${rowIndex}`}>
                    {row.map((col: any, colIndex: number) => (
                        <div key={`${rowIndex}${colIndex}`} className={`node ${rowIndex}-${colIndex}`}>
                            <span className="piece" style={{ color: col.data && col.data.color }}>{col.data && col.data.renderImage}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

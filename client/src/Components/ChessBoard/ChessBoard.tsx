import React, { useContext, useEffect } from 'react'
import { SelectedContext, BoardContext } from '../GameInstance/GameInstance'

interface PassedProps {
    board: any
}

export const ChessBoard: React.FC<PassedProps> = () => {

    const { selected, setSelected } = useContext(SelectedContext)
    const { board, setBoard } = useContext(BoardContext);

    useEffect(() => {
        console.log("this is selected", selected)
    }, [selected])

    const handleMoveing = (col: any) => {
        let newData: BoardNode[][] | null = board.verifyAttemptedMove(selected, col);
        setSelected(null)
        if (newData) {
            setBoard(newData);
        }
    }

    return (
        <div className="board_wrapper">
            {board.board.map((row: any, rowIndex: number) => (
                <div key={rowIndex} className={`row ${rowIndex}`}>
                    {row.map((col: any, colIndex: number) => (
                        <div
                            key={`${rowIndex}${colIndex}`}
                            className={`node ${rowIndex}-${colIndex}`}
                            onClick={() => selected ? handleMoveing(col) : setSelected(col)}
                        >
                            <span className="piece" style={{ color: col.data && col.data.color }}>{col.data && col.data.renderImage}</span>
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={() => console.log(selected)}>;sodifjhlsdioufjdsf</button>
        </div>
    )
}

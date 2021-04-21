import React, { useContext, useEffect } from 'react'
import { SelectedContext, BoardContext } from '../GameInstance/GameInstance'
import { removeHighlights } from '../../HelperFunctions/highlightFunctions';


export const ChessBoard: React.FC = () => {

    const { selected, setSelected } = useContext(SelectedContext)
    const { board, setBoard } = useContext(BoardContext);

    useEffect(() => {
        console.log("selected useEffect", selected)
    }, [selected])

    const handleMoveing = (col: any) => {
        console.log("handle moving")

        let newData: BoardNode[][] | null = board.applyMove(selected, col);
        //setSelected(null)
        if (newData) {
            setBoard(newData);
            setSelected(null);
            removeHighlights();
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
                            onClick={() => selected !== null ? handleMoveing(col) : setSelected(col)}
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

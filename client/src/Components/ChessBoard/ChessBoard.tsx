import React, { useContext, useEffect, useState } from 'react'
import { SelectedContext, BoardContext, PlayerContext } from '../GameInstance/GameInstance'
import { removeHighlights } from '../../HelperFunctions/highlightFunctions';


export const ChessBoard: React.FC = () => {

    const { selected, setSelected } = useContext(SelectedContext)
    const { board, setBoard } = useContext(BoardContext);
    const { player } = useContext(PlayerContext)
    const [rotateDegree, set_rotateDegree] = useState<number>(0);

    useEffect(() => {
        if (player) {
            if (player.color === "black") {
                set_rotateDegree(180)
            }
            return
        }
        return;
    }, [player])

    useEffect(() => {
        console.log("degrees", rotateDegree)
    }, [rotateDegree])

    const handleMoveing = (col: any) => {
        let newData: BoardNode[][] | null = board.applyMove(selected, col);
        //setSelected(null)
        if (newData) {
            setBoard(newData);
            setSelected(null);
            removeHighlights();
        }
    }

    return (
        <div className="board_wrapper"
            style={{ transform: `rotate(${rotateDegree}deg)` }}
        >
            {board.board.map((row: any, rowIndex: number) => (
                <div key={rowIndex} className={`row ${rowIndex}`}>
                    {row.map((col: any, colIndex: number) => (
                        <div
                            key={`${rowIndex}${colIndex}`}
                            className={`node ${rowIndex}-${colIndex}`}
                            onClick={() => selected !== null ? handleMoveing(col) : setSelected(col)}
                        >
                            <span
                                className="piece"
                                style={{ color: col.data && col.data.color, transform: `rotate(${rotateDegree}deg)` }}>
                                {col.data && col.data.renderImage}
                            </span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

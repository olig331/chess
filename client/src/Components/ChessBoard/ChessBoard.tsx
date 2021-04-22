import React, { useContext, useEffect, useState } from 'react'
import { SelectedContext, BoardContext, PlayerContext, GameContext } from '../GameInstance/GameInstance'
import { removeHighlights } from '../../HelperFunctions/highlightFunctions';
import { simulateMoveSound } from '../../HelperFunctions/triggerAudio';
import { Square } from './Square';

export const ChessBoard: React.FC = () => {

    const { selected, setSelected } = useContext(SelectedContext);
    const { board, setBoard } = useContext(BoardContext);
    const { player } = useContext(PlayerContext);
    const { game } = useContext(GameContext);
    const [rotateDegree, set_rotateDegree] = useState<number>(0);

    useEffect(() => {
        if (player) {
            if (player.color === "black") {
                set_rotateDegree(180)
            }
            return
        }
        return;
    }, [player]);

    useEffect(() => {
        console.log("degrees", rotateDegree)
    }, [rotateDegree])

    const handleMoveing = (col: any) => {
        if (!player.yourTurn) return;
        let newData: BoardNode[][] | null = board.applyMove(selected, col, player.oppoId);
        //setSelected(null)
        if (newData) {
            setBoard(newData);
            setSelected(null);
            removeHighlights();
            player.yourTurn = false
            simulateMoveSound();
        };
    };

    const getScores = (fallenPieces: string[]) => {
        let total: number = 0;
        fallenPieces.forEach((tag: string) => {
            let char = tag.toLowerCase();
            if (char === "p") total += 1;
            if (char === "n" || char === "b") total += 3;
            if (char === "r") char += 5;
            if (char === "q") char += 9;
        })
        return total
    }

    return (
        <>
            {player && <div>white:{getScores(game.fallenPieces.white)} black:{getScores(game.fallenPieces.black)}</div>}
            <div className="board_wrapper"
                style={{ transform: `rotate(${rotateDegree}deg)` }}
            >
                {board.board.map((row: any, rowIndex: number) => (
                    <div key={rowIndex} className={`row ${rowIndex}`}>
                        {row.map((col: any, colIndex: number) => (
                            <Square
                                col={col}
                                colIndex={colIndex}
                                rowIndex={rowIndex}
                                rotateDegree={rotateDegree}
                                handleMoving={handleMoveing}
                            />
                            // <div

                            //     onClick={() => selected !== null ? handleMoveing(col) : setSelected(col)}
                            // >
                            //     <span
                            //         className="piece"
                            //         style={{ color: col.data && col.data.color, transform: `rotate(${rotateDegree}deg)` }}>
                            //         {col.data && col.data.renderImage}
                            //     </span>
                            // </div>
                        ))}
                    </div>
                ))}
            </div>
        </>
    )
}

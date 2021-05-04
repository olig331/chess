import React, { useState } from 'react'
import { Square } from './Square';
import { checkForCheck } from '../GameInstance/GameFunctions/checkForCheck';

interface PassedProps {
    board: { [key: string]: string };
    oppoId: string;
    castleSwapStatus: CastleStatus,
    color: string
};

const MovesContext: any = React.createContext([]);

export const ChessBoard: React.FC<PassedProps> = ({ board, oppoId, castleSwapStatus, color }) => {

    const [moves, set_moves] = useState<MoveArr[]>([])

    return (
        <div className="board_wrapper" style={color === "black" ? { transform: "rotate(180deg)" } : { transform: "rotate(0deg)" }}>
            {Object.keys(board).map((key: string, index: number) => (
                <MovesContext.Provider value={{ moves, set_moves }}>
                    <Square
                        board={board}
                        pos={key}
                        index={index}
                        oppoId={oppoId}
                        castleSwapStatus={castleSwapStatus}
                        color={color}
                    />
                </MovesContext.Provider>
            ))}
            <button onClick={() => checkForCheck(board, "white")}>Check for check</button>
        </div>
    )
}

export { MovesContext }
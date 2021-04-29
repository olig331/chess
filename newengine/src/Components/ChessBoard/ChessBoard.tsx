import React, { useState } from 'react'
import { Square } from './Square';
import { checkForCheck } from '../GameInstance/GameFunctions/checkForCheck';

interface PassedProps {
    board: { [key: string]: string };
    oppoId: string;
    castleSwapStatus: CastleStatus
};

const MovesContext: any = React.createContext([]);

export const ChessBoard: React.FC<PassedProps> = ({ board, oppoId, castleSwapStatus }) => {

    const [moves, set_moves] = useState<MoveArr[]>([])

    return (
        <div className="board_wrapper">
            {Object.keys(board).map((key: string, index: number) => (
                <MovesContext.Provider value={{ moves, set_moves }}>
                    <Square
                        board={board}
                        pos={key}
                        index={index}
                        oppoId={oppoId}
                        castleSwapStatus={castleSwapStatus}
                    />
                </MovesContext.Provider>
            ))}
            <button onClick={() => checkForCheck(board, "white")}>Check for check</button>
        </div>
    )
}

export { MovesContext }
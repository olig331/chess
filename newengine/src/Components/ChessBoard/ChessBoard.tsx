import React, { useState } from 'react'
import { Square } from './Square';
import { checkForCheck } from '../GameInstance/GameFunctions/checkForCheck';

interface PassedProps {
    board: { [key: string]: string };
    oppoId: string;
};

const MovesContext: any = React.createContext([]);
const PieceContext: any = React.createContext({});

export const ChessBoard: React.FC<PassedProps> = ({ board, oppoId }) => {

    const [moves, set_moves] = useState<string[]>([])
    const [piece, set_piece] = useState<{ [key: string]: string }>({ old: "", piece: "" })

    return (
        <div className="board_wrapper">
            {Object.keys(board).map((key: string, index: number) => (
                <MovesContext.Provider value={{ moves, set_moves }}>
                    <PieceContext.Provider value={{ piece, set_piece }}>
                        <Square
                            board={board}
                            pos={key}
                            index={index}
                            oppoId={oppoId}
                        />
                    </PieceContext.Provider>
                </MovesContext.Provider>
            ))}
            <button onClick={() => checkForCheck(board, "white")}>Check for check</button>
        </div>
    )
}

export { MovesContext, PieceContext }
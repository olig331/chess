import React, { useContext, useState } from 'react'
import { BoardContext } from '../GameInstance/GameInstance';
import { Square } from './Square';

interface PassedProps {
    oppoId: string;
    castleSwapStatus: CastleStatus,
    color: string
};

const MovesContext: any = React.createContext([]);

export const ChessBoard: React.FC<PassedProps> = ({ oppoId, castleSwapStatus, color }) => {

    const [moves, set_moves] = useState<MoveArr[]>([])
    const { board } = useContext(BoardContext)

    return (
        <div className="board_wrapper" style={color === "black" ? { transform: "rotate(180deg)" } : { transform: "rotate(0deg)" }}>
            {Object.keys(board).map((key: string, index: number) => (
                <MovesContext.Provider value={{ moves, set_moves }}>
                    <Square
                        pos={key}
                        index={index}
                        oppoId={oppoId}
                        castleSwapStatus={castleSwapStatus}
                        color={color}
                    />
                </MovesContext.Provider>
            ))}
        </div>
    )
}

export { MovesContext }
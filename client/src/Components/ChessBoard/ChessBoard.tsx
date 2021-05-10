import React, { useContext, useState } from 'react'
import { BoardContext } from '../GameInstance/GameInstance';
import { Square } from './Square';

interface PassedProps {
    oppoId: string;
    castleSwapStatus: CastleStatus,
    color: string;
    setUpgrade: (val: boolean, move: MoveArr) => void
    updatePieces: (move: MoveArr) => void;
    updateFallenPieces: (taking: Taking) => void;
    boardWidthHeight: number;
    changeCastleStatus: (updates: string[]) => void
    calcAndSetMoveForHistory: (data: MoveArr) => string;
};

const MovesContext: any = React.createContext([]);

export const ChessBoard: React.FC<PassedProps> = ({ oppoId, castleSwapStatus, color, setUpgrade, updatePieces, updateFallenPieces, boardWidthHeight, changeCastleStatus, calcAndSetMoveForHistory }) => {

    const [moves, set_moves] = useState<MoveArr[]>([]);
    const { board } = useContext(BoardContext);

    return (
        <div
            className="board_wrapper"
            style={color === "black"
                ? { transform: "rotate(180deg)", width: `${boardWidthHeight}px` }
                : { transform: "rotate(0deg)", width: `${boardWidthHeight}px` }}
        >
            {Object.keys(board).map((key: string, index: number) => (
                <React.Fragment key={index}>
                    <MovesContext.Provider value={{ moves, set_moves }}>
                        <Square
                            pos={key}
                            index={index}
                            oppoId={oppoId}
                            castleSwapStatus={castleSwapStatus}
                            color={color}
                            setUpgrade={setUpgrade}
                            updatePieces={updatePieces}
                            updateFallenPieces={updateFallenPieces}
                            changeCastleStatus={changeCastleStatus}
                            calcAndSetMoveForHistory={calcAndSetMoveForHistory}
                        />
                    </MovesContext.Provider>
                </React.Fragment>
            ))}
        </div>
    )
}

export { MovesContext }
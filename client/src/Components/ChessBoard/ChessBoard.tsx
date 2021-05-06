import React, { useContext, useState, useEffect } from 'react'
import useWindowDimensions from '../../CustomHooks/WIndowDimensions';
import { BoardContext } from '../GameInstance/GameInstance';
import { Square } from './Square';

interface PassedProps {
    oppoId: string;
    castleSwapStatus: CastleStatus,
    color: string;
    setUpgrade: (val: boolean, move: MoveArr) => void
    updatePieces: (move: MoveArr) => void;
};

const MovesContext: any = React.createContext([]);

export const ChessBoard: React.FC<PassedProps> = ({ oppoId, castleSwapStatus, color, setUpgrade, updatePieces }) => {

    const [moves, set_moves] = useState<MoveArr[]>([])
    const { board } = useContext(BoardContext);
    const { width, height } = useWindowDimensions();
    const [boardWidthHeight, set_boardWidthHeight] = useState<number>();

    useEffect(() => {
        if (height < width) {
            set_boardWidthHeight(height)
        } else {
            set_boardWidthHeight(width)
        }
        return
    }, [width, height])

    return (
        <div
            className="board_wrapper"
            style={color === "black"
                ? { transform: "rotate(180deg)", width: `${boardWidthHeight}px`, height: `${boardWidthHeight}px` }
                : { transform: "rotate(0deg)", width: `${boardWidthHeight}px`, height: `${boardWidthHeight}px` }}
        >
            {Object.keys(board).map((key: string, index: number) => (
                <MovesContext.Provider value={{ moves, set_moves }}>
                    <Square
                        pos={key}
                        index={index}
                        oppoId={oppoId}
                        castleSwapStatus={castleSwapStatus}
                        color={color}
                        setUpgrade={setUpgrade}
                        updatePieces={updatePieces}
                    />
                </MovesContext.Provider>
            ))}
        </div>
    )
}

export { MovesContext }
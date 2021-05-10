import React from 'react';

interface PassedProps {
    moves: string[]
}

export const MoveHistory: React.FC<PassedProps> = ({ moves }) => {

    return (
        <div className="move_history_container">
            <ul className="move_string_container">
                {moves.map((move: string, index: number) => (
                    <li key={index} className="move_string">
                        {move}
                    </li>
                ))}
            </ul>
        </div>
    )
}

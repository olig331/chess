import React from 'react'
import { Chat } from '../Chat/Chat'

interface PassedProps {
    oppoId: string;
    fallenPieces: FallenPieces;
    color: string
}

export const GameInfo: React.FC<PassedProps> = ({ oppoId, fallenPieces, color }) => {
    return (
        <div>
            <div className="you"></div>
            <div className="opponent"></div>

            <Chat
                oppoId={oppoId}
            />
        </div>
    )
}

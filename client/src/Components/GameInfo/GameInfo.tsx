import React from 'react'
import { Chat } from './Chat/Chat'

interface PassedProps {
    oppoId: string;
}

export const GameInfo: React.FC<PassedProps> = ({ oppoId }) => {

    return (
        <div className="game_info_container">
            <Chat
                oppoId={oppoId}
            />
        </div>
    )
}

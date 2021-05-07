import React from 'react'
import { socket } from '../../SocketConnection/Socket'
import { Chat } from './Chat/Chat'

interface PassedProps {
    oppoId: string;
    boardWidthHeight: number
}

export const GameInfo: React.FC<PassedProps> = ({ oppoId, boardWidthHeight }) => {

    const handleSurrendor = () => {
        socket.emit("lostTheMatch", oppoId);

    }

    return (
        <div className="game_info_container" style={{ height: `${boardWidthHeight}px` }}>
            <div className="game_buttons">
                <div onClick={() => handleSurrendor()}>Surrendor</div>
                <div>Rematch</div>
            </div>

            <Chat
                oppoId={oppoId}
                boardWidthHeight={boardWidthHeight}
            />
        </div>
    )
}

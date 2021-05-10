import React from 'react'
import { socket } from '../../SocketConnection/Socket'
import { Chat } from './Chat/Chat'

interface PassedProps {
    oppoId: string;
    boardWidthHeight: number
    settingGameOver: (status: boolean, message: string) => void
}

export const GameInfo: React.FC<PassedProps> = ({ oppoId, boardWidthHeight, settingGameOver }) => {
    const handleSurrendor = () => {
        socket.emit("lostTheMatch", oppoId);
        settingGameOver(true, "You Lost!")
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

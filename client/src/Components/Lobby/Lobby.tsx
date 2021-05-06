import React, { useState, useEffect } from 'react'
import { GameInstance } from '../GameInstance/GameInstance'
const socket = require('../../SocketConnection/Socket').socket
interface PassedProps {
    match: any
}

export const Lobby: React.FC<PassedProps> = (props) => {

    const [lobbyId, set_lobbyId] = useState<string>("");

    useEffect(() => {
        socket.emit("joinedLobby", props.match.params.lobbyId);
        set_lobbyId(props.match.params.lobbyId)
    }, []) // eslint-disable-line


    return (
        <div className="lobby_container">
            <p>Lobby: {lobbyId}</p>

            <div className="game_wrapper">
                <GameInstance />
            </div>
        </div>
    )
}

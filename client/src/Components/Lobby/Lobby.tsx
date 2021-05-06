import React, { useState, useEffect } from 'react'
import { GameInstance } from '../GameInstance/GameInstance'
import { GameOver } from '../GameOver/GameOver';
import { simulateStartSound } from '../../HelperFunctions/triggerAudio';
import { FallenPiecesContext } from '../../Context/Context';

const socket = require('../../SocketConnection/Socket').socket;

interface PassedProps {
    match: any
}

const ColorContext: any = React.createContext("");
const OppoIdContext: any = React.createContext("");

export const Lobby: React.FC<PassedProps> = (props) => {

    const [lobbyId, set_lobbyId] = useState<string>("");
    const [oppoId, setOppodId] = useState<string>("");
    const [color, setColor] = useState<string>("");
    const [fallenPieces, setFallenPieces] = useState<FallenPieces>({ "white": [], "black": [] });

    useEffect(() => {
        socket.emit("joinedLobby", props.match.params.lobbyId);
        set_lobbyId(props.match.params.lobbyId)
    }, []) // eslint-disable-line

    useEffect(() => {
        socket.on("getMatchSetUpData", (payload: SetUpData): void => {
            console.log("set up data", payload)
            setColor(payload.color)
            setOppodId(payload.oppoId)
            simulateStartSound();
        });
    }, [])

    return (
        <div className="lobby_container">
            <p>Lobby: {lobbyId}</p>

            <div className="game_wrapper">
                <FallenPiecesContext.Provider value={{ fallenPieces, setFallenPieces }}>
                    {color && <GameInstance
                        color={color}
                        oppoId={oppoId}
                    />}
                </FallenPiecesContext.Provider>
            </div>
            <GameOver />
        </div>
    )
}

export { ColorContext, OppoIdContext }

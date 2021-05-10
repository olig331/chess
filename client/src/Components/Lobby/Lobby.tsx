import React, { useState, useEffect } from 'react'
import { GameInstance } from '../GameInstance/GameInstance'
import { GameOver } from '../GameOver/GameOver';
import { simulateStartSound } from '../../HelperFunctions/triggerAudio';
import { FallenPiecesContext } from '../../Context/Context';
import { FallenPieces } from '../FallenPieces/FallenPieces';
import { GameInfo } from '../GameInfo/GameInfo';
import { FaChessKing } from 'react-icons/fa';
import useWindowDimensions from '../../CustomHooks/WIndowDimensions';
import { WaitingForConnection } from './WaitingForConnection';
import { LobbyID } from './LobbyID';

const socket = require('../../SocketConnection/Socket').socket;

interface PassedProps {
    match: any;
}

const ColorContext: any = React.createContext("");
const OppoIdContext: any = React.createContext("");

export const Lobby: React.FC<PassedProps> = (props) => {

    const [lobbyId, set_lobbyId] = useState<string>("");
    const [oppoId, setOppodId] = useState<string>("");
    const [color, setColor] = useState<string>("");
    const [fallenPieces, setFallenPieces] = useState<FallenPieces>({ "white": [], "black": [] });
    const { width, height } = useWindowDimensions()
    const [boardWidthHeight, set_boardWidthHeight] = useState<number>(0);
    const [gameOver, set_gameOver] = useState<boolean>(false);
    const [gameOverMessage, setGamOverMessage] = useState<string>("");

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

    const settingGameOver = (status: boolean, message: string) => {
        set_gameOver(status);
        setGamOverMessage(message);
    }

    useEffect(() => {
        if (width < height) {
            if (width > 1016) {
                let val: number = Math.ceil(width / 2);
                set_boardWidthHeight(val)
                return
            } else {
                set_boardWidthHeight(width)
            }
        } else {
            if (width > 1016) {
                let val: number = Math.ceil(width / 2)
                set_boardWidthHeight(val);
                return
            }
            set_boardWidthHeight(height);
        }
        return
    }, [width, height]);



    return (
        <div className="lobby_container">
            <LobbyID
                lobbyId={lobbyId}
            />
            <WaitingForConnection oppoId={oppoId} />
            {oppoId &&
                <>
                    <FallenPiecesContext.Provider value={{ fallenPieces, setFallenPieces }}>
                        <div className="opponent player">
                            <div className="playerIcon" style={color === "white" ? { color: "black" } : { color: "white" }}><FaChessKing /></div>
                            <p>:</p>
                            <FallenPieces
                                pieces={color === "white" ? fallenPieces.white : fallenPieces.black}
                            />
                        </div>
                        <div className="game">
                            {color && <GameInstance
                                color={color}
                                oppoId={oppoId}
                                boardWidthHeight={boardWidthHeight}
                                gameOver={gameOver}
                                settingGameOver={settingGameOver}
                            />}
                        </div>
                        <div className="you player">
                            <div className="playerIcon" style={color === "white" ? { color: "white" } : { color: "black" }}><FaChessKing /></div>
                            <p>:</p>
                            <FallenPieces
                                pieces={color === "white" ? fallenPieces.black : fallenPieces.white}
                            />
                        </div>
                    </FallenPiecesContext.Provider>
                    {/* </div> */}
                    <GameOver
                        gameOver={gameOver}
                        gameOverMessage={gameOverMessage}
                        settingGameOver={settingGameOver}
                    />
                    <div className="chat">
                        <GameInfo
                            oppoId={oppoId}
                            boardWidthHeight={boardWidthHeight}
                            settingGameOver={settingGameOver}
                        />
                    </div>
                </>}
            <div className="image_block"></div>
        </div >
    )
}

export { ColorContext, OppoIdContext }

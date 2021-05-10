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
import { MoveHistory } from '../MoveHistory/MoveHistory';

const socket = require('../../SocketConnection/Socket').socket;

interface PassedProps {
    match: any;
}

const ColorContext: any = React.createContext("");
const OppoIdContext: any = React.createContext("");

export const Lobby: React.FC<PassedProps> = (props) => {

    const { width, height } = useWindowDimensions();

    const [lobbyId, set_lobbyId] = useState<string>("");
    const [oppoId, setOppodId] = useState<string>("");
    const [color, setColor] = useState<string>("");
    const [fallenPieces, setFallenPieces] = useState<FallenPieces>({ "white": [], "black": [] })
    const [boardWidthHeight, set_boardWidthHeight] = useState<number>(0);
    const [gameOver, set_gameOver] = useState<boolean>(false);
    const [gameOverMessage, setGamOverMessage] = useState<string>("");
    const [moveHistory, set_moveHistory] = useState<string[]>([]);

    const addToMoveHistory = (move: string) => {
        set_moveHistory(prev => [...prev, move])
    }

    const setMoveHistory = (data: MoveArr): string => {
        console.log("data in setMoveHGistory", data)
        if (data.effects.length === 4) { // castle-swap
            if (data.effects[0].pos[0] === "c") {
                set_moveHistory(prev => [...prev, "0-0-0"])
                return "0-0-0"
            } else {
                set_moveHistory(prev => [...prev, "0-0"]);
                return "0-0"
            }

        }
        let result: string = data.effects[0].piece;
        if (data.taking.piece) {
            result += "x";
        }
        result += data.effects[0].pos
        set_moveHistory(prev => [...prev, result]);
        return result
    }

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

    useEffect(() => {
        console.log("this is move history", moveHistory)
    }, [moveHistory])

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
                                calcAndSetMoveForHistory={setMoveHistory}
                                addToMoveHistory={addToMoveHistory}
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
                    <MoveHistory
                        moves={moveHistory}
                    />
                </>}
            <div className="image_block"></div>
        </div >
    )
}

export { ColorContext, OppoIdContext }

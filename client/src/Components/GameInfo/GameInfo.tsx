import React from 'react'
import { FallenPieces } from '../FallenPieces/FallenPieces'
import { Chat } from './Chat/Chat'

interface PassedProps {
    oppoId: string;
    fallenPieces: FallenPieces;
    color: string
}

export const GameInfo: React.FC<PassedProps> = ({ oppoId, fallenPieces, color }) => {

    console.log(color, fallenPieces)

    return (
        <div className="game_info_container">
            <div className="player you">
                Yours:
                <FallenPieces
                    pieces={color === "white" ? fallenPieces.black : fallenPieces.white}
                />
            </div>
            <div className="player opponent">
                Theirs:
                <FallenPieces
                    pieces={color === "white" ? fallenPieces.white : fallenPieces.black}
                />
            </div>

            <Chat
                oppoId={oppoId}
            />
        </div>
    )
}

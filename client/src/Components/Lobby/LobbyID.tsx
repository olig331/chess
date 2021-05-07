import React, { useEffect, useState } from 'react'
import { FaClipboard } from 'react-icons/fa'

interface PassedProps {
    lobbyId: string
}

export const LobbyID: React.FC<PassedProps> = ({ lobbyId }) => {

    const [copied, set_copied] = useState(false);

    const copyToClipboard = (e: any) => {
        const text: string = e.target.innerText;
        navigator.clipboard.writeText(`http://localhost:3000/lobby/${text}`).then(() => {
            set_copied(true)
        });
    }

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                set_copied(false)
            }, 4000)
        }
    }, [copied])

    return (
        <div>
            <p
                className="lobby_id"
                title="Copy Adress">
                <span>
                    Lobby Id:
                </span>
                <p onClick={(e) => copyToClipboard(e)}>
                    {lobbyId}
                </p>
                <div>
                    <FaClipboard />
                </div>
            </p>
            {copied && <div className="copied_pop_up">Copied To Clipboard</div>}
        </div>
    )
}

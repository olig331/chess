import React from 'react'

interface PassedProps {
    oppoId: string
}

export const WaitingForConnection: React.FC<PassedProps> = ({ oppoId }) => {
    return (
        <>
            { !oppoId && <div className="waiting_for_player_wrapper">
                <h3>Waiting for opponent to connect</h3>
                <div className="lds-ripple"><div></div><div></div></div>
            </div>}
        </>
    )
}
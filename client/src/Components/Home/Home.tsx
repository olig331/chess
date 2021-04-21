import React from 'react'
import { v1 as uuid } from 'uuid';

interface PassedProps {
    history: any
}

export const Home: React.FC<PassedProps> = (props) => {

    const createLobby = () => {
        const id = uuid();
        props.history.push(`/lobby/${id}`);
    }

    return (
        <div className="home_container">
            <div className="create_private_lobby" onClick={createLobby}>Create a new Private Lobby</div>
        </div>
    )
}

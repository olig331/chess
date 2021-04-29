import React from 'react'
import { v1 as uuid } from 'uuid';

interface PassedProps {
    history: any
}

export const Home: React.FC<PassedProps> = (props) => {

    const createRoom = (): void => {
        const id = uuid()
        props.history.push(`/lobby/${id}`);
    }

    return (
        <>
            <div className="create_room_btn" onClick={createRoom}>Create Room!!</div>
        </>
    )
}

import React, { useState, useEffect } from 'react';
import { simulateGameOverSound } from '../../HelperFunctions/triggerAudio';

const socket = require('../../SocketConnection/Socket').socket

export const GameOver: React.FC = () => {

    const [gameOver, set_gameOver] = useState<boolean>(false)
    const [gameOverMessage, set_gameOverMessage] = useState<string>("")

    useEffect(() => {
        socket.on("stalemate", (): void => {
            set_gameOver(true)
            set_gameOverMessage("Stalemate!")
            simulateGameOverSound()
        })
        return;
    }, [])

    useEffect(() => {
        socket.on("wonGame", (): void => {
            set_gameOver(true)
            set_gameOverMessage("You Won!")
            simulateGameOverSound()
        });
        return;
    }, [])

    return (
        <>
            { gameOver &&
                <div>
                    <h3>{gameOverMessage}</h3>
                </div>
            }
        </>
    )
}

import React, { useEffect } from 'react';
import { simulateGameOverSound } from '../../HelperFunctions/triggerAudio';

const socket = require('../../SocketConnection/Socket').socket

interface passedProps {
    gameOver: boolean;
    gameOverMessage: string
    settingGameOver: (status: boolean, message: string) => void
}

export const GameOver: React.FC<passedProps> = ({ gameOver, gameOverMessage, settingGameOver }) => {

    useEffect(() => {
        socket.on("stalemate", (): void => {
            settingGameOver(true, "Stalemate!")
            simulateGameOverSound()
        })
        return;
    }, []) //eslint-disable-line

    useEffect(() => {
        socket.on("wonGame", (): void => {
            settingGameOver(true, "You Won!")
            simulateGameOverSound()
        });
        return;
    }, [])//eslint-disable-line


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

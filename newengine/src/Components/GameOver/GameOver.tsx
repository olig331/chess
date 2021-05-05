import React from 'react';

interface PassedProps {
    gameOver: boolean;
    gameOverMessage: string
}

export const GameOver: React.FC<PassedProps> = ({ gameOver, gameOverMessage }) => {
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

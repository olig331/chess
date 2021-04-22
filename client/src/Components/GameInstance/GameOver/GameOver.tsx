import React, { useContext } from 'react'
import { GameContext } from '../GameInstance'

export const GameOver: React.FC = () => {

    const { game } = useContext(GameContext)

    return (
        <>
            {game && game.gameOver && (
                <>
                    {game.winner === "won" && <div>Match won</div>}
                    {game.winner === "lost" && <div>Match lost</div>}
                    {game.winner === "draw" && <div>Match Drawn</div>}
                </>
            )}
        </>
    )
}

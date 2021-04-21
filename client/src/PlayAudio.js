import React from 'react';
import useSound from 'use-sound';
import endSound from './AudioAssests/endGameSound.mp3'
import moveSound from "./AudioAssests/moveSound.mp3";
import startSound from './AudioAssests/startSound.mp3'

export const PlayAudio = () => {

    const [move] = useSound(moveSound);
    const [endGame] = useSound(endSound)
    const [startGame] = useSound(startSound)

    return (
        <>
            <div style={{ visibility: "hidden" }} id="move_sound" onClick={move}></div>
            <div style={{ visibility: "hidden" }} id="end_game_sound" onClick={endGame}></div>
            <div style={{ visibility: "hidden" }} id="start_game_sound" onClick={startGame}></div>
        </>
    )
}
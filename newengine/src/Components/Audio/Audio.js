import React from 'react'
import useSound from 'use-sound';

import moveSound from '../../Assets/Audio/newMoveSound.mp3'
import endSound from '../../Assets/Audio/endGameSound.mp3'
import startSound from '../../Assets/Audio/startSound.mp3'
import takeSound from '../../Assets/Audio/takeSound.mp3'
import castleSound from '../../Assets/Audio/castleSound.mp3'

export const Audio = () => {

    const [move] = useSound(moveSound)
    const [start] = useSound(startSound)
    const [end] = useSound(endSound)
    const [take] = useSound(takeSound)
    const [castle] = useSound(castleSound)

    return (
        <>
            <div style={{ visibility: "hidden" }} id="moveSound" onClick={move}></div>
            <div style={{ visibility: "hidden" }} id="startSound" onClick={start}></div>
            <div style={{ visibility: "hidden" }} id="endSound" onClick={end}></div>
            <div style={{ visibility: "hidden" }} id="takeSound" onClick={take}></div>
            <div style={{ visibility: "hidden" }} id="castleSound" onClick={castle}></div>
        </>
    )
}

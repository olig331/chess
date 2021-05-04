import React from 'react'
import { getImage } from '../../HelperFunctions/getImage';

interface PassedProps {
    selectUpgradePiece: (piece: string) => void
    color: string
}

export const PawnUpgrade: React.FC<PassedProps> = ({ selectUpgradePiece, color }) => {

    const sendTag = (tag: string) => {
        if (color === "white") {
            return tag.toUpperCase()
        }
        return tag
    }

    return (
        <div className="upgrade_container">
            <div className="upgrade_icon" onClick={() => selectUpgradePiece(sendTag("q"))}>{getImage(sendTag("q"))}</div>
            <div className="upgrade_icon" onClick={() => selectUpgradePiece(sendTag("r"))}>{getImage(sendTag("r"))}</div>
            <div className="upgrade_icon" onClick={() => selectUpgradePiece(sendTag("b"))}>{getImage(sendTag("b"))}</div>
            <div className="upgrade_icon" onClick={() => selectUpgradePiece(sendTag("n"))}>{getImage(sendTag("n"))}</div>
        </div>
    );
};

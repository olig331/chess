import React from 'react'
import { getImage } from '../../HelperFunctions/getImage';

interface PassedProps {
    selectUpgradePiece: (piece: string) => void
    color: string;
    showUpgrade: boolean
}

export const PawnUpgrade: React.FC<PassedProps> = ({ selectUpgradePiece, color, showUpgrade }) => {

    const sendTag = (tag: string): string => {
        if (color === "white") {
            return tag.toUpperCase()
        }
        return tag
    }

    return (
        <>
            {showUpgrade &&
                <div className="upgrade_container">
                    <div className="upgrade_icon" onClick={() => selectUpgradePiece(sendTag("q"))}>{getImage(sendTag("q"))}</div>
                    <div className="upgrade_icon" onClick={() => selectUpgradePiece(sendTag("r"))}>{getImage(sendTag("r"))}</div>
                    <div className="upgrade_icon" onClick={() => selectUpgradePiece(sendTag("b"))}>{getImage(sendTag("b"))}</div>
                    <div className="upgrade_icon" onClick={() => selectUpgradePiece(sendTag("n"))}>{getImage(sendTag("n"))}</div>
                </div>
            }
        </>
    );
};

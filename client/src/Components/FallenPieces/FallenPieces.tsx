import React from 'react';
import { getImage } from '../../HelperFunctions/getImage';

interface PassedProps {
    pieces: string[]
}

export const FallenPieces: React.FC<PassedProps> = ({ pieces }) => {

    return (
        <div className="fallen_pieces_imgs">
            {pieces.map((piece: string, index: number) => (
                <div className="fallen_piece" style={{ width: "30px", height: "30px", left: `calc(15px * ${index})` }}>
                    {getImage(piece)}
                </div>
            ))}
        </div>
    )
}

import { Pawn } from '../Classes/AllPieces/Pawn'
import { Rook } from '../Classes/AllPieces/Rook'
import { Queen } from '../Classes/AllPieces/Queen'
import { King } from '../Classes/AllPieces/King'
import { Bishop } from '../Classes/AllPieces/Bishop'
import { Knight } from '../Classes/AllPieces/Knight'
import { Piece } from '../Classes/Piece'
import { getVectors } from './getVectors'
import { FaChessPawn, FaChessRook, FaChessQueen, FaChessKing, FaChessKnight, FaChessBishop } from 'react-icons/fa'


export const getClass = (tag: string): Piece | null => {
    let color = tag.charCodeAt(0) < 91 ? "white" : "black",
        lowerCaseTag: string = tag.toLowerCase();
    console.log(color, tag.charCodeAt(0))


    switch (lowerCaseTag) {
        case "p":
            return new Pawn(color, getVectors("p", color), <FaChessPawn />)
        case "r":
            return new Rook(color, getVectors("r", color), <FaChessRook />)
        case "b":
            return new Bishop(color, getVectors("b", color), <FaChessBishop />)
        case "q":
            return new Queen(color, getVectors("q", color), <FaChessQueen />)
        case "k":
            return new King(color, getVectors("k", color), <FaChessKing />)
        case "n":
            return new Knight(color, getVectors("n", color), <FaChessKnight />)
        default:
            return null
    }
}

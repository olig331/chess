import React from 'react'
import { Board } from '../../Classes/Board';
import { ChessBoard } from '../ChessBoard/ChessBoard';


export class GameInstance extends React.Component {


    state: GameState = {
        board: new Board()
    }


    render() {
        return (
            <ChessBoard
                board={this.state.board.board}
            />
        )
    }
}


import React from 'react'
import { Board } from '../../Classes/Board';
import { Player } from '../../Classes/Player';
import { ChessBoard } from '../ChessBoard/ChessBoard';
import { highlightMovesSquares } from '../../HelperFunctions/highlightFunctions';

const SelectedContext: any = React.createContext<any>(null)
const BoardContext: any = React.createContext(null)

export class GameInstance extends React.Component {

    state: GameState = {
        board: new Board(),
        selected: null,
        player: null
    }


    public setSelected = (toSelect: any) => {
        if (toSelect === null || toSelect.data === null) {
            this.setState({
                selected: null
            })
            return;
        }
        let moves = toSelect.getPiecesMoves(this.state.board, this.state.player.kingsPos, this.state.player.inCheck);
        this.setState({
            selected: toSelect
        });
        highlightMovesSquares(moves);
        return;
    };

    public setBoard = (newBoard: BoardNode[][]) => {
        let copy = this.state.board;
        copy.board = newBoard;
        this.setState({
            board: copy
        })
    }

    render() {
        const selected = this.state.selected
        const { setSelected } = this;
        const board = this.state.board;
        const { setBoard } = this;

        return (
            <>
                <BoardContext.Provider value={{ board, setBoard }}>
                    <SelectedContext.Provider value={{ selected, setSelected }}>
                        <ChessBoard />
                    </SelectedContext.Provider>
                </BoardContext.Provider>
            </>
        )
    }
}

export { SelectedContext, BoardContext }


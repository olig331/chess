import React from 'react'
import { Board } from '../../Classes/Board';
import { ChessBoard } from '../ChessBoard/ChessBoard';

const SelectedContext: any = React.createContext<any>(null)
const BoardContext: any = React.createContext(null)

export class GameInstance extends React.Component {

    state: GameState = {
        board: new Board(),
        selected: null
    }

    public highlightMovesSquares = (moves: coords[]) => {
        moves && moves.map((move: coords) => {
            return document.getElementsByClassName(`node ${move.y}-${move.x}`)[0].className =
                `node ${move.y}-${move.x} highlight`
        })
    }

    public setSelected = (toSelect: any) => {
        console.log("toSelect", toSelect)
        if (!toSelect.data) {
            return;
        }
        this.setState({
            selected: toSelect
        }, () => {
            console.log("cb after setting seletted", this.state.selected);
            let moves = toSelect.getPiecesMoves(this.state.board.board);
            this.highlightMovesSquares(moves)
        })
        return;
    }

    public setBoard = (newBoard: BoardNode[][]) => {
        let copy = this.state.board;
        copy.board = newBoard;
        this.setState({
            board: copy
        }, () => {
            console.log("after update check if class in instact", this.state.board, this.state.board.board)
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
                        <ChessBoard
                            board={this.state.board.board}
                        />
                    </SelectedContext.Provider>
                </BoardContext.Provider>
            </>
        )
    }
}

export { SelectedContext, BoardContext }


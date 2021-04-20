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
        });
    };

    public removeHighlights = () => {
        document.querySelectorAll(".highlight").forEach((ele: any) => {
            let newClass: string = ele.className.replace(/\shighlight/, "");
            return ele.className = newClass;
        });
    };

    public setSelected = (toSelect: any, copy: any) => {
        console.log("setSelected called", toSelect)
        if (toSelect === null || toSelect.data === null) {
            this.setState({
                selected: null
            })
            return
        }

        let moves = toSelect.getPiecesMoves(this.state.board);
        this.setState({
            selected: toSelect
        }, () => {
            this.highlightMovesSquares(moves)
        });
        return;
    };

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
                            removeHighlights={this.removeHighlights}
                        />
                    </SelectedContext.Provider>
                </BoardContext.Provider>
            </>
        )
    }
}

export { SelectedContext, BoardContext }


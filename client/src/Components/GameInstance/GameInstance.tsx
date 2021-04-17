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

    public setSelected = (toSelect: any) => {
        this.setState({
            selected: toSelect
        }, () => {
            console.log("cb after setting seletted", this.state.selected)
        })
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


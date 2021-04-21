import React from 'react'
import { Board } from '../../Classes/Board';
import { Player } from '../../Classes/Player';
import { ChessBoard } from '../ChessBoard/ChessBoard';
import { highlightMovesSquares } from '../../HelperFunctions/highlightFunctions';
import { PlayAudio } from '../../PlayAudio';

const socket = require('../../SocketConnection/Socket').socket;

const SelectedContext: any = React.createContext<any>(null)
const BoardContext: any = React.createContext(null)
const PlayerContext: any = React.createContext(null);

interface PassedProps {
    match: any
}

export class GameInstance extends React.Component<PassedProps> {

    state: GameState = {
        lobbyId: this.props.match.params.lobbyId,
        board: new Board(),
        selected: null,
        player: null
    }

    componentDidMount() {
        socket.emit("joinedLobby", this.state.lobbyId);
        socket.on("getMatchData", (payload: { oppoId: string, color: string }) => {
            this.setState({ player: new Player(payload.color, payload.oppoId) });
        });
        socket.on("recieveMove", (data: any) => {
            this.setBoard(this.state.board.updateTheBoard(JSON.parse(data)));
        });
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
        const player = this.state.player

        return (
            <>
                <BoardContext.Provider value={{ board, setBoard }}>
                    <SelectedContext.Provider value={{ selected, setSelected }}>
                        <PlayerContext.Provider value={{ player }}>
                            <ChessBoard />
                        </PlayerContext.Provider>
                    </SelectedContext.Provider>
                </BoardContext.Provider>

                <PlayAudio />
            </>
        )
    }
}

export { SelectedContext, BoardContext, PlayerContext }


import React from 'react'
import { Board } from '../../Classes/Board';
import { Player } from '../../Classes/Player';
import { Game } from '../../Classes/Game';
import { ChessBoard } from '../ChessBoard/ChessBoard';
import { highlightMovesSquares } from '../../HelperFunctions/highlightFunctions';
import { PlayAudio } from '../../PlayAudio';
import { simulateGameOverSound } from '../../HelperFunctions/triggerAudio';
const socket = require('../../SocketConnection/Socket').socket;

const SelectedContext: any = React.createContext(null);
const BoardContext: any = React.createContext(null);
const PlayerContext: any = React.createContext(null);
const GameContext: any = React.createContext(null);

interface PassedProps {
    match: any;
};

export class GameInstance extends React.Component<PassedProps> {

    state: GameState = {
        lobbyId: this.props.match.params.lobbyId,
        board: new Board(),
        selected: null,
        player: null,
        game: null
    }

    componentDidMount() {
        socket.emit("joinedLobby", this.state.lobbyId);
        socket.on("getMatchData", (payload: { oppoId: string, color: string }) => {
            this.setState({ player: new Player(payload.color, payload.oppoId), game: new Game() });

        });
        socket.on("recieveMove", (data: any) => {
            let newBoard = this.state.board.updateTheBoard(JSON.parse(data));
            this.setBoard(newBoard)
            let playerCopy = this.state.player;
            playerCopy.yourTurn = true;
            this.setState({ player: playerCopy });
            this.runRecieveMoveChecks(newBoard)
        });
        socket.on("youWon", () => {
            let gameCopy = this.state.game;
            gameCopy.gameOver = true;
            gameCopy.winner = true;
            this.setState({ game: gameCopy })
        })
    }

    public runRecieveMoveChecks = (newBoard: any) => {
        const king = this.state.player.getKingsPos();
        const amIChecked = this.state.board.board[king.coords.y][king.coords.x].checkForKingInCheck(this.state.player.kingsPos, newBoard);
        const hasLegalMoves: boolean = this.checkForMate();
        // if we are checked we need to check if it is checkmate
        if (amIChecked) {
            this.state.player.setCheckStatus(true);
            if (hasLegalMoves) { // it is checkmate
                simulateGameOverSound();
                let gameCopy = this.state.game;
                gameCopy.gameOver = true;
                gameCopy.winner = false;
                this.setState({ game: gameCopy });
                socket.emit("lostTheMatch", this.state.player.oppoId)
                return;
            };
            document.getElementsByClassName(`node ${king.coords.y}-${king.coords.x}`)[0].className += " checked"
        } else { // if we are not in check we need to check if it is stalemate
            if (hasLegalMoves) {
                return
            }
        }
    }
    // scans the board for pieces of your color and checks if they have any legal moves left
    private checkForMate = () => {
        let hasLegalMoves: boolean = true;
        for (let i: number = 0; i < 8; i++) {
            for (let j: number = 0; j < 8; j++) {
                let curr = this.state.board.board[i][j]
                if (curr.getColor() === this.state.player.color) {
                    let data = curr.getPiecesMoves(this.state.board, this.state.player.getKingsPos());
                    if (data.length > 0) {
                        hasLegalMoves = false;
                        break;
                    }
                }
            }
        }
        return hasLegalMoves
    }

    public setSelected = (toSelect: any) => {
        if (toSelect === null || toSelect.data === null || !this.state.player.yourTurn) {
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

    public setPlayer = (updatedPlayer: any) => {
        this.setState({
            player: updatedPlayer
        })
    }

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
        const player = this.state.player;
        const { setPlayer } = this;
        const game = this.state.game;

        return (
            <>
                <BoardContext.Provider value={{ board, setBoard }}>
                    <SelectedContext.Provider value={{ selected, setSelected }}>
                        <PlayerContext.Provider value={{ player, setPlayer }}>
                            <GameContext.Provider value={{ game }}>
                                <ChessBoard />
                            </GameContext.Provider>
                        </PlayerContext.Provider>
                    </SelectedContext.Provider>
                </BoardContext.Provider>

                <PlayAudio />
            </>
        )
    }
}

export { SelectedContext, BoardContext, PlayerContext, GameContext }


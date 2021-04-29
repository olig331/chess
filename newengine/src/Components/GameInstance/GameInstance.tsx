import React from 'react';
import { ChessBoard } from '../ChessBoard/ChessBoard';
import { Audio } from '../Audio/Audio'
import { simulateStartSound } from '../../HelperFunctions/triggerAudio';
import { checkForCheck } from './GameFunctions/checkForCheck';
const socket = require('../../SocketConnection/Socket').socket;

interface passedProps {
    history: any;
    match: any
}

const initBoard: { [key: string]: string } = {
    "a8": "r", "b8": "n", "c8": "b", "d8": "q", "e8": "k", "f8": "b", "g8": "n", "h8": "r",
    "a7": "p", "b7": "p", "c7": "p", "d7": "p", "e7": "p", "f7": "p", "g7": "p", "h7": "p",
    "a6": "", "b6": "", "c6": "", "d6": "", "e6": "", "f6": "", "g6": "", "h6": "",
    "a5": "", "b5": "", "c5": "", "d5": "", "e5": "", "f5": "", "g5": "", "h5": "",
    "a4": "", "b4": "", "c4": "", "d4": "", "e4": "", "f4": "", "g4": "", "h4": "",
    "a3": "", "b3": "", "c3": "", "d3": "", "e3": "", "f3": "", "g3": "", "h3": "",
    "a2": "P", "b2": "P", "c2": "", "d2": "", "e2": "", "f2": "P", "g2": "P", "h2": "P",
    "a1": "R", "b1": "N", "c1": "B", "d1": "Q", "e1": "K", "f1": "B", "g1": "N", "h1": "R"
};

const FallenPiecesContext: any = React.createContext({});
const TurnContext: any = React.createContext(null);

export class GameInstance extends React.Component<passedProps> {

    state: GameState = {
        lobbyId: this.props.match.params.lobbyId,
        oppoId: "",
        color: "",
        board: initBoard,
        castleSwapStatus: { "qside": true, "kside": true },
        fallenPieces: { "white": [], "black": [] },
        yourTurn: true
    }

    componentDidMount() {
        socket.emit("joinedLobby", this.state.lobbyId);
        socket.on("getMatchSetUpData", (payload: { oppoId: string, color: string }) => {
            const turn: boolean = payload.color === "white"
            this.setState({ oppoId: payload.oppoId, color: payload.color, yourTurn: turn });
            simulateStartSound();
        });
        socket.on("recieveMove", (newBoard: any) => {
            this.setState({ board: JSON.parse(newBoard) });
            this.setTurn(true)
            this.handleRecieveMove()
        });
    }

    public handleRecieveMove = () => {
        const amIChecked = checkForCheck(this.state.board, this.state.color);

        if (amIChecked) {
            const kingTag = this.state.color === "white" ? "K" : "k"
            let pos = Object.keys(this.state.board).filter((key: string) => this.state.board[key] === kingTag);
            document.getElementsByClassName(`node ${pos[0]}`)[0].className = `node ${pos[0]} checked`
            // check for checkmate
        } else {
            // check for stalemate
        }
    }

    public setFallenPieces = (piece: string) => {
        let fallenPiecesCopy = { ...this.state.fallenPieces }
        if (piece.charCodeAt(0) < 91) {
            fallenPiecesCopy.white.push(piece);
        } else {
            fallenPiecesCopy.black.push(piece);
        }
        this.setState({
            fallenPieces: fallenPiecesCopy
        });
    };

    public setTurn = (status: boolean) => {
        this.setState({ yourTurn: status })
    }

    render() {
        const fallenPieces = this.state.fallenPieces;
        const { setFallenPieces } = this;
        const yourTurn = this.state.yourTurn;
        const { setTurn } = this;
        return (
            <>
                <FallenPiecesContext.Provider value={{ fallenPieces, setFallenPieces }}>
                    <TurnContext.Provider value={{ yourTurn, setTurn }}>
                        <ChessBoard
                            board={this.state.board}
                            oppoId={this.state.oppoId}
                            castleSwapStatus={this.state.castleSwapStatus}
                            color={this.state.color}
                        />
                    </TurnContext.Provider>
                </FallenPiecesContext.Provider>
                <Audio />
                <button onClick={() => console.log(this.state.fallenPieces)}>Log Fallen Pieces</button>
            </>
        )
    }
}

export { FallenPiecesContext, TurnContext }
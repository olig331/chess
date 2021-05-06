import React from 'react';
import { ChessBoard } from '../ChessBoard/ChessBoard';
import { Audio } from '../Audio/Audio'
import { simulateStartSound, simulateMoveSound, simulateGameOverSound, simulateTakeSound } from '../../HelperFunctions/triggerAudio';
import { checkForCheck } from './GameFunctions/checkForCheck';
import { PawnUpgrade } from './PawnUpgrade';
import { getLegalMoves } from './GameFunctions/getLegalMoves';
import { initBoard } from './initialBoard'
import { GameOver } from '../GameOver/GameOver';
import { GameInfo } from '../GameInfo/GameInfo';

const socket = require('../../SocketConnection/Socket').socket;



const FallenPiecesContext: any = React.createContext({});
const TurnContext: any = React.createContext(null);
const BoardContext: any = React.createContext(null);
const EnpassantContext: any = React.createContext(null);

export class GameInstance extends React.Component {

    state: GameState = {
        oppoId: "",
        color: "",
        board: initBoard,
        castleSwapStatus: { "qside": true, "kside": true },
        fallenPieces: { "white": [], "black": [] },
        yourTurn: true,
        enpassant: "",
        upgrade: false,
        upgradeData: "",
        yourPieces: [],
        gameOver: false,
        gameOverMessage: "",
    }

    componentDidMount() {
        socket.on("getMatchSetUpData", (payload: SetUpData): void => {
            const turn: boolean = payload.color === "white";
            const pieces: string[] = this.getStartingPieces(payload.color)
            this.setState({
                oppoId: payload.oppoId,
                color: payload.color,
                yourTurn: turn,
                yourPieces: pieces
            });
            simulateStartSound();
        });
        socket.on("recieveMove", (payload: string): void => {
            const data: MovePayload = JSON.parse(payload);
            this.updatePiecesOnReciveMove(data.taking)
            this.setBoard(data.newBoard);
            this.setEnpassant(data.enpassant)
            this.setTurn(true)
            this.handleRecieveMove()
            if (data.taking.piece) {
                simulateTakeSound()
            }
            simulateMoveSound();
        });
        socket.on("stalemate", (): void => {
            this.setState({ gameOver: true, gameOverMessage: "Match Drawn!!" });
            simulateGameOverSound()
        })
        socket.on("wonGame", (): void => {
            this.setState({ gameOver: true, gameOverMessage: "Match Won" });
            simulateGameOverSound()
        });

    };

    public updatePiecesOnReciveMove = (taking: Taking): void => {
        if (taking.piece) {
            let copy = [...this.state.yourPieces];
            const index: number = copy.indexOf(taking.pos);
            copy.splice(index, 1);
            this.setState({ yourPieces: copy })
            this.setFallenPieces(taking)
        }
        return;
    }

    public updatePieces = (move: MoveArr): void => {
        let piecesCopy: string[] = [...this.state.yourPieces]
        move.effects.forEach((effect: Effects) => {
            if (effect.piece) {
                piecesCopy.push(effect.pos);
            } else {
                const index: number = piecesCopy.indexOf(effect.pos);
                piecesCopy.splice(index, 1)
            }
        });
        this.setState({ yourPieces: piecesCopy })
    }

    public getStartingPieces = (color: string): string[] => {
        const boardKeys: string[] = Object.keys(initBoard);
        if (color === "white") {
            return boardKeys.slice(48, 64)
        }
        return boardKeys.slice(0, 16);
    };

    public handleRecieveMove = (): void => {
        const amIChecked: boolean = checkForCheck(this.state.board, this.state.color);
        const isMate: boolean = this.checkForMate()
        if (amIChecked) {
            const kingTag: string = this.state.color === "white" ? "K" : "k"
            let pos: string[] = Object.keys(this.state.board).filter((key: string) => this.state.board[key] === kingTag);
            document.getElementsByClassName(`node ${pos[0]}`)[0].className = `node ${pos[0]} checked`
            if (isMate) {
                socket.emit("lostGame", this.state.oppoId)
                this.setState({ gameOver: true, gameOverMessage: "Match Lost!!" })
                simulateGameOverSound()
            }
        } else {
            // check for stalemate
            if (isMate) {
                socket.emit("drawnGame", this.state.oppoId);
                this.setState({ gameOver: true, gameOverMessage: "Match Drawn!!" })
            }
            return;
        }
    }

    public checkForMate = (): boolean => {
        const keys: Keys = Object.keys(this.state.board);
        for (let i: number = 0; i < this.state.yourPieces.length; i++) {
            let curr: string = this.state.yourPieces[i];
            let moves: MoveArr[] = getLegalMoves(this.state.board[curr], keys, this.state.board, keys.indexOf(`${curr}`), this.state.castleSwapStatus, this.state.enpassant);
            if (moves.length > 0) {
                return false;
            }
            continue;
        }
        return true;
    }

    public setFallenPieces = (taking: Taking): void => {
        let fallenPiecesCopy: FallenPieces = { ...this.state.fallenPieces };
        if (taking.piece && taking.piece.charCodeAt(0) < 91) {
            fallenPiecesCopy.white.push(taking.piece);
        } else {
            if (taking.piece) {
                fallenPiecesCopy.black.push(taking.piece);
            }
        }
        this.setState({ fallenPieces: fallenPiecesCopy });
        return;
    };

    public setTurn = (status: boolean): void => {
        this.setState({ yourTurn: status });
    }

    public setEnpassant = (square: string): void => {
        this.setState({ enpassant: square });
    }

    public setBoard = (newBoard: Board): void => {
        this.setState({ board: newBoard });
    }

    public selectUpgradePiece = (piece: string): void => {
        let i: number,
            copy: Board = { ...this.state.board },
            data: MoveArr = this.state.upgradeData;
        data.effects[0].piece = piece
        for (i = 0; i < data.effects.length; i++) {
            let curr: Effects = data.effects[i];
            copy[curr.pos] = curr.piece;
        };
        this.setFallenPieces(data.taking);
        this.setState({ board: copy, upgrade: false, upgradeData: "", moves: [], yourTurn: false });
        simulateMoveSound()
        socket.emit("sendMove", JSON.stringify({ oppoId: this.state.oppoId, data: copy, enpassant: "" }));
        return
    }

    public setUpgrade = (val: boolean, move: MoveArr): void => {
        this.updatePieces(move);
        this.setState({ upgrade: val, upgradeData: move });
    }

    render() {
        const fallenPieces = this.state.fallenPieces;
        const { setFallenPieces } = this;
        const yourTurn = this.state.yourTurn;
        const { setTurn } = this;
        const { setBoard } = this;
        const board = this.state.board
        const enpassant = this.state.enpassant;
        const { setEnpassant } = this;
        return (
            <div style={this.state.gameOver ? { pointerEvents: "none" } : { pointerEvents: "all" }} className="game_instance_container">
                <GameOver
                    gameOver={this.state.gameOver}
                    gameOverMessage={this.state.gameOverMessage}
                />
                <FallenPiecesContext.Provider value={{ fallenPieces, setFallenPieces }}>
                    <TurnContext.Provider value={{ yourTurn, setTurn }}>
                        <BoardContext.Provider value={{ board, setBoard }}>
                            <EnpassantContext.Provider value={{ enpassant, setEnpassant }}>
                                <ChessBoard
                                    oppoId={this.state.oppoId}
                                    castleSwapStatus={this.state.castleSwapStatus}
                                    color={this.state.color}
                                    setUpgrade={this.setUpgrade}
                                    updatePieces={this.updatePieces}
                                />
                            </EnpassantContext.Provider>
                        </BoardContext.Provider>
                    </TurnContext.Provider>
                </FallenPiecesContext.Provider>

                <Audio />
                <PawnUpgrade
                    selectUpgradePiece={this.selectUpgradePiece}
                    color={this.state.color}
                    showUpgrade={this.state.upgrade}
                />
                <GameInfo
                    oppoId={this.state.oppoId}
                    color={this.state.color}
                    fallenPieces={this.state.fallenPieces}
                />
            </div>
        )
    }
}

export { FallenPiecesContext, TurnContext, BoardContext, EnpassantContext }
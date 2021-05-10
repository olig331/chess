import React from 'react';
import { ChessBoard } from '../ChessBoard/ChessBoard';
import { Audio } from '../Audio/Audio'
import { simulateMoveSound, simulateGameOverSound, simulateTakeSound } from '../../HelperFunctions/triggerAudio';
import { checkForCheck } from './GameFunctions/checkForCheck';
import { PawnUpgrade } from './PawnUpgrade';
import { getLegalMoves } from './GameFunctions/getLegalMoves';
import { initBoard } from './initialBoard'
import { FallenPiecesContext } from '../../Context/Context';
import { BoardTint } from './BoardTint';

const socket = require('../../SocketConnection/Socket').socket;

const TurnContext: any = React.createContext(null);
const BoardContext: any = React.createContext(null);
const EnpassantContext: any = React.createContext(null);

interface Props {
    color: string;
    oppoId: string;
    boardWidthHeight: number;
    gameOver: boolean;
    settingGameOver: (status: boolean, message: string) => void;
}

export class GameInstance extends React.Component<Props> {
    static contextType = FallenPiecesContext

    state: GameState = {
        board: initBoard,
        castleSwapStatus: { "qside": true, "kside": true },
        yourTurn: true,
        enpassant: "",
        upgrade: false,
        upgradeData: "",
        yourPieces: [],
    }

    componentDidMount() {
        const turn: boolean = this.props.color === "white";
        const pieces: string[] = this.getStartingPieces(this.props.color);
        this.setState({ yourTurn: turn, yourPieces: pieces });

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
    };

    public updatePiecesOnReciveMove = (taking: Taking): void => {
        if (taking.piece) {
            let copy = [...this.state.yourPieces];
            const index: number = copy.indexOf(taking.pos);
            copy.splice(index, 1);
            this.setState({ yourPieces: copy })
            this.updateFallenPieces(taking)
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
        const amIChecked: boolean = checkForCheck(this.state.board, this.props.color);
        const isMate: boolean = this.checkForMate()
        if (amIChecked) {
            const kingTag: string = this.props.color === "white" ? "K" : "k"
            let pos: string[] = Object.keys(this.state.board).filter((key: string) => this.state.board[key] === kingTag);
            document.getElementsByClassName(`node ${pos[0]}`)[0].className = `node ${pos[0]} checked`
            if (isMate) {
                socket.emit("lostGame", this.props.oppoId)
                this.props.settingGameOver(true, "You Lost!");
                simulateGameOverSound()
            }
        } else {
            // check for stalemate
            if (isMate) {
                socket.emit("drawnGame", this.props.oppoId);
                this.props.settingGameOver(true, "Stalemate!");
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

    public updateFallenPieces = (taking: Taking): void => {
        let fallenPiecesCopy: FallenPieces = { ...this.context.fallenPieces };
        console.log("vairable", fallenPiecesCopy)
        if (taking.piece && taking.piece.charCodeAt(0) < 91) {
            fallenPiecesCopy.white.push(taking.piece);
        } else {
            if (taking.piece) {
                fallenPiecesCopy.black.push(taking.piece);
            }
        }
        console.log("copy in update fallen pieces", fallenPiecesCopy);
        this.context.setFallenPieces(fallenPiecesCopy)
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
        this.updateFallenPieces(data.taking);
        this.setState({ board: copy, upgrade: false, upgradeData: "", moves: [], yourTurn: false });
        simulateMoveSound()
        socket.emit("sendMove", JSON.stringify({ oppoId: this.props.oppoId, data: copy, enpassant: "" }));
        return
    }

    public setUpgrade = (val: boolean, move: MoveArr): void => {
        this.updatePieces(move);
        this.setState({ upgrade: val, upgradeData: move });
    }

    public changeCastleStatus = (updates: string[]): void => {
        let castleCopy: CastleStatus = { ...this.state.castleSwapStatus }
        updates.forEach((key: string) => {
            castleCopy[`${key}`] = false
        })
        this.setState({ castleSwapStatus: castleCopy })
        return;
    };

    render() {
        const yourTurn = this.state.yourTurn;
        const { setTurn } = this;
        const { setBoard } = this;
        const board = this.state.board
        const enpassant = this.state.enpassant;
        const { setEnpassant } = this;
        return (
            <div className="game_instance_container"
                style={this.props.gameOver ? { pointerEvents: "none" } : { pointerEvents: "all" }}>
                <BoardTint boardWidthHeight={this.props.boardWidthHeight} gameOver={this.props.gameOver} />
                <TurnContext.Provider value={{ yourTurn, setTurn }}>
                    <BoardContext.Provider value={{ board, setBoard }}>
                        <EnpassantContext.Provider value={{ enpassant, setEnpassant }}>
                            <ChessBoard
                                oppoId={this.props.oppoId}
                                castleSwapStatus={this.state.castleSwapStatus}
                                color={this.props.color}
                                setUpgrade={this.setUpgrade}
                                updatePieces={this.updatePieces}
                                updateFallenPieces={this.updateFallenPieces}
                                boardWidthHeight={this.props.boardWidthHeight}
                                changeCastleStatus={this.changeCastleStatus}
                            />
                        </EnpassantContext.Provider>
                    </BoardContext.Provider>
                </TurnContext.Provider>
                <Audio />
                <PawnUpgrade
                    selectUpgradePiece={this.selectUpgradePiece}
                    color={this.props.color}
                    showUpgrade={this.state.upgrade}
                />
            </div>
        )
    }
}

export { TurnContext, BoardContext, EnpassantContext }
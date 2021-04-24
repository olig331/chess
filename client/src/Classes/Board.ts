import { getClass } from "../HelperFunctions/getClass";
import { Node } from "./Node";
import { getTag } from "../HelperFunctions/getTag";
const socket = require("../SocketConnection/Socket").socket;

export class Board {
    public board: Node[][];
    private static startingPositions: string =
        "rnbqkbnrpppppppp................................PPPPPPPPRNBQKBNR";
    public enPassant: null | coords;
    public moveHistory: string[];
    constructor() {
        this.board = this.initBoard();
        this.moveHistory = [Board.startingPositions];
        this.enPassant = null;
    }

    public initBoard = () => {
        let result: any[][] = [],
            row: number,
            col: number;

        for (row = 0; row < 8; row++) {
            result.push([]);
            for (col = 0; col < 8; col++) {
                result[row].push(
                    new Node(
                        row,
                        col,
                        getClass(Board.startingPositions[row * 8 + col])
                    )
                );
            }
        }
        return result;
    };

    //prettier-ignore
    public applyMove = (selected:any, newPos:any, oppoId:string):{board:Node[][], takingTag:string} | false => {
        let i:number;
        for(i = 0; i < selected.data.moves.length; i++){
            let curr:coords = selected.data.moves[i].move,
                to:coords = newPos.getCoords();
            if(JSON.stringify(curr) === JSON.stringify(to)){ // if the coords in possible moves match the new sqaure allow it
                socket.emit("sendMove", JSON.stringify({toId:oppoId, data:selected.data.moves[i]}));
                return {
                    takingTag: selected.data.moves[i].taking,
                    board: this.updateTheBoard(selected.data.moves[i])
                };
            };
        };
        return false;
    };

    public updateTheBoard = (update: legalMovesResult): any => {
        if (this.enPassant) {
            this.board[this.enPassant.y][
                this.enPassant.x
            ].data.openForEnPassant = false;
            this.enPassant = null;
        }
        let i: number;
        for (i = 0; i < update.effects.length; i++) {
            let curr: effectInstance = update.effects[i],
                name: string = curr.new ? curr.new.name : ".",
                color: string = curr.new ? curr.new.color : "";
            //prettier-ignore
            this.board[update.effects[i].coords.y][update.effects[i].coords.x]
                .data = getClass(getTag(name, color));
            if (curr.newProps) {
                for (var prop in curr.newProps) {
                    let sq = this.board[curr.coords.y][curr.coords.x];
                    sq.data[prop] = curr.newProps[prop];
                    if (prop === "openForEnPassant") {
                        this.enPassant = curr.coords;
                    }
                }
            }
        }
        return this.board;
    };

    public getDeepCopy = () => {
        return JSON.parse(JSON.stringify(this.board));
    };

    public genStringBoardAddToHistory = (): void => {
        let result: string[] = [];

        //prettier-ignore
        this.board.forEach((row: Node[]) => {
            row.forEach((col: Node) => {
                let val:string = (col.getRelativeTag(col.getName(), col.getColor()));
                if(!val){
                    result.push(".")
                } else {
                    result.push(val)
                }
            });
        });
        this.moveHistory.push(result.join(""));
        return;
    };
}

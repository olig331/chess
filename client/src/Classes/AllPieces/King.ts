import { Piece } from "../Piece";

export class King extends Piece {
    public color: string;
    public vectors: vectorsArr;
    public renderImage: any;
    public hasNeverMoved: boolean;
    public name: string;
    constructor(color: string, vectors: vectorsArr, renderImage: any) {
        super();
        this.color = color;
        this.vectors = vectors;
        this.renderImage = renderImage;
        this.hasNeverMoved = true;
        this.name = this.getName();
    }

    //prettier-ignore
    public getLegalMoves = (coords: coords, board: any[][], inCheck?:boolean): legalMovesResult[] => {
        let i: number,
            result: legalMovesResult[] = [];

        for (i = 0; i < this.vectors.length; i++) {
            let y: number = coords.y + this.vectors[i].y,
                x: number = coords.x + this.vectors[i].x;

            if (this.inRange(y) && this.inRange(x)) {
                const newSq = board[y][x];

                if (newSq.getColor() === this.color) {
                    continue;
                } else {
                    result.push({
                        move:{y:y, x:x},
                        effects: [
                            {coords:{y:y, x:x}, new:this.serialise(this), newProps:null},
                            {coords:{y:coords.y, x:coords.x}, new:null, newProps:null}
                        ],
                        taking: board[y][x].getName()
                    });
                }
            }
        }
        if (!inCheck) {
            const castleSwap = this.canCastleSwap(coords, board);
            console.log("castle result", castleSwap);
            if (castleSwap.qside) {
                result.push({
                    move:{ y: coords.y, x: 2 }, 
                    effects: [
                        {coords:{y:coords.y, x:2}, new:this.serialise(this), newProps:null},
                        {coords:{y:coords.y, x:4}, new:null, newProps:null},
                        {coords:{y:coords.y, x:3}, new:board[coords.y][7].data, newProps:null},
                        {coords:{y:coords.y, x:0}, new:null,newProps:null},
                    ],
                    taking:""
                });
            }
            if (castleSwap.kside) {
                result.push({
                    move:{ y: coords.y, x: 6 }, 
                    effects: [
                        {coords:{y:coords.y, x:6}, new:this.serialise(this), newProps:{neverMoved:false}},
                        {coords:{y:coords.y, x:4}, new:null, newProps:null},
                        {coords:{y:coords.y, x:5}, new:board[coords.y][7].data, newProps:{neverMoved:false}},
                        {coords:{y:coords.y, x:7}, new:null, newProps:null}
                    ],
                    taking:""
                });
            }
        }
        this.moves = result;
        return result;
    };

    //prettier-ignore
    public canCastleSwap = (coords:coords, board: any[][]): castleSwapResult => { // prettier-ignore
        let result: castleSwapResult = { qside: false, kside: false };
        // King side
        if(this.hasNeverMoved && board[coords.y][7].getName() === "rook" ){
            if(board[coords.y][7].data.hasNeverMoved){
                if(!board[coords.y][5].data && !board[coords.y][6].data){
                    result.kside = true;
                }
            }
        }
        //prettier-ignore
        if(this.hasNeverMoved && board[coords.y][0].getName() === "rook" ){
            if(board[coords.y][0].data.hasNeverMoved){
                if(!board[coords.y][2].data && !board[coords.y][3].data && !board[coords.y][1].data){
                    result.qside = true;
                }
            }
        }
        return result;
    };

    public getName = (): string => {
        return "king";
    };
}

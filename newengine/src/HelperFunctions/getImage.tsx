import br from '../Assets/pieces/br.png';
import bn from "../Assets/pieces/bn.png";
import bb from "../Assets/pieces/bb.png";
import bq from "../Assets/pieces/bq.png";
import bk from "../Assets/pieces/bk.png";
import bp from "../Assets/pieces/bpnew.png";
import wr from "../Assets/pieces/wr.png";
import wn from "../Assets/pieces/wn.png";
import wb from "../Assets/pieces/wb.png";
import wq from "../Assets/pieces/wq.png";
import wk from "../Assets/pieces/wk.png";
import wp from "../Assets/pieces/wpnew.png";

export const getImage = (tag: any): any => {
    switch (tag) {
        case "p":
            return <img className="piece_img" src={bp} alt="" />
        case "r":
            return <img className="piece_img" src={br} alt="" />;
        case "n":
            return <img className="piece_img" src={bn} alt="" />;
        case "b":
            return <img className="piece_img" src={bb} alt="" />;
        case "q":
            return <img className="piece_img" src={bq} alt="" />;
        case "k":
            return <img className="piece_img" src={bk} alt="" />;
        case "R":
            return <img className="piece_img" src={wr} alt="" />;
        case "B":
            return <img className="piece_img" src={wb} alt="" />;
        case "N":
            return <img className="piece_img" src={wn} alt="" />;
        case "P":
            return <img className="piece_img" src={wp} alt="" />;
        case "Q":
            return <img className="piece_img" src={wq} alt="" />;
        case "K":
            return <img className="piece_img" src={wk} alt="" />;
        default:
            return;
    }
};
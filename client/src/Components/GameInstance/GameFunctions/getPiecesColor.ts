export const getPieceColor = (piece: string) => {
    if (piece) {
        if (piece.charCodeAt(0) < 91) {
            return "white";
        } else {
            return "black";
        }
    }
    return;
};

export const getSqaureColor = (index: number) => {
    let row = Math.ceil(index / 8);
    if (row % 2) {
        if (index % 2) {
            return lightSqare;
        }
        return darkSqaure;
    } else {
        if (index % 2) {
            return darkSqaure;
        }
        return lightSqare;
    }
};

const darkSqaure = `radial-gradient(
    circle,
    rgba(78, 90, 101, 1) 0%,
    rgba(65, 75, 84, 1) 100%
)`;

// Color of the lighter board sqaures
const lightSqare = `radial-gradient(
    circle,
    rgba(111, 128, 144, 1) 0%,
    rgba(100, 115, 129, 1) 100%
)`;

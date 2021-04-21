export const highlightMovesSquares = (moves: legalMovesResult[]) => {
    console.log(moves);
    moves &&
        moves.map((move: legalMovesResult) => {
            return (document.getElementsByClassName(
                `node ${move.move.y}-${move.move.x}`
            )[0].className = `node ${move.move.y}-${move.move.x} highlight`);
        });
};

export const removeHighlights = () => {
    document.querySelectorAll(".highlight").forEach((ele: any) => {
        let newClass: string = ele.className.replace(/\shighlight/, "");
        return (ele.className = newClass);
    });
};

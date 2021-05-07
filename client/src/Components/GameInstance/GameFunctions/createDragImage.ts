export const createDragImage = (e: any, size: number) => {
    var crt = e.target.cloneNode(true);
    crt.style.background = "none";
    crt.style.position = "absolute";
    crt.style.top = "0px";
    crt.style.right = "0px";
    crt.style.width = `${(size / 100) * 75}px`;
    crt.style.height = `${(size / 100) * 75}px`;
    crt.style.transform = "rotate(0deg)";
    crt.style.zIndex = "-1";
    document.body.appendChild(crt);
    //prettier-ignore
    e.dataTransfer.setDragImage(crt, (size / 2), (size / 2));
};

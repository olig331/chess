export const createDragImage = (e: any) => {
    var crt = e.target.cloneNode(true);
    crt.style.background = "none";
    crt.style.position = "absolute";
    crt.style.top = "0px";
    crt.style.right = "0px";
    crt.style.width = "85px";
    crt.style.height = "85px";
    crt.style.transform = "rotate(0deg)";
    crt.style.zIndex = "-1";
    document.body.appendChild(crt);
    e.dataTransfer.setDragImage(crt, 45, 50);
};

export const removeHighlights = () => {
    document.querySelectorAll(".highlight").forEach((ele: any) => {
        let newClass: string = ele.className.replace(/\shighlight/, "");
        return (ele.className = newClass);
    });
    document.querySelectorAll(".checked").forEach((ele: any) => {
        let newClass: string = ele.className.replace(/\schecked/, "");
        return (ele.className = newClass);
    });
};

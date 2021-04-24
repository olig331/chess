export const getTag = (name: string, color?: string) => {
    if (name) {
        let char: string;
        // knight and king share the same first char so just determining which piece we have here
        name === "knight" ? (char = "n") : (char = name[0]);

        return color && color === "white" ? char.toUpperCase() : char;
    }
    return "";
};

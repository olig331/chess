export const getVectors = (tag: string, color?: string): any => {
    switch (tag) {
        case "p":
            switch (color) {
                case "white": return [{ y: -1, x: 0 }, { y: -1, x: -1 }, { y: -1, x: 1 }]
                case "black": return [{ y: 1, x: 0 }, { y: 1, x: -1 }, { y: 1, x: 1 }]
            }
            break;
        case "r":
            return [{ y: 0, x: -1 }, { y: 0, x: 1 }, { y: 1, x: 0 }, { y: -1, x: 0 }];

        case "b":
            return [{ y: -1, x: -1 }, { y: -1, x: 1 }, { y: 1, x: -1 }, { y: 1, x: 1 }];

        case "q":
            return [{ y: -1, x: -1 },
            { y: 1, x: -1 },
            { y: -1, x: 1 },
            { y: 1, x: 1 },
            { y: 1, x: 0 },
            { y: -1, x: 0 },
            { y: 0, x: 1 },
            { y: 0, x: -1 },]

        case "k":
            return [
                { y: -1, x: -1 },
                { y: -1, x: 1 },
                { y: 1, x: -1 },
                { y: 1, x: 1 },
                { y: 1, x: 0 },
                { y: -1, x: 0 },
                { y: 0, x: 1 },
                { y: 0, x: -1 },];

        case "n":
            return [{ y: -1, x: -2 },
            { y: -1, x: 2 },
            { y: 1, x: -2 },
            { y: 1, x: 2 },
            { y: -2, x: -1 },
            { y: -2, x: 1 },
            { y: 2, x: -1 },
            { y: 2, x: 1 },]

        default:
            break;
    }
}
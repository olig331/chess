type GameState = {
    lobbyId: string;
    oppoId: string;
    color: string;
    board: { [key: string]: string };
};

type Board = { [key: string]: string };
type Keys = string[];

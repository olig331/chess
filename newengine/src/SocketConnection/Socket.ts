import io from "socket.io-client";

const URL = "http://localhost:3002";

const socket = io(URL);

export { socket };

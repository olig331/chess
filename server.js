require('dotenv');
const express = require('express')
const app = express()
const server = require('http').createServer(app);
const path = require('path')
const cors = require('cors');
const { isFunction } = require('util');
const PORT = process.env.PORT || 3002;
const io = require('socket.io')(server, {
    cors: {
        path: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

let lobbys = {};
let otherColor = { "white": "black", "black": "white" };
let colors = ["white", "black"];
let lobbyFromSocketId = {}

io.on("connection", socket => {
    socket.on("joinedLobby", lobbyId => {
        if (lobbys[lobbyId]) {
            const length = lobbys[lobbyId].length;
            if (length === 2) {
                socket.emit("lobbyIsFull")
                return;
            }

            let host = lobbys[lobbyId][0];
            lobbys[lobbyId].push({ id: socket.id, color: otherColor[host.color] });
            lobbyFromSocketId[socket.id] = lobbyId;
            io.to(socket.id).emit("getMatchData", { oppoId: host.id, color: otherColor[host.color] });
            io.to(host.id).emit("getMatchData", { oppoId: socket.id, color: host.color })
        } else {
            let myColor = colors[Math.round(Math.random())];
            lobbys[lobbyId] = [{ id: socket.id, color: myColor }];
            lobbyFromSocketId[socket.id] = lobbyId
        }
    })

    socket.on("sendMove", payload => {
        const parsedData = JSON.parse(payload)
        io.to(parsedData.toId).emit("recieveMove", JSON.stringify(parsedData.data));
    });

    socket.on("lostTheMatch", id => {
        io.to(id).emit("youWon")
    })
})


server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
require('dotenv');
const express = require('express')
const app = express()
const server = require('http').createServer(app);
const path = require('path')
const cors = require('cors')
const PORT = process.env.PORT || 3002;
const io = require('socket.io')(server, {
    cors: {
        path: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

io.on("connection", socket => {
    console.log(socket, socket.id)
})


server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
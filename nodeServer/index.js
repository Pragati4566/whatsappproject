const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 8000;

// ⭐ FIXED PATH
app.use(express.static(path.join(__dirname, "../public")));

const users = {};

io.on("connection", socket => {

    socket.on("user-joined", name => {
        users[socket.id] = name;
        socket.broadcast.emit("user-joined", name);
    });

    socket.on("send", message => {
        socket.broadcast.emit("receive", {
            message,
            name: users[socket.id]
        });
    });

    socket.on("disconnect", () => {
        if(users[socket.id]){
            socket.broadcast.emit("left", users[socket.id]);
            delete users[socket.id];
        }
    });

});

server.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
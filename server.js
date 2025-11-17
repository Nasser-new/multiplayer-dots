const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

const players = {}; // { socketId: { x, y, color } }

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // Create a new player with random position and color
  players[socket.id] = {
    x: Math.random() * 800,
    y: Math.random() * 600,
    color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")
  };

  // Send current players to the new player
  socket.emit("currentPlayers", players);

  // Tell others about the new player
  socket.broadcast.emit("newPlayer", { id: socket.id, data: players[socket.id] });

  // Listen for movement updates from this player
  socket.on("playerMove", (data) => {
    if (!players[socket.id]) return;
    players[socket.id].x = data.x;
    players[socket.id].y = data.y;

    // Broadcast updated position to everyone
    io.emit("playerMoved", { id: socket.id, data: players[socket.id] });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete players[socket.id];
    io.emit("playerDisconnected", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});

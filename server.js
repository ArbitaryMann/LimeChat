const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server);

const bannedWords = ["fuck", "badword2", "badword3"];

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("message", (message) => {
    console.log("Message received: " + message);
    if (bannedWords.some((word) => message.includes(word))) {
      console.log("Banned word used. IP address: " + socket.handshake.address);
      io.emit("banned", "Kullanılan kelime yasaktır. Bağlantı bloke edildi.");
      socket.disconnect(true);
    } else {
      io.emit("message", message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Listening on port 3000");
});

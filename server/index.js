const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected user", socket.id);

  socket.on("Join", (data) => {
    socket.join(data);

    console.log(`user with ${socket.id} joined the room: ${data}`);
  });

  socket.on("send_message", (dataa) => {
    socket.to(dataa.room).emit("recieve_message", dataa);
    console.log(dataa,'recieved');
  });


  
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(3001, () => console.log("Luka Server Upp!"));

import http from "http";
import socketIO from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer();
const port = process.env.SOCKET_PORT;

const io = socketIO(server, {
  cors: {
    origins: ["http://localhost:3000", "https://spikenowreplica.ml/"],
  },
  path: "/socketio",
});

io.use((socket, next) => {
  const { id, email } = socket.handshake.auth;

  socket.userID = id;
  socket.email = email;
  next();
});

io.on("connection", (socket) => {
  socket.on("join-chat-room", ({ id, email }) => {
    console.log("New client connected");

    socket.handshake.auth = { id, email };
    socket.userID = id;
    socket.email = email;
    socket.join(socket.userID);
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      const checkExisting = users.find((user) => user.userID === socket.userID);
      if (checkExisting) {
        return;
      }
      users.push({
        userID: socket.userID,
        email: socket.email,
      });
    }
    console.log("Users", users);
    socket.emit("users", users);

    // notify existing users
    socket.broadcast.emit("user connected", {
      userID: socket.userID,
      email: socket.email,
    });

    // forward the private message to the right recipient
    socket.on("private message", ({ content, to }) => {
      socket.to(to).emit("private message", {
        content,
        from: socket.userID,
        to,
      });
    });
    // notify users upon disconnection
    socket.on("disconnect", () => {
      console.log("Client Disconnected");
      socket.broadcast.emit("user disconnected", socket.userID);
    });
  });

  socket.on("join-room", (roomId, userId, name) => {
    console.log("room", userId);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId, name);
    socket.on("disconnect", () => {
      // socket.join(socket.userID);
      socket.broadcast.to(roomId).emit("user-disconnected", userId);
    });
  });

  socket.on("join-group", ({ groupId, id, email }) => {
    socket.handshake.auth = { id, email };
    socket.userID = id;
    socket.email = email;
    socket.join(groupId);
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
      const checkExisting = users.find((user) => user.userID === socket.userID);
      if (checkExisting) {
        return;
      }
      users.push({
        userID: socket.userID,
        email: socket.email,
      });
    }
    console.log("Users Group", users);
    socket.emit("users-group", users);

    // notify existing users
    socket.broadcast.emit("user-group-connected", {
      userID: socket.userID,
      email: socket.email,
    });

    // forward the message to the right group
    socket.on("group-message", ({ content, to }) => {
      socket.to(to).emit("group-message", {
        content,
        from: to,
      });
    });

    // notify users upon disconnection
    socket.on("disconnect", () => {
      console.log("Client Disconnected");
      socket.broadcast.emit("user-group-disconnected", socket.userID);
    });
  });
});

server.listen(port, () => console.log(`Socket Server Running on port ${port}`));

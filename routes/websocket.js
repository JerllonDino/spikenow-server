const websocket = ({ io }) => {
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
        const checkExisting = users.find(
          (user) => user.userID === socket.userID
        );
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
  });
};

export default websocket;

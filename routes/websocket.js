const websocket = ({ io }) => {
  io.use((socket, next) => {
    const { id, email } = socket.handshake.auth;

    socket.userID = id;
    socket.email = email;
    next();
  });

  io.on("connection", (socket) => {
    console.log("New client connected");
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
};

export default websocket;

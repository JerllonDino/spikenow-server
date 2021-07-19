import http from "http";
import express from "express";
import socketIO from "socket.io";
import dotenv from "dotenv";
import websocket from "./routes/websocket";

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.SOCKET_PORT;

const io = socketIO(server, {
  cors: {
    origins: ["http://localhost:3000", "https://spikenowreplica.ml/"],
  },
});

websocket({ io });

server.listen(port, () => console.log(`Socket Server Running on port ${port}`));

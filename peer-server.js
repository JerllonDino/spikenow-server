import fs from "fs";
import { PeerServer } from "peer";
import dotenv from "dotenv";

dotenv.config();

const peer_host = process.env.PEERJS_HOST;
const peer_port = process.env.PEERJS_PORT;

const peerServer = PeerServer(
  {
    port: peer_port,
    path: "/peer",
    secure: false,
    proxied: true,
  },
  () => console.log(`PeerJS Server running on port ${peer_port}`)
);

peerServer.on("connection", (client) =>
  console.log(`Client connected: ${client.id}`)
);

peerServer.on("disconnect", (client) =>
  console.log(`Client disconnected: ${client.id}`)
);

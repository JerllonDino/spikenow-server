import { PeerServer } from "peer";
import dotenv from "dotenv";

dotenv.config();

const peer_host = process.env.PEERJS_HOST;
const peer_port = process.env.PEERJS_PORT;

const peerServer = PeerServer(
  {
    port: peer_port,
    path: "/peer",
    proxied: true,
    config: {
      iceServers: [
        {
          iceTransportPolicy: "relay",
          urls: "stun:stun.l.google.com:19302",
        },
        {
          iceTransportPolicy: "relay",
          urls: "turn:turn.spikenowreplica.ml:5439",
          username: "batman",
          credential: "password",
        },
      ],
    },
  },

  () => console.log(`PeerJS Server running on port ${peer_port}`)
);

peerServer.on("connection", (client) =>
  console.log(`Client connected: ${client.id}`)
);

peerServer.on("disconnect", (client) =>
  console.log(`Client disconnected: ${client.id}`)
);

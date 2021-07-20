import { PeerServer } from "peer";
import dotenv from "dotenv";

dotenv.config();

const peer_host = process.env.PEERJS_HOST;
const peer_port = process.env.PEERJS_PORT;

const peerServer = PeerServer(
  {
    port: peer_port,
    path: "/peer",
    secure: true,
    proxied: true,
    ssl: {
      key: fs.readFileSync(
        "/etc/letsencrypt/live/spikenowreplica.ml/privkey.pem",
        "utf8"
      ),
      cert: fs.readFileSync(
        "/etc/letsencrypt/live/spikenowreplica.ml/fullchain.pem",
        "utf8"
      ),
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

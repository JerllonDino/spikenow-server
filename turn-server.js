import Turn from "node-turn";
const server = new Turn({
  // set options
  listeningPort: 5439,
  authMech: "long-term",
  credentials: {
    username: "password",
  },
  debugLevel: "ALL",
  debug: (debugLevel, message) => {
    console.log(debugLevel, message);
  },
});

server.addUser("batman", "password");

server.start();

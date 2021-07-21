var Turn = require('node-turn');
var server = new Turn({
  // set options
  listeningPort: 5439,
  authMech: 'long-term',
  credentials: {
    username: "password"
  }
});

server.addUser('batman', 'password');

server.start();

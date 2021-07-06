import express from "express";
import http from "http";
import session from "express-session";
import cors from "cors";
import jsonwebtoken from "jsonwebtoken";
import config from "./config";
// import Sequelize from "sequelize";
import mongoose from "mongoose";
import socketIO from "socket.io";
import routes from "./routes";
import websocket from "./routes/websocket";

// function connectMySQL() {
//   const sequelize = new Sequelize(config.mysql.options);
//   sequelize
//     .authenticate()
//     .then(() => {
//       console.info("Successfully connected to MySQL");
//     })
//     .catch((error) => {
//       console.error(error);
//       process.exit(1);
//     });
//   return sequelize;
// }

// const mysql = connectMySQL();
// config.mysql.client = mysql;

async function connectToMongoose() {
  return mongoose.connect(config.mongodb.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
}

const app = express();
const clientURL = process.env.CLIENT_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: clientURL }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", clientURL);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  next();
});

app.use(
  session({ secret: "spikenowsecret", saveUninitialized: false, resave: false })
);

// JWT USER TOKEN
app.use((req, res, next) => {
  if (req.headers && req.headers.authorization) {
    jsonwebtoken.verify(
      req.headers.authorization,
      "SpikeNowReplicaApi",
      (err, decode) => {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      }
    );
  } else {
    req.user = undefined;
    next();
  }
});

app.get("/", (req, res, next) => {
  return res.send("This is the spikeNow replica server!");
});

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origins: [
      "http://localhost:3000",
      "https://spikenow-client.herokuapp.com/",
    ],
  },
});

websocket({ io });

routes({ app, config });

const port = process.env.PORT || 3001;

connectToMongoose()
  .then(() => {
    console.log("Mongoose connected");
    server.listen(port, () =>
      console.log(`SpikeNow server is now running in port ${port}`)
    );
  })
  .catch((error) => {
    console.log(error);
  });

import dotenv from "dotenv";

dotenv.config();

const config = {
  host: process.env.HOST,
  port: process.env.PORT,
  mongodb: {
    url: process.env.MONGO_DB_URL,
  },
  googleCredentials: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  io: null,
};

export default config;

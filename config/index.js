import dotenv from "dotenv";

dotenv.config();

const config = {
  host: process.env.HOST,
  port: process.env.PORT,
  mongodb: {
    url: process.env.MongoDBUrl,
  },
  googleCredentials: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
};

export default config;

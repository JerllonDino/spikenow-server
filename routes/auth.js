import googleUtil from "../src/google-util";
import jwt from "jsonwebtoken";
import UsersController from "../controllers/UsersController";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/");
  },

  // Change filename
  filename: function (req, file, cb) {
    cb(null, "feed2" + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const auth = ({ app, config }) => {
  app.post("/google-auth", async (req, res, next) => {
    try {
      console.log(req.body.code);
      const { id, email, full_name, refresh_token, picture } =
        await googleUtil.getGoogleAccountFromCode(req.body.code);
      const token = jwt.sign(
        {
          email,
          id,
          full_name,
          picture,
          refresh_token,
        },
        "SpikeNowReplicaApi"
      );
      const user = await UsersController.saveUser({ email, gId: id });
      console.log("user", user);
      res.status(201).json({
        token,
        id,
        email,
        full_name,
        picture,
      });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/upload-feed", upload.single("feed"), (req, res, next) => {
    try {
      if (!req.file) {
        return res.send("Please select a file to upload");
      }
      return res.send("File uploaded");
    } catch (error) {
      return next(error);
    }
  });

  return app;
};

export default auth;

import googleUtil from "../src/google-util";

const chat = ({ app }) => {
  app.post("/email", async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized user!" });
    }
    // console.log(req.body);
    const token = req.user.refresh_token;
    const subject = req.body.subject;
    const message = req.body.message;
    const to = req.body.to;
    try {
      const messageSend = await googleUtil.sendGmail(
        token,
        subject,
        message,
        to
      );
      res.json({
        success: true,
        message: "Email Sent!",
        messageSent: messageSend,
      });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/getEmails", async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized user!" });
    }
    try {
      const emails = await googleUtil.getEmails(
        req.user.refresh_token,
        "-spikenowreplica.group"
      );
      res.json(emails);
    } catch (error) {
      return next(error);
    }
  });

  app.get("/getMessages/:senderEmail", async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized user!" });
    }
    try {
      const query = `from:(${req.params.senderEmail}) OR to:(${req.params.senderEmail}) -spikenowreplica.group`;
      const emails = await googleUtil.getEmails(
        req.user.refresh_token,
        query,
        "full"
      );
      //   console.log(emails);
      return res.json(emails);
    } catch (error) {
      return next(error);
    }
  });

  app.get("/getMessageGroup/:groupID", async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized user!" });
    }
    try {
      const query = req.params.groupID;
      console.log(query);
      const emails = await googleUtil.getEmails(
        req.user.refresh_token,
        query,
        "full"
      );
      //   console.log(emails);
      return res.json(emails);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/starChangeEmail", async (req, res, next) => {
    try {
      const result = await googleUtil.changeStarEmail(
        req.user.refresh_token,
        req.body.emailId,
        req.body.isStarred
      );
      console.log(result);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/trashEmail", async (req, res, next) => {
    try {
      const result = await googleUtil.trashEmail(
        req.user.refresh_token,
        req.body.emailId
      );
      console.log(result);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/trashConversation", async (req, res, next) => {
    try {
      const query = `from:(${req.body.email}) OR to:(${req.body.email})`;
      const emails = await googleUtil.trashAllEmail(
        req.user.refresh_token,
        query
      );
      res.json("Trashed!");
    } catch (error) {
      return next(error);
    }
  });

  return app;
};

export default chat;

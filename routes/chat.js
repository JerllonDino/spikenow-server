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
      const emails = await googleUtil.getEmails(req.user.refresh_token);
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
      const fromQuery = `from:(${req.params.senderEmail})`;
      const toQuery = `to:(${req.params.senderEmail})`;
      const fromEmail = await googleUtil.getEmails(
        req.user.refresh_token,
        fromQuery,
        "full"
      );
      const toEmail = await googleUtil.getEmails(
        req.user.refresh_token,
        toQuery,
        "full"
      );
      const emails = [...fromEmail, ...toEmail];
      //   console.log(emails);
      return res.json(emails);
    } catch (error) {
      return next(error);
    }
  });

  return app;
};

export default chat;

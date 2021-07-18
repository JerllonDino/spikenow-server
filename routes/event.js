import googleUtil from "../src/google-util";

const event = ({ app }) => {
  // const user = new UserController(config.mongodb);

  app.get("/getEvents/:startDate/:endDate", async (req, res, next) => {
    try {
      console.log(req.params);
      const date = new Date(JSON.parse(req.params.startDate)).toISOString();

      const endingDate = new Date(JSON.parse(req.params.endDate)).toISOString();

      const events = await googleUtil.getGoogleEvents(
        req.user.refresh_token,
        date,
        endingDate
      );
      res.json(events);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/saveEvent", async (req, res, next) => {
    try {
      const result = await googleUtil.saveGoogleEvent(
        req.user.refresh_token,
        req.body
      );
      console.log(result);
      return res.json("got it!");
    } catch (error) {
      return next(error);
    }
  });

  app.delete("/deleteEvent/:eventId", async (req, res, next) => {
    try {
      const result = await googleUtil.deleteGoogleEvent(
        req.user.refresh_token,
        req.params.eventId
      );
      console.log(result);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  return app;
};

export default event;

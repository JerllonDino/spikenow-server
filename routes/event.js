import googleUtil from "../src/google-util";

const event = ({ app }) => {
  // const user = new UserController(config.mongodb);

  app.get("/getEvents/:startDate?", async (req, res, next) => {
    try {
      console.log(req.params);
      const date = req.params.startDate
        ? new Date(JSON.parse(req.params.startDate)).toISOString()
        : new Date().toISOString();
      const endDate = new Date(date);
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);

      const events = await googleUtil.getGoogleEvents(
        req.user.refresh_token,
        date,
        endDate.toISOString()
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

import NotesController from "../controllers/NotesController";

const note = ({ app, config }) => {
  // const notesController = new NotesController(config.mysql.client);

  app.get("/getNotes/:userId", async (req, res, next) => {
    try {
      const result = await NotesController.getNotes(req.params.userId);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.get("/getNote/:noteId", async (req, res, next) => {
    try {
      const result = await NotesController.getNote(req.params.noteId);
      const note = await result.json();
      return res.json(note);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/addNote", async (req, res, next) => {
    try {
      const result = await NotesController.addNote(req.body);
      //   console.log(result);
      //   const note = await result.json();
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/updateNote", async (req, res, next) => {
    try {
      const result = await NotesController.update(req.body);
      const note = await result.json();
      return res.json(note);
    } catch (error) {
      return next(error);
    }
  });

  return app;
};

export default note;

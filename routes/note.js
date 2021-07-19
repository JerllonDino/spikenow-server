import NotesController from "../controllers/NotesController";

const note = ({ app, config }) => {
  app.use((req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized user!" });
    } else {
      return next();
    }
  });

  app.get("/getNotes/:userId", async (req, res, next) => {
    try {
      const note = await NotesController.getNotes(req.params.userId);
      return res.json(note);
    } catch (error) {
      return next(error);
    }
  });

  app.get("/getNote/:noteId", async (req, res, next) => {
    try {
      const note = await NotesController.getNote(req.params.noteId);
      return res.json(note);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/addNote", async (req, res, next) => {
    try {
      const note = await NotesController.addNote(req.body);
      //   console.log(result);
      //   const note = await result.json();
      return res.json(note);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/updateNote", async (req, res, next) => {
    try {
      const note = await NotesController.update(req.body.id, req.body);
      return res.json(note);
    } catch (error) {
      return next(error);
    }
  });

  app.delete("/deleteNote/:id", async (req, res, next) => {
    try {
      const note = await NotesController.remove(req.params.id);
      return res.json(note);
    } catch (error) {
      return next(error);
    }
  });

  return app;
};

export default note;

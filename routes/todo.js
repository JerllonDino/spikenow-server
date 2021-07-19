import TodosController from "../controllers/TodosController";

const todo = ({ app }) => {
  app.use((req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized user!" });
    } else {
      return next();
    }
  });
  app.get("/getTodos/:userId", async (req, res, next) => {
    try {
      const result = await TodosController.getTodos(req.params.userId);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.get("/getTodo/:todoId", async (req, res, next) => {
    try {
      const result = await TodosController.getTodo(req.params.todoId);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/addTodo", async (req, res, next) => {
    try {
      const result = await TodosController.addTodo(req.body);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/updateTodo", async (req, res, next) => {
    try {
      const result = await TodosController.update(req.body.id, req.body);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.delete("/deleteTodo/:id", async (req, res, next) => {
    try {
      const result = await TodosController.remove(req.params.id);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  return app;
};

export default todo;

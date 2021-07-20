import TodoModel from "../models/Todo";

class TodosController {
  static async getTodos(userId) {
    return TodoModel.find({ userID: userId }).sort({ createdAt: -1 }).exec();
  }

  static async getTodosToday(userId) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return TodoModel.find({
      userId: userId,
      createdAt: { $gte: start, $lt: end },
    })
      .sort({ createdAt: -1 })
      .exec();
  }

  static async getTodo(todoId) {
    return TodoModel.findById(todoId).exec();
  }

  static async addTodo(data) {
    const todo = new TodoModel(data);
    return todo.save();
  }

  static async update(todoId, data) {
    return TodoModel.findByIdAndUpdate(todoId, data, {
      returnOriginal: false,
    }).exec();
  }

  static async remove(todoId) {
    return TodoModel.deleteOne({ _id: todoId }).exec();
  }
}

export default TodosController;

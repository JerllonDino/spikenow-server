import mongoose from "mongoose";
const Todo = mongoose.Schema(
  {
    userID: { type: String, require: true },
    title: { type: String },
    status: { type: String },
    todo: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Todo", Todo);

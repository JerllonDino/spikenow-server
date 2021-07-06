import mongoose from "mongoose";
const Note = mongoose.Schema(
  {
    userID: { type: String, require: true },
    text: { type: String },
    title: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Note", Note);

import mongoose from "mongoose";
const GroupChat = mongoose.Schema(
  {
    name: { type: String, require: true },
    category: { type: String },
    creatorId: { type: String, require: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("GroupChat", GroupChat);

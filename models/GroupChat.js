import mongoose from "mongoose";
const GroupChat = mongoose.Schema(
  {
    name: { type: String, require: true },
    category: { type: Number },
    creatorEmail: { type: String, require: true },
    members: { type: Array },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("GroupChat", GroupChat);

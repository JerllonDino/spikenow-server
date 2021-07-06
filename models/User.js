import mongoose from "mongoose";
const Users = mongoose.Schema(
  {
    gId: { type: String, require: true },
    email: { type: String },
    status: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Users", Users);

import mongoose from "mongoose";
const GroupChatMember = mongoose.Schema(
  {
    groupID: { type: String, require: true },
    memberEmail: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("GroupChatMember", GroupChatMember);

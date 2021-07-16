import GroupChat from "../models/GroupChat";

class GroupChatController {
  static async getGroupChats(email) {
    const groups = await GroupChat.find({
      $or: [
        { members: { $elemMatch: { email: email } } },
        { creatorEmail: email },
      ],
    }).exec();
    return groups;
  }

  static async getGroupChatToday(userId) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return GroupChat.find({
      userId: userId,
      createdAt: { $gte: start, $lt: end },
    })
      .sort({ createdAt: -1 })
      .exec();
  }

  static async getGroupChat(groupChatId) {
    return GroupChat.findById(groupChatId).exec();
  }

  static async addGroupChat(data) {
    const groupChat = new GroupChat(data);
    return groupChat.save();
  }

  static async update(groupChatId, data) {
    return GroupChat.findByIdAndUpdate(groupChatId, data).exec();
  }

  static async remove(groupChatId) {
    return GroupChat.deleteOne({ _id: groupChatId }).exec();
  }

  static async removeMember(email) {
    GroupChat.deleteOne({ members: { $elemMatch: { email: email } } }).exec();
  }
}

export default GroupChatController;

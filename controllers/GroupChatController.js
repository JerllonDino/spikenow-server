import GroupChat from "../models/GroupChat";
import GroupChatMember from "../models/GroupChatMember";

class GroupChatController {
  static async getGroupChats(userId) {
    const inGroups = GroupChatMember({ memberID: userId }).exec();
    const groups = inGroups.map((group) =>
      GroupChat.find({ _id: group.groupID }).sort({ createdAt: -1 }).exec()
    );
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

  static async addGroupChat({ groupChat, members }) {
    const groupChat = new GroupChat(data);
    members.forEach(({ userId, email }) => {
      this.addMemberToGroup({ groupChatId: groupChat._id, userId, email });
    });

    return groupChat.save();
  }

  static async addMemberToGroup({ groupChatId, userId, email }) {
    const member = new GroupChatMember({
      memberID: userId,
      memberEmail: email,
      groupID: groupChatId,
    });

    return member.save();
  }

  static async update(groupChatId, data) {
    return GroupChat.findByIdAndUpdate(groupChatId, data).exec();
  }

  static async remove(groupChatId) {
    GroupChatMember.deleteMany({ groupID: groupChatId }).exec();
    return GroupChat.deleteOne({ _id: groupChatId }).exec();
  }

  static async removeMember(memberID) {
    GroupChatMember.deleteOne({ memberID }).exec();
  }
}

export default GroupChatController;

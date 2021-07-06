import UserModel from "../models/User";

class UserController {
  static async getUsers() {
    return UserModel.find({}).sort({ createdAt: -1 }).exec();
  }

  static async getUser(userId) {
    return UserModel.findOne({ gId: userId }).exec();
  }

  static async saveUser(data) {
    const existingUser = await UserModel.findOne({ gId: data.gId }).exec();
    if (existingUser) {
      return existingUser;
    }
    const user = new UserModel(data);
    return user.save();
  }

  static async update(userId, data) {
    return UserModel.findOneAndUpdate({ gId: userId }, data).exec();
  }

  static async remove(userId) {
    return UserModel.deleteOne({ gId: userId }).exec();
  }
}

export default UserController;

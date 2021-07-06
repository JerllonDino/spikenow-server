import NoteModel from "../models/Note";

class NoteController {
  static async getNotes(userId) {
    return NoteModel.find({ userID: userId }).sort({ createdAt: -1 }).exec();
  }

  static async getNotesToday(userId) {
    const today = new Date();
    return NoteModel.find({ userId: userId, createdAt: today })
      .sort({ createdAt: -1 })
      .exec();
  }

  static async getNote(noteId) {
    return NoteModel.findById(noteId).exec();
  }

  static async addNote(data) {
    const note = new NoteModel(data);
    return note.save();
  }

  static async update(noteId, data) {
    return NoteModel.findByIdAndUpdate(noteId, data).exec();
  }

  static async remove(noteId) {
    return NoteModel.deleteOne({ _id: noteId }).exec();
  }
}

export default NoteController;

import GroupChatController from "../controllers/GroupChatController";
import googleUtil from "../src/google-util";

const groupChat = ({ app }) => {
  app.get("/getGroupChat", async (req, res, next) => {
    try {
      const result = await GroupChatController.getGroupChats(req.user.email);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.get("/getOneGroupChat/:groupChatId", async (req, res, next) => {
    try {
      const result = await GroupChatController.getGroupChat(
        req.params.groupChatId
      );
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/addGroupChat", async (req, res, next) => {
    try {
      const result = await GroupChatController.addGroupChat(req.body);
      //   console.log(result);
      //   const note = await result.json();
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/updateGroupChat", async (req, res, next) => {
    try {
      const result = await GroupChatController.update(req.body.id, req.body);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/addGroupChatMember", async (req, res, next) => {
    try {
      const result = await GroupChatController.addMemberToGroup(req.body);
      //   console.log(result);
      //   const note = await result.json();
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/leaveGroupChat", async (req, res, next) => {
    try {
      const result = await GroupChatController.removeMember(req.body);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });
  app.delete("/deleteGroupChat/:id", async (req, res, next) => {
    try {
      const result = await GroupChatController.remove(req.params.id);

      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/messageGroup", async (req, res, next) => {
    try {
      const result = await GroupChatController.messageGroup(req.body);
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  app.delete("/deleteMessageGroup", async (req, res, next) => {
    try {
      const result = await GroupChatController.deleteMessage(req.body.id);
      const emails = await googleUtil.trashAllEmail(
        req.user.refresh_token,
        req.body.id
      );
      return res.json(result);
    } catch (error) {
      return next(error);
    }
  });

  return app;
};

export default groupChat;

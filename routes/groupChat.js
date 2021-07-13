import GroupChatController from "../controllers/GroupChatController";

const groupChat = ({ app, config }) => {
  // const GroupChatController = new GroupChatController(config.mysql.client);

  app.get("/getGroupChat/:userId", async (req, res, next) => {
    try {
      const note = await GroupChatController.getGroupChats(req.params.userId);
      return res.json(note);
    } catch (error) {
      return next(error);
    }
  });

  app.get("/getOneGroupChat/:groupChatId", async (req, res, next) => {
    try {
      const note = await GroupChatController.getGroupChat(
        req.params.groupChatId
      );
      return res.json(note);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/addGroupChat", async (req, res, next) => {
    try {
      const note = await GroupChatController.addGroupChat(req.body);
      //   console.log(result);
      //   const note = await result.json();
      return res.json(note);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/updateGroupChat", async (req, res, next) => {
    try {
      const note = await GroupChatController.update(req.body.id, req.body);
      return res.json(note);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/addGroupChatMember", async (req, res, next) => {
    try {
      const note = await GroupChatController.addMemberToGroup(req.body);
      //   console.log(result);
      //   const note = await result.json();
      return res.json(note);
    } catch (error) {
      return next(error);
    }
  });

  app.post("/leaveGroupChat", async (req, res, next) => {
    try {
      const note = await GroupChatController.removeMember(req.body);
      return res.json(note);
    } catch (error) {
      return next(error);
    }
  });
  app.delete("/deleteGroupChat/:id", async (req, res, next) => {
    try {
      const note = await GroupChatController.remove(req.params.id);
      return res.json(note);
    } catch (error) {
      return next(error);
    }
  });

  return app;
};

export default groupChat;

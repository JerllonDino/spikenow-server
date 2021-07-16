import auth from "./auth";
import chat from "./chat";
import note from "./note";
import event from "./event";
import todo from "./todo";
import groupChat from "./groupChat";

const routes = (utils) => {
  auth(utils);
  chat(utils);
  note(utils);
  event(utils);
  todo(utils);
  groupChat(utils);
};

export default routes;

import auth from "./auth";
import chat from "./chat";
import note from "./note";
import event from "./event";
import todo from "./todo";

const routes = (utils) => {
  auth(utils);
  chat(utils);
  note(utils);
  event(utils);
  todo(utils);
};

export default routes;

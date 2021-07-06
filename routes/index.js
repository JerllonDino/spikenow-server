import auth from "./auth";
import chat from "./chat";
import note from "./note";

const routes = (config) => {
  auth(config);
  chat(config);
  note(config);
};

export default routes;

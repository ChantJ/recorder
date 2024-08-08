import NotFound from "./components/404/404.js";
import Home from "./components/main/index.js";
import AudioRecord from "./components/audio/audio.js";
import VideoRecord from "./components/video/video.js";
import { BackBtn } from "./components/common/backBtn.js";

const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

const back = () => {
  window.history.back();
  handleLocation();
};

const routes = {
  404: NotFound,
  "/": Home,
  "/audio": AudioRecord,
  "/video": VideoRecord,
};

const handleLocation = async () => {
  const root = document.getElementById("app");
  const path = window.location.pathname;
  const component = routes[path] || routes["404"];
  root.innerHTML = component();
};

window.onpopstate = handleLocation;
window.route = route;
window.back = back;
window.backBtn = BackBtn;

handleLocation();

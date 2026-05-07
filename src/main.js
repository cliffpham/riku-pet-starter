import { TICK_MS } from "./game/config.js";
import { advanceTime, applyAction, createInitialState } from "./game/logic.js";
import { clearState, loadState, saveState } from "./game/storage.js";
import { renderApp } from "./ui/render.js";

const root = document.querySelector("#app");

if (!root) {
  throw new Error("App root element was not found.");
}

let state = loadState();
let activeAction = null;
let activeActionTimer = null;

const commit = (nextState) => {
  state = nextState;
  saveState(state);
  render();
};

const handleAction = (action) => {
  activeAction = action;
  window.clearTimeout(activeActionTimer);
  commit(applyAction(state, action));

  activeActionTimer = window.setTimeout(() => {
    activeAction = null;
    render();
  }, 900);
};

const handleReset = () => {
  activeAction = null;
  window.clearTimeout(activeActionTimer);
  clearState();
  commit(createInitialState());
};

function render() {
  renderApp(root, state, {
    activeAction,
    onAction: handleAction,
    onReset: handleReset
  });
}

render();

window.setInterval(() => {
  commit(advanceTime(state));
}, TICK_MS);

import { TICK_MS } from "./game/config.js";
import { advanceTime, applyAction, createInitialState } from "./game/logic.js";
import { clearState, loadState, saveState } from "./game/storage.js";
import { renderApp } from "./ui/render.js";

const root = document.querySelector("#app");

if (!root) {
  throw new Error("App root element was not found.");
}

let state = loadState();

const commit = (nextState) => {
  state = nextState;
  saveState(state);
  render();
};

const handleAction = (action) => {
  commit(applyAction(state, action));
};

const handleReset = () => {
  clearState();
  commit(createInitialState());
};

function render() {
  renderApp(root, state, {
    onAction: handleAction,
    onReset: handleReset
  });
}

render();

window.setInterval(() => {
  commit(advanceTime(state));
}, TICK_MS);

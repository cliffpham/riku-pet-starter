import { TICK_MS } from "./game/config.js";
import {
  advanceTime,
  applyAction,
  collectTreasure,
  createInitialState,
  useTreasure
} from "./game/logic.js";
import { clearState, loadState, saveState } from "./game/storage.js";
import { renderApp } from "./ui/render.js";

const root = document.querySelector("#app");

if (!root) {
  throw new Error("App root element was not found.");
}

let state = loadState();
let activeAction = null;
let activeActionTimer = null;
let activeTreasureEvent = null;
let activeTreasureEventTimer = null;

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
  activeTreasureEvent = null;
  window.clearTimeout(activeActionTimer);
  window.clearTimeout(activeTreasureEventTimer);
  clearState();
  commit(createInitialState());
};

const handleCollectTreasure = () => {
  commit(collectTreasure(state));
};

const handleUseTreasure = () => {
  const result = useTreasure(state);

  if (!result.event) {
    return;
  }

  activeTreasureEvent = result.event;
  window.clearTimeout(activeTreasureEventTimer);
  commit(result.state);

  activeTreasureEventTimer = window.setTimeout(() => {
    activeTreasureEvent = null;
    render();
  }, 2_800);
};

function render() {
  renderApp(root, state, {
    activeAction,
    activeTreasureEvent,
    onAction: handleAction,
    onCollectTreasure: handleCollectTreasure,
    onUseTreasure: handleUseTreasure,
    onReset: handleReset
  });
}

render();

window.setInterval(() => {
  commit(advanceTime(state));
}, TICK_MS);

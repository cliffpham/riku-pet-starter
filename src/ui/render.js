import { getGrowthProgress, getMood, getStatusMessage } from "../game/logic.js";
import { getPetArt } from "./pet-art.js";

const actionLabels = {
  feed: "ごはん",
  play: "あそぶ",
  clean: "そうじ",
  nap: "ねる"
};

const actionEffectLabels = {
  feed: "もぐもぐ",
  play: "ジャンプ",
  clean: "ぴかぴか",
  nap: "すやすや"
};

const moodLabels = {
  happy: "ごきげん",
  okay: "ふつう",
  tired: "ねむい",
  messy: "よごれ",
  hungry: "空腹"
};

const statLabels = [
  ["hunger", "満腹度"],
  ["happiness", "ごきげん"],
  ["energy", "元気"],
  ["cleanliness", "清潔"]
];

const clampDisplayCount = (value) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
};

const formatAge = (ageMinutes) => {
  const hours = Math.floor(ageMinutes / 60);
  const minutes = ageMinutes % 60;
  return hours > 0 ? `${hours}時間${minutes}分` : `${minutes}分`;
};

const renderStat = (label, value) => `
  <div class="stat">
    <div class="stat__label">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
    <div class="meter" aria-label="${label}: ${value}">
      <span style="width: ${value}%"></span>
    </div>
  </div>
`;

const renderTreasureIcon = () => `<span class="treasure-icon" aria-hidden="true"></span>`;

const renderPendingTreasures = (pendingTreasures) => {
  if (pendingTreasures <= 0) return "";

  return `
    <div class="treasure-field" aria-label="未回収の宝物">
      ${Array.from(
        { length: pendingTreasures },
        (_, index) => `
          <button class="treasure-button" type="button" data-treasure="${index}" aria-label="宝物を回収">
            ${renderTreasureIcon()}
          </button>
        `
      ).join("")}
    </div>
  `;
};

export const renderApp = (root, state, options) => {
  const mood = getMood(state);
  const growth = getGrowthProgress(state);
  const petArt = getPetArt(state.stage, mood);
  const activeAction = options.activeAction ?? "";
  const pendingTreasures = clampDisplayCount(state.treasures?.pending);
  const collectedTreasures = clampDisplayCount(state.treasures?.collected);
  const actions = Object.keys(actionLabels);

  root.innerHTML = `
    <section class="game-shell" aria-labelledby="game-title">
      <div class="topbar">
        <div>
          <p class="eyebrow">virtual pet starter</p>
          <h1 id="game-title">${state.name} Pet</h1>
        </div>
        <button class="ghost-button" type="button" data-reset>リセット</button>
      </div>

      <div class="playfield">
        <div class="pet-stage" data-mood="${mood}" data-stage="${state.stage}" data-action="${activeAction}">
          <img class="pet-image" src="${petArt.src}" alt="${state.name}の${petArt.alt}" />
          ${
            activeAction
              ? `<div class="action-effect" aria-hidden="true">${actionEffectLabels[activeAction]}</div>`
              : ""
          }
          <div class="shadow"></div>
          ${renderPendingTreasures(pendingTreasures)}
        </div>

        <aside class="status-panel" aria-live="polite">
          <div class="status-header">
            <span class="mood-pill">${moodLabels[mood]}</span>
            <span>${growth.currentStage.label}</span>
          </div>
          <div class="treasure-counter" aria-label="集めた宝物: ${collectedTreasures}">
            ${renderTreasureIcon()}
            <span>宝物</span>
            <strong>${collectedTreasures}</strong>
          </div>
          <p class="message">${getStatusMessage(state)}</p>
          <p class="age">年齢: ${formatAge(state.ageMinutes)}</p>
          <div class="growth-program">
            <div class="growth-program__header">
              <span>成長プログラム</span>
              <strong>${growth.progressPercent}%</strong>
            </div>
            <div class="growth-track" aria-label="成長進捗: ${growth.progressPercent}%">
              <span style="width: ${growth.progressPercent}%"></span>
            </div>
            <div class="growth-program__steps">
              <span>${growth.currentStage.label}</span>
              <span>${growth.nextStage?.label ?? "完了"}</span>
            </div>
            <p class="growth-program__message">${growth.message}</p>
          </div>
          <div class="stats">
            ${statLabels.map(([key, label]) => renderStat(label, state.stats[key])).join("")}
          </div>
        </aside>
      </div>

      <div class="actions" aria-label="お世話の操作">
        ${actions
          .map(
            (action) =>
              `<button class="action-button" type="button" data-action="${action}">${actionLabels[action]}</button>`
          )
          .join("")}
      </div>
    </section>
  `;

  root.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => options.onAction(button.dataset.action));
  });

  if (options.onCollectTreasure) {
    root.querySelectorAll("button[data-treasure]").forEach((button) => {
      button.addEventListener("click", options.onCollectTreasure);
    });
  }

  root.querySelector("[data-reset]")?.addEventListener("click", options.onReset);
};

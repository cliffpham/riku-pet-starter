import { getMood, getStatusMessage } from "../game/logic.js";

const actionLabels = {
  feed: "ごはん",
  play: "あそぶ",
  clean: "そうじ",
  nap: "ねる"
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

export const renderApp = (root, state, options) => {
  const mood = getMood(state);
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
        <div class="pet-stage" data-mood="${mood}">
          <img class="pet-image" src="public/pet-egg.svg" alt="${state.name}のペット" />
          <div class="shadow"></div>
        </div>

        <aside class="status-panel" aria-live="polite">
          <div class="status-header">
            <span class="mood-pill">${moodLabels[mood]}</span>
            <span>${state.stage}</span>
          </div>
          <p class="message">${getStatusMessage(state)}</p>
          <p class="age">年齢: ${formatAge(state.ageMinutes)}</p>
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

  root.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => options.onAction(button.dataset.action));
  });

  root.querySelector("[data-reset]")?.addEventListener("click", options.onReset);
};


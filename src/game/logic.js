import {
  INITIAL_STATE,
  MAX_STAT,
  MIN_STAT,
  SIMULATED_MINUTES_PER_TICK
} from "./config.js";

const clampStat = (value) => Math.max(MIN_STAT, Math.min(MAX_STAT, value));

const updateStats = (stats, patch) => ({
  hunger: clampStat(patch.hunger ?? stats.hunger),
  happiness: clampStat(patch.happiness ?? stats.happiness),
  energy: clampStat(patch.energy ?? stats.energy),
  cleanliness: clampStat(patch.cleanliness ?? stats.cleanliness)
});

const getStage = (ageMinutes) => {
  if (ageMinutes >= 80) return "kid";
  if (ageMinutes >= 30) return "baby";
  return "egg";
};

export const createInitialState = (now = Date.now()) => ({
  ...INITIAL_STATE,
  stats: { ...INITIAL_STATE.stats },
  lastUpdatedAt: now
});

export const getMood = (state) => {
  if (state.stats.hunger < 35) return "hungry";
  if (state.stats.cleanliness < 35) return "messy";
  if (state.stats.energy < 30) return "tired";
  if (state.stats.happiness > 70) return "happy";
  return "okay";
};

export const applyAction = (state, action, now = Date.now()) => {
  const { stats } = state;

  const nextStatsByAction = {
    feed: updateStats(stats, {
      hunger: stats.hunger + 22,
      energy: stats.energy - 4,
      cleanliness: stats.cleanliness - 6
    }),
    play: updateStats(stats, {
      happiness: stats.happiness + 24,
      energy: stats.energy - 16,
      hunger: stats.hunger - 8,
      cleanliness: stats.cleanliness - 8
    }),
    clean: updateStats(stats, {
      cleanliness: stats.cleanliness + 30,
      happiness: stats.happiness - 2
    }),
    nap: updateStats(stats, {
      energy: stats.energy + 28,
      hunger: stats.hunger - 10,
      happiness: stats.happiness - 3
    })
  };

  if (!nextStatsByAction[action]) {
    throw new Error(`Unknown pet action: ${action}`);
  }

  return {
    ...state,
    stats: nextStatsByAction[action],
    lastUpdatedAt: now
  };
};

export const advanceTime = (
  state,
  minutes = SIMULATED_MINUTES_PER_TICK,
  now = Date.now()
) => {
  const ageMinutes = state.ageMinutes + minutes;
  const statDrop = Math.max(1, Math.round(minutes / 2));

  const stats = updateStats(state.stats, {
    hunger: state.stats.hunger - statDrop,
    happiness: state.stats.happiness - Math.ceil(statDrop / 2),
    energy: state.stats.energy - Math.ceil(statDrop / 2),
    cleanliness: state.stats.cleanliness - Math.ceil(statDrop / 3)
  });

  return {
    ...state,
    ageMinutes,
    stage: getStage(ageMinutes),
    stats,
    lastUpdatedAt: now
  };
};

export const getStatusMessage = (state) => {
  const messages = {
    happy: "かなりごきげんです。",
    okay: "落ち着いて過ごしています。",
    tired: "少し眠そうです。",
    messy: "お風呂が必要そうです。",
    hungry: "おなかが空いています。"
  };

  return messages[getMood(state)];
};


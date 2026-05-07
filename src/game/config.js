export const MIN_STAT = 0;
export const MAX_STAT = 100;
export const TICK_MS = 5_000;
export const SIMULATED_MINUTES_PER_TICK = 2;

export const INITIAL_STATE = {
  name: "Riku",
  stage: "egg",
  ageMinutes: 0,
  lastUpdatedAt: Date.now(),
  stats: {
    hunger: 72,
    happiness: 70,
    energy: 80,
    cleanliness: 82
  }
};


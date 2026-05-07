export const MIN_STAT = 0;
export const MAX_STAT = 100;
export const TICK_MS = 5_000;
export const SIMULATED_MINUTES_PER_TICK = 2;
export const TREASURE_CLEANLINESS_DROP = 10;
export const TREASURE_CLEANLINESS_RESTORE = 5;

export const GROWTH_STAGES = [
  { id: "egg", label: "たまご", startsAt: 0 },
  { id: "baby", label: "ベビー", startsAt: 30 },
  { id: "kid", label: "キッズ", startsAt: 80 },
  { id: "teen", label: "ジュニア", startsAt: 150 },
  { id: "adult", label: "おとな", startsAt: 240 }
];

export const INITIAL_STATE = {
  name: "Riku",
  stage: "egg",
  ageMinutes: 0,
  lastUpdatedAt: Date.now(),
  treasures: {
    pending: 0,
    collected: 0,
    cleanlinessDropBuffer: 0
  },
  stats: {
    hunger: 72,
    happiness: 70,
    energy: 80,
    cleanliness: 82
  }
};

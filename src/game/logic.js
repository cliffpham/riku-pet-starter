import {
  GROWTH_STAGES,
  INITIAL_STATE,
  MAX_STAT,
  MIN_STAT,
  SIMULATED_MINUTES_PER_TICK,
  TREASURE_CLEANLINESS_DROP,
  TREASURE_CLEANLINESS_RESTORE
} from "./config.js";

const clampStat = (value) => Math.max(MIN_STAT, Math.min(MAX_STAT, value));
const clampCount = (value) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
};

const updateStats = (stats, patch) => ({
  hunger: clampStat(patch.hunger ?? stats.hunger),
  happiness: clampStat(patch.happiness ?? stats.happiness),
  energy: clampStat(patch.energy ?? stats.energy),
  cleanliness: clampStat(patch.cleanliness ?? stats.cleanliness)
});

const getStage = (ageMinutes) => {
  for (let index = GROWTH_STAGES.length - 1; index >= 0; index -= 1) {
    if (ageMinutes >= GROWTH_STAGES[index].startsAt) {
      return GROWTH_STAGES[index].id;
    }
  }

  return GROWTH_STAGES[0].id;
};

export const normalizeTreasures = (treasures) => ({
  pending: clampCount(treasures?.pending),
  collected: clampCount(treasures?.collected),
  cleanlinessDropBuffer: clampCount(treasures?.cleanlinessDropBuffer)
});

const awardTreasuresForCleanlinessDrop = (state, nextStats) => {
  const treasures = normalizeTreasures(state.treasures);
  const cleanlinessDrop = Math.max(
    0,
    state.stats.cleanliness - nextStats.cleanliness
  );

  if (cleanlinessDrop <= 0) {
    return treasures;
  }

  const bufferedDrop = treasures.cleanlinessDropBuffer + cleanlinessDrop;
  const earnedTreasures = Math.floor(bufferedDrop / TREASURE_CLEANLINESS_DROP);

  return {
    ...treasures,
    pending: treasures.pending + earnedTreasures,
    cleanlinessDropBuffer: bufferedDrop % TREASURE_CLEANLINESS_DROP
  };
};

export const createInitialState = (now = Date.now()) => ({
  ...INITIAL_STATE,
  stats: { ...INITIAL_STATE.stats },
  treasures: { ...INITIAL_STATE.treasures },
  lastUpdatedAt: now
});

export const getMood = (state) => {
  if (state.stats.hunger < 35) return "hungry";
  if (state.stats.cleanliness < 35) return "messy";
  if (state.stats.energy < 30) return "tired";
  if (state.stats.happiness > 70) return "happy";
  return "okay";
};

export const getGrowthProgress = (state) => {
  const stageId = getStage(state.ageMinutes);
  const currentStageIndex = GROWTH_STAGES.findIndex(
    (stage) => stage.id === stageId
  );
  const normalizedIndex = currentStageIndex >= 0 ? currentStageIndex : 0;
  const currentStage = GROWTH_STAGES[normalizedIndex];
  const nextStage = GROWTH_STAGES[normalizedIndex + 1] ?? null;

  if (!nextStage) {
    return {
      currentStage,
      nextStage: null,
      minutesToNext: 0,
      progressPercent: 100,
      message: "成長プログラムを完了しました。"
    };
  }

  const stageDuration = nextStage.startsAt - currentStage.startsAt;
  const elapsedInStage = Math.max(0, state.ageMinutes - currentStage.startsAt);
  const minutesToNext = Math.max(0, nextStage.startsAt - state.ageMinutes);
  const progressPercent = Math.min(
    100,
    Math.round((elapsedInStage / stageDuration) * 100)
  );

  return {
    currentStage,
    nextStage,
    minutesToNext,
    progressPercent,
    message: `${nextStage.label}まであと${minutesToNext}分です。`
  };
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

  const nextStats = nextStatsByAction[action];

  return {
    ...state,
    stats: nextStats,
    treasures: awardTreasuresForCleanlinessDrop(state, nextStats),
    lastUpdatedAt: now
  };
};

export const collectTreasure = (state, now = Date.now()) => {
  const treasures = normalizeTreasures(state.treasures);

  if (treasures.pending <= 0) {
    return state;
  }

  return {
    ...state,
    stats: updateStats(state.stats, {
      cleanliness: state.stats.cleanliness + TREASURE_CLEANLINESS_RESTORE
    }),
    treasures: {
      ...treasures,
      pending: treasures.pending - 1,
      collected: treasures.collected + 1
    },
    lastUpdatedAt: now
  };
};

export const getTreasureEvent = (treasureCount) => {
  if (treasureCount >= 5) {
    return {
      id: "festival",
      title: "星まつり",
      message: "宝物が光って、みんなの調子が上がりました。",
      stats: {
        hunger: 12,
        happiness: 18,
        energy: 12,
        cleanliness: 12
      }
    };
  }

  if (treasureCount >= 2) {
    return {
      id: "charm",
      title: "きらめくお守り",
      message: "宝物がお守りに変わって、元気がわいてきました。",
      stats: {
        happiness: 10,
        energy: 16
      }
    };
  }

  return {
    id: "snack",
    title: "ひみつのおやつ",
    message: "宝物の中から小さなおやつが出てきました。",
    stats: {
      hunger: 12,
      happiness: 8
    }
  };
};

export const useTreasure = (state, now = Date.now()) => {
  const treasures = normalizeTreasures(state.treasures);

  if (treasures.collected <= 0) {
    return { state, event: null };
  }

  const event = getTreasureEvent(treasures.collected);
  const nextStats = updateStats(state.stats, {
    hunger: state.stats.hunger + (event.stats.hunger ?? 0),
    happiness: state.stats.happiness + (event.stats.happiness ?? 0),
    energy: state.stats.energy + (event.stats.energy ?? 0),
    cleanliness: state.stats.cleanliness + (event.stats.cleanliness ?? 0)
  });

  return {
    state: {
      ...state,
      stats: nextStats,
      treasures: {
        ...treasures,
        collected: treasures.collected - 1
      },
      lastUpdatedAt: now
    },
    event
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
    treasures: awardTreasuresForCleanlinessDrop(state, stats),
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

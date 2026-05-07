import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  advanceTime,
  applyAction,
  collectTreasure,
  createInitialState,
  getGrowthProgress,
  getMood,
  useTreasure
} from "./logic.js";

describe("pet logic", () => {
  it("feeds the pet without exceeding the maximum stat value", () => {
    const state = createInitialState(1);
    const fed = applyAction(
      {
        ...state,
        stats: { ...state.stats, hunger: 95 }
      },
      "feed",
      2
    );

    assert.equal(fed.stats.hunger, 100);
    assert.equal(fed.lastUpdatedAt, 2);
  });

  it("ages the pet and advances its stage", () => {
    const state = createInitialState(1);
    const older = advanceTime(state, 35, 2);

    assert.equal(older.ageMinutes, 35);
    assert.equal(older.stage, "baby");
  });

  it("continues through the growth program", () => {
    const state = createInitialState(1);
    const older = advanceTime(state, 160, 2);
    const growth = getGrowthProgress(older);

    assert.equal(older.stage, "teen");
    assert.equal(growth.currentStage.id, "teen");
    assert.equal(growth.nextStage.id, "adult");
    assert.equal(growth.minutesToNext, 80);
  });

  it("reports completed growth for an adult pet", () => {
    const state = createInitialState(1);
    const adult = advanceTime(state, 240, 2);
    const growth = getGrowthProgress(adult);

    assert.equal(adult.stage, "adult");
    assert.equal(growth.nextStage, null);
    assert.equal(growth.progressPercent, 100);
  });

  it("reports hungry mood when hunger is low", () => {
    const state = createInitialState(1);
    const hungry = {
      ...state,
      stats: { ...state.stats, hunger: 20 }
    };

    assert.equal(getMood(hungry), "hungry");
  });

  it("creates treasure after 10 total cleanliness points are lost", () => {
    const state = createInitialState(1);
    const afterFeed = applyAction(state, "feed", 2);
    const afterSecondFeed = applyAction(afterFeed, "feed", 3);

    assert.equal(afterFeed.treasures.pending, 0);
    assert.equal(afterFeed.treasures.cleanlinessDropBuffer, 6);
    assert.equal(afterSecondFeed.treasures.pending, 1);
    assert.equal(afterSecondFeed.treasures.cleanlinessDropBuffer, 2);
  });

  it("combines cleanliness drops from play and time passing", () => {
    const state = createInitialState(1);
    const afterPlay = applyAction(state, "play", 2);
    const afterTime = advanceTime(afterPlay, 12, 3);

    assert.equal(afterPlay.treasures.pending, 0);
    assert.equal(afterPlay.treasures.cleanlinessDropBuffer, 8);
    assert.equal(afterTime.treasures.pending, 1);
    assert.equal(afterTime.treasures.cleanlinessDropBuffer, 0);
  });

  it("does not create treasure when cleaning increases cleanliness", () => {
    const state = {
      ...createInitialState(1),
      stats: { hunger: 72, happiness: 70, energy: 80, cleanliness: 50 },
      treasures: { pending: 0, collected: 0, cleanlinessDropBuffer: 8 }
    };
    const cleaned = applyAction(state, "clean", 2);

    assert.equal(cleaned.stats.cleanliness, 80);
    assert.equal(cleaned.treasures.pending, 0);
    assert.equal(cleaned.treasures.cleanlinessDropBuffer, 8);
  });

  it("uses actual clamped cleanliness loss for treasure progress", () => {
    const state = {
      ...createInitialState(1),
      stats: { hunger: 72, happiness: 70, energy: 80, cleanliness: 4 },
      treasures: { pending: 0, collected: 0, cleanlinessDropBuffer: 5 }
    };
    const played = applyAction(state, "play", 2);

    assert.equal(played.stats.cleanliness, 0);
    assert.equal(played.treasures.pending, 0);
    assert.equal(played.treasures.cleanlinessDropBuffer, 9);
  });

  it("collects pending treasure and restores cleanliness", () => {
    const state = {
      ...createInitialState(1),
      stats: { hunger: 72, happiness: 70, energy: 80, cleanliness: 98 },
      treasures: { pending: 2, collected: 4, cleanlinessDropBuffer: 3 }
    };
    const collected = collectTreasure(state, 2);

    assert.equal(collected.treasures.pending, 1);
    assert.equal(collected.treasures.collected, 5);
    assert.equal(collected.treasures.cleanlinessDropBuffer, 3);
    assert.equal(collected.stats.cleanliness, 100);
    assert.equal(collected.lastUpdatedAt, 2);
  });

  it("does not change state when collecting without pending treasure", () => {
    const state = createInitialState(1);

    assert.strictEqual(collectTreasure(state, 2), state);
  });

  it("uses one treasure for a small event", () => {
    const state = {
      ...createInitialState(1),
      stats: { hunger: 80, happiness: 70, energy: 80, cleanliness: 82 },
      treasures: { pending: 0, collected: 1, cleanlinessDropBuffer: 0 }
    };
    const result = useTreasure(state, 2);

    assert.equal(result.event.id, "snack");
    assert.equal(result.state.treasures.collected, 0);
    assert.equal(result.state.stats.hunger, 92);
    assert.equal(result.state.stats.happiness, 78);
    assert.equal(result.state.lastUpdatedAt, 2);
  });

  it("uses treasure count to choose a stronger event", () => {
    const state = {
      ...createInitialState(1),
      stats: { hunger: 92, happiness: 90, energy: 94, cleanliness: 96 },
      treasures: { pending: 0, collected: 5, cleanlinessDropBuffer: 0 }
    };
    const result = useTreasure(state, 2);

    assert.equal(result.event.id, "festival");
    assert.equal(result.state.treasures.collected, 4);
    assert.equal(result.state.stats.hunger, 100);
    assert.equal(result.state.stats.happiness, 100);
    assert.equal(result.state.stats.energy, 100);
    assert.equal(result.state.stats.cleanliness, 100);
  });

  it("does not use treasure when none are collected", () => {
    const state = createInitialState(1);
    const result = useTreasure(state, 2);

    assert.strictEqual(result.state, state);
    assert.equal(result.event, null);
  });
});

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { advanceTime, applyAction, createInitialState, getMood } from "./logic.js";

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

  it("reports hungry mood when hunger is low", () => {
    const state = createInitialState(1);
    const hungry = {
      ...state,
      stats: { ...state.stats, hunger: 20 }
    };

    assert.equal(getMood(hungry), "hungry");
  });
});


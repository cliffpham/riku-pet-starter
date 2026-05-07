import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { loadState, saveState } from "./storage.js";

const values = new Map();

beforeEach(() => {
  values.clear();
  globalThis.window = {
    localStorage: {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => values.delete(key)
    }
  };
});

describe("pet storage", () => {
  it("adds treasure defaults to older saved states", () => {
    values.set(
      "riku-pet-state",
      JSON.stringify({
        name: "Riku",
        stage: "kid",
        ageMinutes: 90,
        lastUpdatedAt: 1,
        stats: {
          hunger: 70,
          happiness: 71,
          energy: 72,
          cleanliness: 73
        }
      })
    );

    assert.deepEqual(loadState().treasures, {
      pending: 0,
      collected: 0,
      cleanlinessDropBuffer: 0
    });
  });

  it("persists treasure counts", () => {
    saveState({
      name: "Riku",
      stage: "egg",
      ageMinutes: 0,
      lastUpdatedAt: 1,
      stats: {
        hunger: 72,
        happiness: 70,
        energy: 80,
        cleanliness: 82
      },
      treasures: {
        pending: 2,
        collected: 7,
        cleanlinessDropBuffer: 4
      }
    });

    assert.deepEqual(JSON.parse(values.get("riku-pet-state")).treasures, {
      pending: 2,
      collected: 7,
      cleanlinessDropBuffer: 4
    });
  });
});


import { createInitialState } from "./logic.js";

const STORAGE_KEY = "riku-pet-state";

const isPetState = (value) => {
  if (!value || typeof value !== "object") return false;

  return (
    typeof value.name === "string" &&
    typeof value.ageMinutes === "number" &&
    typeof value.lastUpdatedAt === "number" &&
    typeof value.stats?.hunger === "number" &&
    typeof value.stats?.happiness === "number" &&
    typeof value.stats?.energy === "number" &&
    typeof value.stats?.cleanliness === "number"
  );
};

export const loadState = () => {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return createInitialState();

  try {
    const parsed = JSON.parse(saved);
    return isPetState(parsed) ? parsed : createInitialState();
  } catch {
    return createInitialState();
  }
};

export const saveState = (state) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const clearState = () => {
  window.localStorage.removeItem(STORAGE_KEY);
};


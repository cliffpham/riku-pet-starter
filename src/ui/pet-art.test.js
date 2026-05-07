import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { getPetArt, PET_ART_MOODS, PET_ART_STAGES } from "./pet-art.js";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

describe("pet art", () => {
  it("resolves art for every growth stage and mood", () => {
    const resolved = [];

    for (const stage of PET_ART_STAGES) {
      for (const mood of PET_ART_MOODS) {
        const art = getPetArt(stage, mood);
        resolved.push(art.src);

        assert.equal(art.src, `public/pets/${stage}-${mood}.svg`);
        assert.match(art.alt, /宇宙ペット/);
      }
    }

    assert.equal(resolved.length, 25);
  });

  it("points every supported art path at an existing svg file", () => {
    for (const stage of PET_ART_STAGES) {
      for (const mood of PET_ART_MOODS) {
        const art = getPetArt(stage, mood);
        const absolutePath = join(projectRoot, art.src);

        assert.equal(existsSync(absolutePath), true, `${art.src} should exist`);
      }
    }
  });

  it("falls back to the calm egg for unknown art requests", () => {
    assert.deepEqual(getPetArt("space", "sparkly"), {
      src: "public/pets/egg-okay.svg",
      alt: "たまご段階の落ち着いた宇宙ペット"
    });

    assert.deepEqual(getPetArt("adult", "sparkly"), {
      src: "public/pets/egg-okay.svg",
      alt: "たまご段階の落ち着いた宇宙ペット"
    });
  });
});


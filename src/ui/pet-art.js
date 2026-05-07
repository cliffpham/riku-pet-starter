export const PET_ART_STAGES = ["egg", "baby", "kid", "teen", "adult"];
export const PET_ART_MOODS = ["happy", "okay", "tired", "messy", "hungry"];

const DEFAULT_STAGE = "egg";
const DEFAULT_MOOD = "okay";

const stageLabels = {
  egg: "たまご",
  baby: "ベビー",
  kid: "キッズ",
  teen: "ジュニア",
  adult: "おとな"
};

const moodLabels = {
  happy: "ごきげん",
  okay: "落ち着いた",
  tired: "眠そうな",
  messy: "汚れた",
  hungry: "おなかが空いた"
};

const validStages = new Set(PET_ART_STAGES);
const validMoods = new Set(PET_ART_MOODS);

const buildPetArt = (stage, mood) => ({
  src: `public/pets/${stage}-${mood}.svg`,
  alt: `${stageLabels[stage]}段階の${moodLabels[mood]}宇宙ペット`
});

export const getPetArt = (stage, mood) => {
  if (!validStages.has(stage) || !validMoods.has(mood)) {
    return buildPetArt(DEFAULT_STAGE, DEFAULT_MOOD);
  }

  return buildPetArt(stage, mood);
};


import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outDir = join(process.cwd(), "public", "pets");

const stages = {
  egg: {
    label: "egg pod",
    scale: 0.93,
    body: `
      <path class="body" d="M128 34c39 0 78 61 78 114 0 47-31 76-78 76s-78-29-78-76c0-53 39-114 78-114Z"/>
      <path class="shine" d="M79 137c0-33 22-78 49-87 26 9 49 54 49 87 0 31-20 51-49 51s-49-20-49-51Z"/>
      <path class="panel" d="M81 177c20 16 73 16 94 0"/>
    `,
    details: `
      <path class="antenna" d="M128 36v-18"/>
      <circle class="antenna-dot" cx="128" cy="16" r="9"/>
    `,
    feet: ""
  },
  baby: {
    label: "baby alien",
    scale: 0.82,
    body: `
      <ellipse class="body" cx="128" cy="130" rx="60" ry="64"/>
      <path class="belly" d="M86 149c11 30 73 30 84 0 4 35-17 61-42 61s-46-26-42-61Z"/>
      <path class="shell" d="M88 188l19 16 20-15 20 15 21-16v34H88Z"/>
    `,
    details: `
      <path class="antenna" d="M113 72c2-18 18-27 34-19"/>
      <circle class="antenna-dot" cx="151" cy="54" r="8"/>
    `,
    feet: `
      <ellipse class="foot" cx="102" cy="217" rx="17" ry="9"/>
      <ellipse class="foot" cx="154" cy="217" rx="17" ry="9"/>
    `
  },
  kid: {
    label: "kid alien",
    scale: 0.94,
    body: `
      <ellipse class="body" cx="128" cy="126" rx="62" ry="68"/>
      <path class="belly" d="M89 146c15 34 63 34 78 0 6 39-13 67-39 67s-45-28-39-67Z"/>
      <path class="collar" d="M92 101c19 13 53 13 72 0"/>
    `,
    details: `
      <path class="antenna" d="M107 70c-1-22 18-34 38-25"/>
      <path class="antenna" d="M149 70c4-20 25-25 39-12"/>
      <circle class="antenna-dot" cx="145" cy="45" r="8"/>
      <circle class="antenna-dot" cx="190" cy="60" r="7"/>
    `,
    feet: `
      <path class="foot" d="M91 212c15 10 31 10 45 0"/>
      <path class="foot" d="M122 212c15 10 31 10 45 0"/>
    `
  },
  teen: {
    label: "junior alien",
    scale: 1,
    body: `
      <path class="body" d="M128 54c39 0 64 35 64 82 0 55-24 86-64 86s-64-31-64-86c0-47 25-82 64-82Z"/>
      <path class="belly" d="M91 142c13 41 61 47 74 0 9 48-7 74-37 74s-46-26-37-74Z"/>
      <path class="collar" d="M86 103c20 18 64 18 84 0l-12 24H98Z"/>
    `,
    details: `
      <path class="antenna" d="M102 62c-5-26 12-42 37-35"/>
      <path class="antenna" d="M151 62c8-25 30-31 48-16"/>
      <circle class="antenna-dot" cx="139" cy="29" r="9"/>
      <circle class="antenna-dot" cx="199" cy="47" r="8"/>
    `,
    feet: `
      <path class="boot" d="M83 217c17 15 40 15 54 0v14H84Z"/>
      <path class="boot" d="M119 217c17 15 40 15 54 0v14h-53Z"/>
    `
  },
  adult: {
    label: "adult alien",
    scale: 1.04,
    body: `
      <ellipse class="orbit" cx="128" cy="145" rx="92" ry="30"/>
      <path class="body" d="M128 48c43 0 72 36 72 86 0 57-27 92-72 92s-72-35-72-92c0-50 29-86 72-86Z"/>
      <path class="belly" d="M84 142c18 51 70 51 88 0 8 53-9 80-44 80s-52-27-44-80Z"/>
      <path class="collar" d="M83 106c27 22 63 22 90 0l-11 25H94Z"/>
    `,
    details: `
      <path class="antenna" d="M98 58c-8-30 15-50 45-40"/>
      <path class="antenna" d="M154 58c12-29 42-33 59-11"/>
      <circle class="antenna-dot" cx="143" cy="20" r="10"/>
      <circle class="antenna-dot" cx="214" cy="48" r="9"/>
    `,
    feet: `
      <path class="boot" d="M78 218c19 17 45 17 61 0v14H80Z"/>
      <path class="boot" d="M117 218c19 17 45 17 61 0v14h-59Z"/>
    `
  }
};

const moods = {
  happy: {
    label: "happy",
    transform: "translate(0 -8) rotate(-3 128 142)",
    arms: ["M83 136c-24-16-29-35-12-45", "M173 136c24-16 29-35 12-45"],
    eyes: `
      <path class="eye" d="M99 122c8-11 21-11 29 0"/>
      <path class="eye" d="M128 122c8-11 21-11 29 0"/>
    `,
    mouth: `<path class="mouth" d="M108 147c10 15 30 15 40 0"/>`,
    accent: `
      <path class="spark" d="M48 76l8-16 8 16 16 8-16 8-8 16-8-16-16-8Z"/>
      <path class="spark" d="M202 94l5-10 5 10 10 5-10 5-5 10-5-10-10-5Z"/>
    `
  },
  okay: {
    label: "calm",
    transform: "translate(0 0)",
    arms: ["M82 139c-19 5-27 16-29 30", "M174 139c19 5 27 16 29 30"],
    eyes: `
      <circle class="eye-fill" cx="104" cy="123" r="10"/>
      <circle class="eye-fill" cx="152" cy="123" r="10"/>
    `,
    mouth: `<path class="mouth" d="M113 148c8 8 22 8 30 0"/>`,
    accent: ""
  },
  tired: {
    label: "sleepy",
    transform: "translate(0 11) rotate(-5 128 152)",
    arms: ["M82 143c-18 14-23 31-14 43", "M174 143c18 14 23 31 14 43"],
    eyes: `
      <path class="eye" d="M96 124h24"/>
      <path class="eye" d="M136 124h24"/>
    `,
    mouth: `<path class="mouth" d="M115 154c8 4 18 4 26 0"/>`,
    accent: `
      <text class="sleep" x="186" y="76">z</text>
      <text class="sleep sleep-large" x="204" y="57">Z</text>
    `
  },
  messy: {
    label: "messy",
    transform: "translate(0 5) rotate(7 128 143)",
    arms: ["M84 137c-23 1-35 13-35 30", "M174 137c20-7 34 1 42 18"],
    eyes: `
      <circle class="eye-fill" cx="103" cy="124" r="9"/>
      <path class="eye" d="M138 120l21 12M159 120l-21 12"/>
    `,
    mouth: `<path class="mouth" d="M113 155c8-9 22-9 30 0"/>`,
    accent: `
      <circle class="dirt" cx="78" cy="97" r="7"/>
      <circle class="dirt" cx="176" cy="165" r="6"/>
      <path class="dirt-line" d="M69 132l22 10M185 98l15 17"/>
    `
  },
  hungry: {
    label: "hungry",
    transform: "translate(0 4) rotate(2 128 144)",
    arms: ["M84 140c15 23 27 29 44 22", "M172 140c-15 23-27 29-44 22"],
    eyes: `
      <circle class="eye-fill" cx="103" cy="121" r="12"/>
      <circle class="eye-fill" cx="153" cy="121" r="12"/>
      <circle class="eye-glint" cx="107" cy="116" r="4"/>
      <circle class="eye-glint" cx="157" cy="116" r="4"/>
    `,
    mouth: `<ellipse class="open-mouth" cx="128" cy="153" rx="12" ry="15"/>`,
    accent: `
      <path class="snack" d="M196 80c14 2 24 16 20 30-11 4-27-2-34-14 2-10 6-15 14-16Z"/>
      <path class="snack-mark" d="M193 88l14 13"/>
    `
  }
};

const stageNames = Object.keys(stages);
const moodNames = Object.keys(moods);

const limbScale = {
  egg: 0.58,
  baby: 0.75,
  kid: 0.9,
  teen: 1,
  adult: 1.05
};

const armsFor = (stageName, mood) => {
  const [left, right] = mood.arms;
  const scale = limbScale[stageName];
  const opacity = stageName === "egg" ? "0.55" : "1";

  return `
    <g transform="translate(${128 - 128 * scale} ${142 - 142 * scale}) scale(${scale})" opacity="${opacity}">
      <path class="arm" d="${left}"/>
      <path class="arm" d="${right}"/>
    </g>
  `;
};

const eggMoodDetails = (moodName) => {
  if (moodName === "happy") {
    return `<path class="crack-light" d="M107 88l13 12-8 12 16 13"/>`;
  }
  if (moodName === "tired") {
    return `<path class="sleep-tilt" d="M118 50c6-10 20-10 26 0"/>`;
  }
  if (moodName === "messy") {
    return `<path class="crack" d="M115 73l16 17-10 13 18 20-12 17"/>`;
  }
  if (moodName === "hungry") {
    return `<path class="belly-rumble" d="M104 172c14-10 34 10 48 0"/>`;
  }
  return `<path class="crack-light" d="M105 91l14 13-7 10"/>`;
};

const svgFor = (stageName, moodName) => {
  const stage = stages[stageName];
  const mood = moods[moodName];
  const bodyTransform = `${mood.transform} scale(${stage.scale}) translate(${(128 / stage.scale) - 128} ${(138 / stage.scale) - 138})`;

  return `<svg width="256" height="256" viewBox="0 0 256 256" role="img" aria-labelledby="title desc" xmlns="http://www.w3.org/2000/svg">
  <title id="title">${stage.label} ${mood.label}</title>
  <desc id="desc">A cute alien virtual pet in the ${stageName} growth stage with a ${moodName} mood.</desc>
  <defs>
    <linearGradient id="skin" x1="72" x2="188" y1="54" y2="224" gradientUnits="userSpaceOnUse">
      <stop stop-color="#d9fff2"/>
      <stop offset=".52" stop-color="#8fd9c8"/>
      <stop offset="1" stop-color="#3e9f94"/>
    </linearGradient>
    <linearGradient id="warm" x1="70" x2="182" y1="70" y2="224" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fff7da"/>
      <stop offset="1" stop-color="#e8b956"/>
    </linearGradient>
  </defs>
  <style>
    .body{fill:url(#skin);stroke:#473a22;stroke-width:8;stroke-linejoin:round}
    .belly,.shine{fill:#f7fff1;opacity:.52}
    .panel,.collar,.shell{fill:url(#warm);stroke:#473a22;stroke-width:6;stroke-linejoin:round}
    .antenna,.arm,.foot,.boot{fill:none;stroke:#473a22;stroke-width:8;stroke-linecap:round;stroke-linejoin:round}
    .antenna-dot,.cheek{fill:#e97972;stroke:#473a22;stroke-width:6}
    .eye,.mouth{fill:none;stroke:#2f2b26;stroke-width:7;stroke-linecap:round;stroke-linejoin:round}
    .eye-fill{fill:#2f2b26}
    .eye-glint{fill:#fffdf8}
    .open-mouth{fill:#2f2b26}
    .orbit{fill:none;stroke:#d98247;stroke-width:7;opacity:.55}
    .spark,.snack{fill:#f3d984;stroke:#473a22;stroke-width:5;stroke-linejoin:round}
    .snack-mark,.dirt-line,.crack,.crack-light,.sleep-tilt,.belly-rumble{fill:none;stroke:#473a22;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}
    .crack-light{opacity:.35}
    .dirt{fill:#6f675c;opacity:.75}
    .sleep{font:700 24px system-ui,sans-serif;fill:#6f675c}
    .sleep-large{font-size:34px}
  </style>
  <g class="pet" transform="${bodyTransform}">
    ${armsFor(stageName, mood)}
    ${stage.details}
    ${stage.body}
    ${stageName === "egg" ? eggMoodDetails(moodName) : ""}
    ${mood.eyes}
    ${mood.mouth}
    <circle class="cheek" cx="84" cy="147" r="10" opacity=".65"/>
    <circle class="cheek" cx="172" cy="147" r="10" opacity=".65"/>
    ${stage.feet}
  </g>
  ${mood.accent}
</svg>
`;
};

await mkdir(outDir, { recursive: true });

for (const stageName of stageNames) {
  for (const moodName of moodNames) {
    await writeFile(
      join(outDir, `${stageName}-${moodName}.svg`),
      svgFor(stageName, moodName),
      "utf8"
    );
  }
}

console.log(`Generated ${stageNames.length * moodNames.length} pet SVG files.`);


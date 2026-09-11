// Imports the Funded Traders showcase photos. The first batch (Lonewolf,
// Owo, Red, Zach) were pre-made circular avatar art (square canvas, art
// already inscribed in a circle) — a plain centred square resize was enough
// for those, no crop needed. aoii_kaoo and lowkey_per_keylow are a real
// photo and a portrait illustration respectively, framed off-centre, so they
// use sharp's saliency-based `attention` crop (same default the team-photos
// script uses) instead of a plain centre crop.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(import.meta.dirname, "..");
const SRC = process.argv[2] || path.join(ROOT, "tmp-funded");
const OUT = path.join(ROOT, "public/images/funded-traders");

// Sized past 2x the largest on-page display size (260px circle), matching
// the headroom convention used for team photos and the placeholder art.
const SIZE = 640;

const MAP = [
  ["Lonewolf.png", "lonewolf", "centre"],
  ["Nostalgia22.png", "nostalgia22", "centre"],
  ["Red.png", "red", "centre"],
  ["Shizue.png", "shizue", "centre"],
  ["Zach.png", "zach", "centre"],
  ["Derrice.png", "derrice", "centre"],
  ["Owo.png", "owo", "centre"],
  ["aoii_kaoo.png", "aoii_kaoo", "attention"],
  ["lowkey_per_keylow.png", "lowkey_per_keylow", "attention"],
];

fs.mkdirSync(OUT, { recursive: true });

(async () => {
  let done = 0;
  for (const [file, slug, position] of MAP) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) continue;

    const dst = path.join(OUT, slug + ".webp");
    await sharp(src)
      .rotate()
      .resize({
        width: SIZE,
        height: SIZE,
        fit: "cover",
        position: position === "attention" ? sharp.strategy.attention : "centre",
      })
      .webp({ quality: 88 })
      .toFile(dst);

    console.log(slug.padEnd(22) + position.padEnd(11) + (fs.statSync(dst).size / 1024).toFixed(0) + "KB");
    done++;
  }
  console.log("\n" + done + " photo(s) processed");
})();

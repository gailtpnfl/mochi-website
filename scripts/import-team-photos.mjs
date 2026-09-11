/**
 * Imports the Core Team headshots into public/images/team.
 *
 *   node scripts/import-team-photos.js [sourceDir]
 *
 * Source files are named by Discord handle; the slugs below are person names
 * (see 1/uploads/Mentors.xlsx for the handle -> real name mapping). Originals
 * total ~11MB and are up to 1402px tall; the largest slot on the page is
 * 340x420 CSS px, so everything is cropped to its slot's aspect (sized past
 * 2x — see the SLOT comment above for why) and re-encoded to WebP.
 *
 * Cropping: most sources frame well with sharp's `attention` strategy. Four do
 * not, and carry an explicit face box instead (source pixels, read off a 10%
 * grid overlay of the original):
 *   - plasma pogi  — bright red wall + logo outscores the face on saliency
 *   - chekwah, ricoswabe, Gure — full/three-quarter body, head is a small part
 *     of the frame, so a centre crop leaves the face tiny
 *
 * Re-run after replacing a source file. Photos are wired up in
 * src/data/coreTeam.ts via each member's `photo` field.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(import.meta.dirname, "..");
const SRC = process.argv[2] || path.join(os.homedir(), "Downloads", "Pic");
const OUT = path.join(ROOT, "public/images/team");

/**
 * Slot aspects. Sized past 2x so next/image's 3x (high-DPI) srcset entry
 * never has to upscale the source — that upscaling is what read as "low res
 * on a bigger screen" (a big external display is often also high-DPI).
 */
const SLOT = {
  founder: { w: 680, h: 840 }, // 340x420 rounded tile
  circle: { w: 340, h: 340 }, // 96px leadership and 120px moderator circles
  mentor: { w: 1000, h: 789 }, // ~380x300 portrait tile — matches the widest face-box crop in use
};

const MAP = [
  ["Bigdaddydaks.jpg", "christer-saromines", "founder", null],
  ["patatas_gray_bg.png", "abegail-penafiel", "circle", null],
  ["Gab.jpg", "jose-fornier", "circle", null],
  // Half body, centred. The mentor tile is landscape (1.27:1) against a tall
  // portrait source, so the crop is width-limited. He sits slightly right of
  // the source's centre, so the band is pulled in to 1000px and offset to put
  // him on the tile's centre line rather than using the full width.
  ["Tope.png", "christopher-dela-cruz", "mentor", { left: 86, top: 297, width: 1000, height: 789 }],
  ["MADZ.png", "mohammad-lampa", "circle", null],
  ["Shawnny.png", "shawn-gonzales", "circle", null],

  // Div Anthony Boy Ragsac (@Ryzen), the second trading mentor. Source is a
  // near-square (798x799) headshot against a plain wall, subject and face
  // both dead centre and clearly the most salient thing in frame — attention
  // crop (box: null) lands well without needing a manual box.
  ["div-anthony.png", "div-ragsac", "mentor", null],

  // Full frame, uncropped — the source is already a square, straight-on,
  // centred headshot, so there is nothing to crop toward.
  ["dDddd.png", "daniel-custodio", "circle", null],

  // Half body (head to waist), centred on the subject.
  // left pulled back from 112 so she sits further right in the frame — her face
  // was landing left of the circle's centre line.
  ["Gure.jpg", "grace-tomaneng", "circle", { left: 78, top: 20, width: 280, height: 280 }],
  ["chekwah.jpg", "mark-mariano", "circle", { left: 114, top: 102, width: 564, height: 564 }],
  ["ricoswabe.proedit.png", "rico-ramirez", "circle", { left: 48, top: 0, width: 817, height: 817 }],

  ["plasma pogi.png", "john-eric-obog", "circle", { left: 407, top: 0, width: 420, height: 420 }],
];

fs.mkdirSync(OUT, { recursive: true });

(async () => {
  let total = 0;
  let missing = 0;

  for (const [file, slug, slot, box] of MAP) {
    const src = path.join(SRC, file);
    if (!fs.existsSync(src)) {
      console.log("MISSING SOURCE  " + file);
      missing++;
      continue;
    }

    const { w, h } = SLOT[slot];
    // flatten first: a transparent source would let the page colour show
    // through the circle instead of a photo.
    let pipe = sharp(src).rotate().flatten({ background: "#f6f4ef" });

    if (box) {
      const meta = await sharp(src).rotate().metadata();
      const left = Math.max(0, Math.min(box.left, meta.width - 1));
      const top = Math.max(0, Math.min(box.top, meta.height - 1));
      pipe = pipe.extract({
        left,
        top,
        width: Math.min(box.width, meta.width - left),
        height: Math.min(box.height, meta.height - top),
      });
    }

    const dst = path.join(OUT, slug + ".webp");
    await pipe
      .resize({
        width: w,
        height: h,
        fit: "cover",
        position: box ? "centre" : sharp.strategy.attention,
      })
      .webp({ quality: 84 })
      .toFile(dst);

    const size = fs.statSync(dst).size;
    total += size;
    console.log(
      slug.padEnd(24) + slot.padEnd(9) + (box ? "face-box" : "attention").padEnd(11) +
        (size / 1024).toFixed(0) + "KB",
    );
  }

  console.log("\n" + (MAP.length - missing) + " photos, " + (total / 1024).toFixed(0) + "KB total");
  if (missing) console.log(missing + " source(s) missing — pass the source dir as argv[2]");
})();

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = "public/static/images";
const MAX_WIDTH = 1600;

const isInput = (p) => /\.(png|jpe?g)$/i.test(p);

const optimizeOne = async (inputPath) => {
    const base = inputPath.replace(/\.(png|jpe?g)$/i, "");
    const webpOut = `${base}.webp`;
    const avifOut = `${base}.avif`;

    const img = sharp(inputPath, { failOn: "none" });
    const meta = await img.metadata();

    // Avoid enlarging
    const resize =
        meta.width && meta.width > MAX_WIDTH
            ? { width: MAX_WIDTH }
            : undefined;

    const statOrNull = async (p) => {
        try { return await fs.stat(p); } catch { return null; }
    };

    const inputStat = await fs.stat(inputPath);
    const webpStat = await statOrNull(webpOut);
    const avifStat = await statOrNull(avifOut);

    const webpUpToDate = webpStat && webpStat.mtimeMs >= inputStat.mtimeMs;
    const avifUpToDate = avifStat && avifStat.mtimeMs >= inputStat.mtimeMs;

    if (webpUpToDate && avifUpToDate) {
        console.log(`↷ up-to-date: ${path.relative(process.cwd(), inputPath)}`);
        return;
    }

    await img.clone()
        .resize(resize)
        .webp({ quality: 75 })
        .toFile(webpOut);

    await img.clone()
        .resize(resize)
        .avif({ quality: 45 })
        .toFile(avifOut);

    console.log(
        `✓ ${path.relative(process.cwd(), inputPath)} -> ${path.basename(webpOut)}, ${path.basename(avifOut)}`
    );
};

const run = async () => {
    const all = await fs.readdir(ROOT, { recursive: true });
    const inputs = all.filter(isInput).map((p) => path.join(ROOT, p));

    if (inputs.length === 0) {
        console.log(`No png/jpg/jpeg files found under ${ROOT}`);
        return;
    }

    for (const file of inputs) {
        await optimizeOne(file);
    }

    console.log(`Done. Optimised ${inputs.length} images.`);
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
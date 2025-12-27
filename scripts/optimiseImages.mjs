import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = "public/static/images";
const MAX_WIDTH = 1600;

const walk = async (dir) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (e) => {
        const p = path.join(dir, e.name);
        return e.isDirectory() ? walk(p) : p;
    }));
    return files.flat();
};

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

    await sharp(inputPath, { failOn: "none" })
        .resize(resize)
        .webp({ quality: 75 })
        .toFile(webpOut);

    await sharp(inputPath, { failOn: "none" })
        .resize(resize)
        .avif({ quality: 45 })
        .toFile(avifOut);

    console.log(
        `✓ ${path.relative(process.cwd(), inputPath)} -> ${path.basename(webpOut)}, ${path.basename(avifOut)}`
    );
};

const run = async () => {
    const all = await walk(ROOT);
    const inputs = all.filter(isInput);

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
import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Recursively find all files matching patterns
function findFiles(dir, extensions) {
  const files = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findFiles(fullPath, extensions));
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  } catch (err) {
    // Ignore errors (e.g., node_modules)
  }
  return files;
}

// Find all image references in source files
function findImageReferences() {
  const srcDir = join(rootDir, 'src');
  const extensions = ['.astro', '.mdx', '.ts', '.tsx', '.js', '.jsx', '.json'];
  const allFiles = findFiles(srcDir, extensions);

  const imageRefs = new Set();
  const files = [];

  for (const filePath of allFiles) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const relativePath = filePath.replace(rootDir + '/', '');
      
      // Match various image path patterns
      const regex = /["'](\/static\/images\/[^"']+\.(png|jpg|jpeg))["']/gi;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const imagePath = match[1];
        imageRefs.add(imagePath);
        files.push({ file: relativePath, imagePath });
      }
    } catch (err) {
      // Skip files that can't be read
    }
  }

  return { imageRefs: Array.from(imageRefs), files };
}

// Check if AVIF and WebP versions exist
function checkFormats(imagePath) {
  const publicPath = join(rootDir, 'public', imagePath);
  const basePath = publicPath.replace(/\.(png|jpg|jpeg)$/i, '');
  
  const avifPath = `${basePath}.avif`;
  const webpPath = `${basePath}.webp`;
  
  return {
    original: existsSync(publicPath),
    avif: existsSync(avifPath),
    webp: existsSync(webpPath),
  };
}

async function main() {
  console.log('Checking image formats...\n');
  
  const { imageRefs, files } = await findImageReferences();
  const results = {
    migrated: [],
    skipped: [],
    missing: [],
  };

  for (const imagePath of imageRefs) {
    const formats = checkFormats(imagePath);
    
    if (!formats.original) {
      results.missing.push(imagePath);
      continue;
    }

    if (formats.avif && formats.webp) {
      results.migrated.push(imagePath);
    } else {
      results.skipped.push({
        path: imagePath,
        missingAvif: !formats.avif,
        missingWebp: !formats.webp,
      });
    }
  }

  console.log('=== SUMMARY ===\n');
  console.log(`Total images found: ${imageRefs.length}`);
  console.log(`Images migrated (have AVIF + WebP): ${results.migrated.length}`);
  console.log(`Images skipped (missing formats): ${results.skipped.length}`);
  console.log(`Images missing original: ${results.missing.length}\n`);

  if (results.skipped.length > 0) {
    console.log('=== SKIPPED IMAGES (missing AVIF/WebP) ===');
    results.skipped.forEach(({ path, missingAvif, missingWebp }) => {
      const missing = [];
      if (missingAvif) missing.push('AVIF');
      if (missingWebp) missing.push('WebP');
      console.log(`  ${path} - Missing: ${missing.join(', ')}`);
    });
    console.log();
  }

  if (results.missing.length > 0) {
    console.log('=== MISSING ORIGINAL IMAGES ===');
    results.missing.forEach(path => {
      console.log(`  ${path}`);
    });
    console.log();
  }

  // Get unique files that reference images
  const filesWithImages = [...new Set(files.map(f => f.file))];
  console.log('=== FILES WITH IMAGE REFERENCES ===');
  console.log(`Total files: ${filesWithImages.length}`);
  filesWithImages.forEach(file => {
    console.log(`  ${file}`);
  });

  return results;
}

main().catch(console.error);


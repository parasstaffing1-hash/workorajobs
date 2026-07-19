const fs = require("node:fs/promises");
const path = require("node:path");
const sharp = require("sharp");

const publicDirectory = path.join(process.cwd(), "public");
const sourcePath = path.join(publicDirectory, "workora-jobs-logo.png");

const pngTargets = [
  [16, "favicon-16x16.png"],
  [32, "favicon-32x32.png"],
  [48, "favicon-48x48.png"],
  [96, "favicon-96x96.png"],
  [180, "apple-touch-icon.png"],
  [192, "android-chrome-192x192.png"],
  [512, "android-chrome-512x512.png"],
];

function createIco(images) {
  const directorySize = 6 + images.length * 16;
  const header = Buffer.alloc(directorySize);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = directorySize;

  images.forEach(({ buffer, size }, index) => {
    const entryOffset = 6 + index * 16;
    header.writeUInt8(size === 256 ? 0 : size, entryOffset);
    header.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);
    header.writeUInt8(0, entryOffset + 2);
    header.writeUInt8(0, entryOffset + 3);
    header.writeUInt16LE(1, entryOffset + 4);
    header.writeUInt16LE(32, entryOffset + 6);
    header.writeUInt32LE(buffer.length, entryOffset + 8);
    header.writeUInt32LE(offset, entryOffset + 12);
    offset += buffer.length;
  });

  return Buffer.concat([header, ...images.map(({ buffer }) => buffer)]);
}

async function renderPng(size, fileName) {
  const buffer = await sharp(sourcePath)
    .resize(size, size, {
      fit: "fill",
      kernel: sharp.kernel.lanczos3,
    })
    .png({ adaptiveFiltering: true, compressionLevel: 9 })
    .toBuffer();

  await fs.writeFile(path.join(publicDirectory, fileName), buffer);
  return { buffer, size };
}

async function main() {
  const metadata = await sharp(sourcePath).metadata();

  if (!metadata.width || metadata.width !== metadata.height) {
    throw new Error("The Workora Jobs logo must be a square image.");
  }

  const rendered = await Promise.all(
    pngTargets.map(([size, fileName]) => renderPng(size, fileName)),
  );
  const icoImages = rendered.filter(({ size }) => [16, 32, 48].includes(size));

  await fs.writeFile(
    path.join(publicDirectory, "favicon.ico"),
    createIco(icoImages),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

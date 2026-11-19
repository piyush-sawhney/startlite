import { createHash, randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const MEDIA_ROOT = path.resolve(
  /*turbopackIgnore: true*/ process.env.MEDIA_ROOT ?? "./.data/media",
);

export const VARIANTS = [320, 640, 1280] as const;

export type StoredMedia = {
  key: string;
  width: number;
  height: number;
  bytes: number;
  checksum: string;
  variants: Record<string, string>;
  mime: string;
};

function safeKey(key: string): string {
  const clean = key.replace(/\\/g, "/");
  if (clean.includes("..") || clean.startsWith("/")) {
    throw new Error("Invalid media key");
  }
  return clean;
}

export function mediaPath(key: string): string {
  return path.join(/*turbopackIgnore: true*/ MEDIA_ROOT, safeKey(key));
}

export async function storeImage(
  businessId: string,
  kind: string,
  input: Buffer,
): Promise<StoredMedia> {
  const image = sharp(input, { failOn: "error" });
  const metadata = await image.metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error("Unreadable image");
  }

  const id = randomUUID();
  const base = `${businessId}/${kind}/${id}`;
  const key = `${base}/original.webp`;

  const original = await image
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });

  await mkdir(path.dirname(mediaPath(key)), { recursive: true });
  await writeFile(mediaPath(key), original.data);

  const variants: Record<string, string> = {};
  for (const width of VARIANTS) {
    if (width > original.info.width) continue;
    const variantKey = `${base}/${width}.webp`;
    const data = await sharp(original.data)
      .resize({ width })
      .webp({ quality: 80 })
      .toBuffer();
    await writeFile(mediaPath(variantKey), data);
    variants[String(width)] = variantKey;
  }

  return {
    key,
    width: original.info.width,
    height: original.info.height,
    bytes: original.data.byteLength,
    checksum: createHash("sha256").update(original.data).digest("hex"),
    variants,
    mime: "image/webp",
  };
}

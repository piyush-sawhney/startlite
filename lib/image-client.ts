export async function uploadImageFile(
  file: File,
): Promise<{ key: string } | { error: string }> {
  try {
    const blob = await resizeImage(file);
    const body = new FormData();
    body.append("file", blob, "item.webp");
    const response = await fetch("/api/v1/merchant/media", {
      method: "POST",
      body,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      return {
        error: payload?.error?.message ?? "Image not uploaded. Try again.",
      };
    }
    return { key: payload.data.key };
  } catch {
    return { error: "Image not uploaded. Try a smaller photo." };
  }
}

async function resizeImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("No image"))),
      "image/webp",
      0.82,
    );
  });
}

import cloudinary from "@/lib/cloudinary";

export async function deleteCloudinaryImages(publicIds = []) {
  if (!Array.isArray(publicIds) || publicIds.length === 0) return;

  try {
    await cloudinary.api.delete_resources(publicIds, {
      resource_type: "image",
      invalidate: true,
    });
  } catch (err) {
    console.error("Cloudinary delete error:", err);
  }
}

export function getRemovedImages(oldImages = [], newImages = []) {
  const newSet = new Set(newImages.map((i) => i.public_id));

  return oldImages
    .filter((img) => !newSet.has(img.public_id))
    .map((img) => img.public_id);
}


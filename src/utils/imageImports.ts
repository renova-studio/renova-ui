// utils/imageImports.ts
// Simplified: category + name come from the filename, not folder structure

export type ImageEntry = { default: string; originalName: string };

export async function getImages(): Promise<Record<string, ImageEntry>> {
  const images: Record<string, ImageEntry> = {};

  try {
    // Import all images inside assets/materials
    const imageModules = import.meta.glob(
      "../assets/materials/**/*.{png,jpg,jpeg,webp,svg}",
      { eager: true }
    );

    Object.entries(imageModules).forEach(([path, module]) => {
      const fileName = path.split("/").pop() || "";            // "Brick_ConcretePavers.jpg"
      const noExt = fileName.replace(/\.[^/.]+$/, "");         // "Brick_ConcretePavers"
      images[noExt] = {
        default: (module as any).default || (module as string),
        originalName: fileName,
      };
    });
  } catch (err) {
    console.error("Error loading materials:", err);
  }

  return images;
}

// Create a type for our image module
interface ImageModule {
  [key: string]: {
    default: string;
    originalName: string;
  };
}

// Add type declarations for webpack's require.context
declare const require: {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ): {
    keys(): string[];
    (key: string): { default: string };
  };
};

interface ImageInfo {
  path: string;
  module: { default: string } | string;
}

export async function getImages() {
  const images: ImageModule = {};
  const categories = ['marble', 'metal', 'stone', 'terrazzo', 'wood'];

  try {
    // Import all images using webpack's require
    const context = (require as any).context('../assets/materials', true, /\.(png|jpe?g|svg)$/);
    const keys = context.keys();

    keys.forEach((key: string) => {
      const pathParts = key.split('/');
      const category = pathParts[1];
      const filename = pathParts[pathParts.length - 1].split('.')[0]; // Get name without extension
      
      if (categories.includes(category)) {
        // Use a more readable key format: category/filename
        const readableKey = `${category}/${filename}`;
        images[readableKey] = { 
          default: context(key),
          originalName: filename.replace(/-/g, ' ') // Replace hyphens with spaces
        };
      }
    });
  } catch (error) {
    console.error('Error loading materials:', error);
  }

  return images;
} 
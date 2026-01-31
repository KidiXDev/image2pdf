import { create } from 'zustand';

export interface ImageItem {
  src: string;
  name: string;
}

interface ImageState {
  images: ImageItem[];
  compressedImages: ImageItem[];
  imageIsInputed: boolean;
  
  // Actions
  setImages: (images: ImageItem[]) => void;
  setCompressedImages: (images: ImageItem[]) => void;
  addImages: (images: ImageItem[], compressedImages: ImageItem[]) => void;
  reorderImages: (fromIndex: number, toIndex: number) => void;
  deleteImage: (index: number) => void;
  moveToTop: (index: number) => void;
  moveToBottom: (index: number) => void;
  clearAll: () => void;
  setImageIsInputed: (value: boolean) => void;
}

// Helper function to find matching image with proper null handling
const findMatchingImage = (images: ImageItem[], name: string): ImageItem | undefined => {
  return images.find((i) => i.name === name);
};

// Helper function to reorder images based on compressed images order
const reorderImagesByCompressed = (images: ImageItem[], compressedImages: ImageItem[]): ImageItem[] => {
  return compressedImages
    .map((img) => findMatchingImage(images, img.name))
    .filter((img): img is ImageItem => img !== undefined);
};

export const useImageStore = create<ImageState>((set, get) => ({
  images: [],
  compressedImages: [],
  imageIsInputed: false,

  setImages: (images) => set({ images }),
  
  setCompressedImages: (compressedImages) => set({ compressedImages }),
  
  addImages: (newImages, newCompressedImages) => {
    set((state) => ({
      images: [...state.images, ...newImages],
      compressedImages: [...state.compressedImages, ...newCompressedImages],
      imageIsInputed: true,
    }));
  },

  reorderImages: (fromIndex, toIndex) => {
    const { images, compressedImages } = get();
    
    const reorderedCompressed = [...compressedImages];
    const [removedCompressed] = reorderedCompressed.splice(fromIndex, 1);
    reorderedCompressed.splice(toIndex, 0, removedCompressed);

    const reorderedImages = reorderImagesByCompressed(images, reorderedCompressed);

    set({
      images: reorderedImages,
      compressedImages: reorderedCompressed,
    });
  },

  deleteImage: (index) => {
    const { images, compressedImages } = get();
    
    // Revoke URL to free memory
    const imageToDelete = compressedImages[index];
    if (imageToDelete?.src.startsWith('blob:')) {
      URL.revokeObjectURL(imageToDelete.src);
    }
    
    const newCompressed = compressedImages.filter((_, i) => i !== index);
    const newImages = reorderImagesByCompressed(images, newCompressed);

    set({
      images: newImages,
      compressedImages: newCompressed,
    });
  },

  moveToTop: (index) => {
    const { images, compressedImages } = get();
    
    const reorderedCompressed = [...compressedImages];
    const [removed] = reorderedCompressed.splice(index, 1);
    reorderedCompressed.unshift(removed);

    const reorderedImages = reorderImagesByCompressed(images, reorderedCompressed);

    set({
      images: reorderedImages,
      compressedImages: reorderedCompressed,
    });
  },

  moveToBottom: (index) => {
    const { images, compressedImages } = get();
    
    const reorderedCompressed = [...compressedImages];
    const [removed] = reorderedCompressed.splice(index, 1);
    reorderedCompressed.push(removed);

    const reorderedImages = reorderImagesByCompressed(images, reorderedCompressed);

    set({
      images: reorderedImages,
      compressedImages: reorderedCompressed,
    });
  },

  clearAll: () => {
    const { compressedImages } = get();
    
    // Revoke all blob URLs to free memory
    compressedImages.forEach((img) => {
      if (img.src.startsWith('blob:')) {
        URL.revokeObjectURL(img.src);
      }
    });

    set({
      images: [],
      compressedImages: [],
      imageIsInputed: false,
    });
  },

  setImageIsInputed: (value) => set({ imageIsInputed: value }),
}));

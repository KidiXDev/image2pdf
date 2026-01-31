import imageCompression from 'browser-image-compression';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import { useImageStore } from '../stores/imageStore';
import { useUIStore } from '../stores/uiStore';

const VALID_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_IMAGES = 280;

const compressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 600,
  useWebWorker: true
};

export function useImageUpload() {
  const { images, addImages } = useImageStore();
  const { setLoading } = useUIStore();

  const processFiles = useCallback(
    async (acceptedFiles: File[]) => {
      // Validate file types
      const invalidFiles = acceptedFiles.filter(
        (file) => !VALID_TYPES.includes(file.type)
      );

      if (invalidFiles.length > 0 || acceptedFiles.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Unsupported file type',
          text: 'Supported file types: PNG, JPEG, and WEBP',
          confirmButtonText: 'Close',
          customClass: {
            popup: 'rounded-2xl shadow-xl',
            title: 'text-lg font-semibold text-slate-800',
            confirmButton:
              'bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium'
          },
          backdrop: 'rgba(15, 23, 42, 0.4)'
        });
        return;
      }

      // Validate total image count
      const totalImages = images.length + acceptedFiles.length;
      if (totalImages > MAX_IMAGES) {
        Swal.fire({
          icon: 'error',
          title: 'Too many images',
          text: `You can only upload up to ${MAX_IMAGES} images. You currently have ${images.length} images.`,
          confirmButtonText: 'Close',
          customClass: {
            popup: 'rounded-2xl shadow-xl',
            title: 'text-lg font-semibold text-slate-800',
            confirmButton:
              'bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium'
          },
          backdrop: 'rgba(15, 23, 42, 0.4)'
        });
        return;
      }

      setLoading(true, 'Processing images...');

      try {
        const processedImages = await Promise.all(
          acceptedFiles.map(async (file) => {
            const reader = new FileReader();

            return new Promise<{
              src: string;
              name: string;
              compressedSrc: string;
            }>((resolve) => {
              reader.onload = async () => {
                const binaryStr = reader.result as string;
                const compressedFile = await imageCompression(
                  file,
                  compressionOptions
                );
                const compressedSrc = URL.createObjectURL(compressedFile);

                resolve({
                  src: binaryStr,
                  name: file.name,
                  compressedSrc
                });
              };
              reader.readAsDataURL(file);
            });
          })
        );

        const newImages = processedImages.map(({ src, name }) => ({
          src,
          name
        }));
        const newCompressed = processedImages.map(
          ({ compressedSrc, name }) => ({
            src: compressedSrc,
            name
          })
        );

        addImages(newImages, newCompressed);
      } finally {
        setLoading(false);
      }
    },
    [images.length, addImages, setLoading]
  );

  const dropzoneConfig = useDropzone({
    onDrop: processFiles,
    accept: {
      'image/png': [],
      'image/jpeg': [],
      'image/webp': []
    },
    noClick: false,
    noKeyboard: false
  });

  return {
    ...dropzoneConfig,
    processFiles
  };
}

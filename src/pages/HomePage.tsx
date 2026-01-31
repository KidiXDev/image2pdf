import { useCallback, useState } from "react";
import { DropzoneRootProps, useDropzone } from "react-dropzone";

import HeaderC from "../components/HeaderC";
import DragAndDropComponent from "../components/DragAndDropC";
import GridViewC from "../components/GridViewC";
import imageCompression from "browser-image-compression";
import Swal from "sweetalert2";
import jsPDF from "jspdf";

interface IContentProps {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneRootProps>(props?: T) => T;
}

const Content = ({ getRootProps, getInputProps }: IContentProps) => {
  return (
    <div className="flex flex-1 justify-center px-4 sm:px-6 lg:px-10 py-8 mt-14">
      <div className="flex flex-col w-full max-w-xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
            Convert Images to PDF
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Drag and drop your images or click to select files.
            <br />
            <span className="text-slate-500">Your files stay private - everything happens in your browser.</span>
          </p>
        </div>
        <DragAndDropComponent
          getRootProps={getRootProps}
          getInputProps={getInputProps}
        />
        
        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-medium text-slate-800 text-sm">100% Private</h3>
            <p className="text-xs text-slate-500 mt-1">Files never leave your device</p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-medium text-slate-800 text-sm">Fast & Easy</h3>
            <p className="text-xs text-slate-500 mt-1">Convert in seconds</p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-slate-800 text-sm">Free Forever</h3>
            <p className="text-xs text-slate-500 mt-1">No watermarks or limits</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ImageItem {
  src: string;
  name: string;
}

interface ConvertOptions {
  pageSize: string;
  orientation: string;
  margin: number;
  quality: string;
  fileName: string;
}

// Page size dimensions in mm
const PAGE_SIZES: Record<string, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
  legal: { width: 215.9, height: 355.6 },
  a3: { width: 297, height: 420 },
  a5: { width: 148, height: 210 },
};

const HomePage = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [imageIsInputed, setImageIsInputed] = useState(false);

  const [compressedImages, setCompressedImages] = useState<ImageItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState("Please Wait");

  const processFiles = useCallback(
    async (acceptedFiles: File[]) => {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      };

      const validTypes = ["image/png", "image/jpeg", "image/webp"];

      const filteredFiles = acceptedFiles.filter(
        (file) => !validTypes.includes(file.type)
      );

      if (filteredFiles.length > 0 || acceptedFiles.length == 0) {
        Swal.fire({
          icon: "error",
          title: "Unsupported file type",
          text: "Supported file types: PNG, JPEG, and WEBP",
          confirmButtonText: "Close",
          customClass: {
            popup: "rounded-2xl shadow-xl",
            title: "text-lg font-semibold text-slate-800",
            confirmButton:
              "bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium",
          },
          backdrop: "rgba(15, 23, 42, 0.4)",
        });
        return;
      }

      const totalImages = images.length + acceptedFiles.length;
      if (totalImages > 280) {
        Swal.fire({
          icon: "error",
          title: "Too many images",
          text: `You can only upload up to 280 images. You currently have ${images.length} images.`,
          confirmButtonText: "Close",
          customClass: {
            popup: "rounded-2xl shadow-xl",
            title: "text-lg font-semibold text-slate-800",
            confirmButton:
              "bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium",
          },
          backdrop: "rgba(15, 23, 42, 0.4)",
        });
        return;
      }

      setIsLoading(true);
      setLoadingTip("Processing images...");

      const imagesPromises = acceptedFiles.map(async (file) => {
        const reader = new FileReader();

        return new Promise<{
          src: string;
          name: string;
          compressedSrc: string;
        }>((resolve) => {
          reader.onload = async () => {
            const binaryStr = reader.result as string;

            const compressedFile = await imageCompression(file, options);
            const compressedSrc = URL.createObjectURL(compressedFile);

            resolve({
              src: binaryStr,
              name: file.name,
              compressedSrc,
            });
          };

          reader.readAsDataURL(file);
        });
      });

      try {
        const newImages = await Promise.all(imagesPromises);

        setImages(prev => [...prev, ...newImages.map(({ src, name }) => ({ src, name }))]);
        setCompressedImages(prev => [
          ...prev,
          ...newImages.map(({ compressedSrc, name }) => ({
            src: compressedSrc,
            name,
          }))
        ]);
        setImageIsInputed(true);
      } finally {
        setIsLoading(false);
      }
    },
    [images.length]
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      await processFiles(acceptedFiles);
    },
    [processFiles]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
    },
    noClick: false,
    noKeyboard: false,
  });

  const handleAddMoreImages = () => {
    open();
  };

  /**
   * Converts an array of images to a PDF file.
   */
  const convertImagesToPDF = (config: string, options: ConvertOptions) => {
    setIsLoading(true);
    setLoadingTip("Converting images to PDF...");
    
    const { pageSize, orientation, margin, fileName } = options;
    const pageDimensions = PAGE_SIZES[pageSize] || PAGE_SIZES.a4;
    
    // Swap dimensions for landscape
    const pageWidth = orientation === "landscape" ? pageDimensions.height : pageDimensions.width;
    const pageHeight = orientation === "landscape" ? pageDimensions.width : pageDimensions.height;

    let pdf = new jsPDF({
      orientation: orientation === "landscape" ? "l" : "p",
      unit: "mm",
      format: [pageWidth, pageHeight],
    });

    let processedCount = 0;

    images.forEach((image, index) => {
      const img = new Image();
      img.src = image.src;

      img.onload = () => {
        const pdfWidth = pageWidth;
        const pdfHeight = pageHeight;
        const availableWidth = pdfWidth - (margin * 2);
        const availableHeight = pdfHeight - (margin * 2);

        const imgWidth = img.width;
        const imgHeight = img.height;

        let scaledWidth = imgWidth;
        let scaledHeight = imgHeight;
        let x = margin;
        let y = margin;

        if (config === "fit-img-size") {
          // Adjust page size to fit image
          let newPageWidth = pdfWidth;
          let newPageHeight = pdfHeight;
          
          if (imgWidth / imgHeight > pdfWidth / pdfHeight) {
            newPageHeight = (pdfWidth * imgHeight) / imgWidth;
          } else {
            newPageWidth = (pdfHeight * imgWidth) / imgHeight;
          }
          
          if (index > 0) {
            pdf.addPage(
              [newPageWidth, newPageHeight],
              newPageWidth > newPageHeight ? "l" : "p"
            );
          } else {
            pdf = new jsPDF({
              orientation: newPageWidth > newPageHeight ? "l" : "p",
              unit: "mm",
              format: [newPageWidth, newPageHeight],
            });
          }
          scaledWidth = newPageWidth;
          scaledHeight = newPageHeight;
          x = 0;
          y = 0;
        } else if (config === "default") {
          // Fit image within available space maintaining aspect ratio
          const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
          scaledWidth = imgWidth * ratio;
          scaledHeight = imgHeight * ratio;
          x = margin + (availableWidth - scaledWidth) / 2;
          y = margin + (availableHeight - scaledHeight) / 2;
          
          if (index > 0) {
            pdf.addPage();
          }
        } else if (config === "cover") {
          // Cover the page (may crop)
          const ratio = Math.max(availableWidth / imgWidth, availableHeight / imgHeight);
          scaledWidth = imgWidth * ratio;
          scaledHeight = imgHeight * ratio;
          x = margin + (availableWidth - scaledWidth) / 2;
          y = margin + (availableHeight - scaledHeight) / 2;
          
          if (index > 0) {
            pdf.addPage();
          }
        } else if (config === "stretch") {
          // Stretch to fill available space
          scaledWidth = availableWidth;
          scaledHeight = availableHeight;
          x = margin;
          y = margin;
          
          if (index > 0) {
            pdf.addPage();
          }
        }

        // Add image with quality setting
        const format = image.src.includes("image/png") ? "PNG" : "JPEG";
        pdf.addImage(img, format, x, y, scaledWidth, scaledHeight, undefined, "MEDIUM");

        processedCount++;
        setLoadingTip(`Processing ${processedCount}/${images.length} images...`);

        if (processedCount === images.length) {
          const finalFileName = fileName.trim() || "result";
          pdf.save(`${finalFileName}.pdf`);
          setIsLoading(false);
        }
      };
    });

    images.forEach((image) => URL.revokeObjectURL(image.src));
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100 overflow-x-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col items-center max-w-sm mx-4">
            <div className="flex flex-row gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-primary-500 animate-bounce"></div>
              <div className="w-3 h-3 rounded-full bg-primary-500 animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-3 h-3 rounded-full bg-primary-500 animate-bounce [animation-delay:-.5s]"></div>
            </div>
            <div className="text-slate-700 text-sm font-medium text-center">
              {loadingTip}
            </div>
          </div>
        </div>
      )}

      <div className="flex h-full grow flex-col">
        <HeaderC />
        {!imageIsInputed && (
          <Content getRootProps={getRootProps} getInputProps={getInputProps} />
        )}
        {imageIsInputed && (
          <GridViewC
            images={images}
            setImages={setImages}
            compressedImages={compressedImages}
            setCompressedImages={setCompressedImages}
            convertImage={(value, options) => {
              convertImagesToPDF(value, options);
            }}
            setIsLoading={setIsLoading}
            onAddMoreImages={handleAddMoreImages}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;

import { useCallback, useEffect, useState } from "react";
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
    <div className="px-40 flex flex-1 justify-center py-5 mt-10">
      <div className="layout-content-container flex flex-col w-[512px] py-5 max-w-[960px] flex-1">
        <h3 className="text-[#0e141b] text-2xl font-bold leading-tight px-4 text-center pb-2 pt-5">
          Convert images to PDF
        </h3>
        <p className="text-[#0e141b] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
          Drag and drop images here or click to select images
          <br />
          <span className="italic text-sm">(max 280 images)</span>
        </p>
        <DragAndDropComponent
          getRootProps={getRootProps}
          getInputProps={getInputProps}
        />
      </div>
    </div>
  );
};

interface ImageItem {
  src: string;
  name: string;
}

const HomePage = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [imageIsInputed, setImageIsInputed] = useState(false);

  const [compressedImages, setCompressedImages] = useState<ImageItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingTip, setLoadingTip] = useState("Please Wait");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      };

      const handleClick = () => {
        setImageIsInputed(!imageIsInputed);

        setIsLoading(false);
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
            popup: "bg-white shadow-lg rounded-lg",
            title: "text-lg font-semibold",
            confirmButton:
              "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700",
          },
        });
        return;
      }

      if (acceptedFiles.length > 280) {
        Swal.fire({
          icon: "error",
          title: "Sorry",
          text: "You can only upload up to 280 images",
          confirmButtonText: "Close",
          customClass: {
            popup: "bg-white shadow-lg rounded-lg",
            title: "text-lg font-semibold",
            confirmButton:
              "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700",
          },
        });
        return;
      }

      setIsLoading(true);

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
        const images = await Promise.all(imagesPromises);

        setImages(images.map(({ src, name }) => ({ src, name })));
        setCompressedImages(
          images.map(({ compressedSrc, name }) => ({
            src: compressedSrc,
            name,
          }))
        );
      } finally {
        setIsLoading(false);
      }

      handleClick();
    },
    [imageIsInputed]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
    },
  });

  /**
   * Converts an array of images to a PDF file.
   *
   * The function takes an optional configuration string to determine how the images are scaled within the PDF.
   * The supported configurations are:
   *   - "fit-img-size": The PDF page size is adjusted to fit the image size.
   *   - "default": The image is scaled down to fit within the PDF page while maintaining its aspect ratio.
   *   - "cover": The image is scaled up to cover the entire PDF page while maintaining its aspect ratio.
   *   - "stretch": The image is stretched to fill the entire PDF page without maintaining its aspect ratio.
   *
   * @param {string} config - The configuration string to determine how the images are scaled.
   * @return {void}
   */
  const convertImagesToPDF = (config: string) => {
    setLoadingTip("Converting images to PDF");
    let pdf = new jsPDF();

    images.forEach((image, index) => {
      const img = new Image();
      img.src = image.src;

      img.onload = () => {
        let pdfWidth = pdf.internal.pageSize.width;
        let pdfHeight = pdf.internal.pageSize.height;

        const imgWidth = img.width;
        const imgHeight = img.height;

        let scaledWidth = imgWidth;
        let scaledHeight = imgHeight;
        let x = 0;
        let y = 0;

        if (config === "fit-img-size") {
          if (imgWidth / imgHeight > pdfWidth / pdfHeight) {
            pdfHeight = (pdfWidth * imgHeight) / imgWidth;
          } else {
            pdfWidth = (pdfHeight * imgWidth) / imgHeight;
          }
          if (index > 0) {
            pdf.addPage(
              [pdfWidth, pdfHeight],
              pdfWidth > pdfHeight ? "l" : "p"
            );
          } else {
            pdf = new jsPDF({
              orientation: pdfWidth > pdfHeight ? "l" : "p",
              unit: "pt",
              format: [pdfWidth, pdfHeight],
            });
          }
          scaledWidth = pdfWidth;
          scaledHeight = pdfHeight;
        } else if (config === "default") {
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          scaledWidth = imgWidth * ratio;
          scaledHeight = imgHeight * ratio;
          x = (pdfWidth - scaledWidth) / 2;
          y = (pdfHeight - scaledHeight) / 2;
        } else if (config === "cover") {
          const ratio = Math.max(pdfWidth / imgWidth, pdfHeight / imgHeight);
          scaledWidth = imgWidth * ratio;
          scaledHeight = imgHeight * ratio;
          x = (pdfWidth - scaledWidth) / 2;
          y = (pdfHeight - scaledHeight) / 2;
        } else if (config === "stretch") {
          scaledWidth = pdfWidth;
          scaledHeight = pdfHeight;
        }

        if (index > 0 && config !== "fit-img-size") {
          pdf.addPage();
        }

        pdf.addImage(img, "PNG", x, y, scaledWidth, scaledHeight);

        if (index === images.length - 1) {
          pdf.save("result.pdf");
          setIsLoading(false);
        }
      };
    });

    images.forEach((image) => URL.revokeObjectURL(image.src));
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 overflow-x-hidden">
      {isLoading && (
        <div className="inset-0 bg-black opacity-90 z-50 flex flex-col items-center justify-center fixed">
          <div className="flex flex-row gap-2">
            <div className="w-4 h-4 rounded-full bg-white animate-bounce"></div>
            <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
          </div>
          <div className="text-white text-xl mt-10 text-center">
            <span>{loadingTip}</span>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="inset-0 bg-black opacity-90 z-50 flex flex-col items-center justify-center fixed">
          <div className="flex flex-row gap-2">
            <div className="w-4 h-4 rounded-full bg-white animate-bounce"></div>
            <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
          </div>
          <div className="text-white text-xl mt-10 text-center">
            <span>Sorry, this site is not available on mobile devices</span>
          </div>
        </div>
      )}

      <div className="layout-container flex h-full grow flex-col">
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
            convertImage={(value) => {
              setIsLoading(true);
              setLoadingTip("Initializing");
              setTimeout(() => {
                convertImagesToPDF(value);
              }, 100); // Add a delay to show the loading tip
            }}
            setIsLoading={setIsLoading}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;

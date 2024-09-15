/* eslint-disable @typescript-eslint/no-unused-vars */
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
    <div className="px-40 flex flex-1 justify-center py-5 mt-10">
      <div className="layout-content-container flex flex-col w-[512px] py-5 max-w-[960px] flex-1">
        <h3 className="text-[#0e141b] text-2xl font-bold leading-tight px-4 text-center pb-2 pt-5">
          Convert images to PDF
        </h3>
        <p className="text-[#0e141b] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
          Drag and drop images here or click to select images
          <br />
          <span className="italic text-sm">(max 80 images)</span>
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

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 600,
    useWebWorker: true,
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 80) {
      Swal.fire({
        icon: "error",
        title: "Sorry",
        text: "You can only upload up to 80 images",
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

          // Kompresi gambar
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
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
    },
  });

  const handleClick = () => {
    setImageIsInputed(!imageIsInputed);

    setIsLoading(false);
  };

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
          // Adjust PDF page size to match image aspect ratio
          if (imgWidth / imgHeight > pdfWidth / pdfHeight) {
            // Image is wider relative to its height than the default page
            pdfHeight = (pdfWidth * imgHeight) / imgWidth;
          } else {
            // Image is taller relative to its width than the default page
            pdfWidth = (pdfHeight * imgWidth) / imgHeight;
          }
          // Create a new PDF with the correct page size
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

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 overflow-x-hidden">
      {isLoading && (
        <div className="inset-0 bg-black opacity-90 z-50 flex flex-col items-center justify-center fixed">
          <div className="flex flex-row gap-2">
            <div className="w-4 h-4 rounded-full bg-white animate-bounce"></div>
            <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-4 h-4 rounded-full bg-white animate-bounce [animation-delay:-.5s]"></div>
          </div>
          <div className="text-white text-xl mt-10">
            <span>{loadingTip}</span>
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
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;

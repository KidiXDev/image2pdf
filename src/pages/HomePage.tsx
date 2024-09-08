/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import HeaderC from "../components/HeaderC";
import DragAndDropComponent from "../components/DragAndDropC";
import ConvertC from "../components/ConvertC";

interface IContentProps {
  getRootProps: any;
  getInputProps: any;
  imageExist: boolean;
}

const Content = ({
  getRootProps,
  getInputProps,
  imageExist,
}: IContentProps) => {
  return (
    <div className={imageExist ? "hidden" : "block"}>
      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col w-[512px] py-5 max-w-[960px] flex-1">
          <h3 className="text-[#0e141b] text-2xl font-bold leading-tight px-4 text-center pb-2 pt-5">
            Convert images to PDF
          </h3>
          <p className="text-[#0e141b] text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
            Drag and drop images here or click to upload
          </p>
          <DragAndDropComponent
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const binaryStr = reader.result;
        console.log(binaryStr);

        handleClick();
      };

      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/png": [], // Menerima file PNG
      "image/jpeg": [], // Menerima file JPG
    },
  });

  const [imageIsInputed, setImageIsInputed] = useState(false);

  const handleClick = () => {
    setImageIsInputed(!imageIsInputed);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-slate-50 overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <HeaderC />
        <Content
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          imageExist={imageIsInputed}
        />
        <ConvertC imageExist={imageIsInputed} />
      </div>
    </div>
  );
};

export default HomePage;

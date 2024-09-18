import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import CButton from "./BaseButtonC";
import ConvertC from "./ConvertC";
import { useState } from "react";
import DropdownC from "./DropdownC";

interface ImageItem {
  src: string;
  name: string;
}

interface GridViewProps {
  images: ImageItem[];
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
  compressedImages: ImageItem[];
  setCompressedImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;

  convertImage?: (configValue: string) => void;
}

const GridViewC: React.FC<GridViewProps> = ({
  images,
  setImages,
  compressedImages,
  setCompressedImages,
  convertImage,
}) => {
  const [configValue, setConfigValue] = useState("default");

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedCompressedImages = Array.from(compressedImages);
    const [removed] = reorderedCompressedImages.splice(result.source.index, 1);
    reorderedCompressedImages.splice(result.destination.index, 0, removed);

    const reorderedImages = reorderedCompressedImages.map(
      (image) => images.find((img) => img.name === image.name)!
    );

    setCompressedImages(reorderedCompressedImages);
    setImages(reorderedImages);
  };

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const className = `w-full ${
    configValue === "cover"
      ? "h-full object-cover"
      : configValue === "stretch"
      ? "h-full"
      : "h-fit"
  }`;

  return (
    <div className="flex">
      <div
        className="px-10 max-px py-5 h-screen left-0 mt-16 overflow-auto fixed"
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="grid" direction="vertical">
            {(provided) => (
              <div
                className="grid grid-cols-1 gap-4 mb-24"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {compressedImages.map((image, index) => (
                  <Draggable
                    key={`${image.name}-${index}`}
                    draggableId={`${image.name}-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={() => {
                          handleClick(image.name);
                        }}
                      >
                        <ConvertC imageSrc={image.src} imageName={image.name} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className="flex-col mx-auto justify-center mt-16 hidden md:block">
        {compressedImages.map((image) => (
          <div
            className={`sm:w-[400px] md:w-[600px] lg:w-[588px] h-auto bg-white shadow-lg border border-gray-300 block content-center mt-10 mb-16 mr-80 mx-36 ${
              configValue !== "fit-img-size" && "aspect-[1/1.414]"
            }`}
          >
            <img
              loading="lazy"
              className={className}
              src={image.src}
              id={image.name}
              alt={image.name}
            />
          </div>
        ))}
      </div>

      <div className="right-0 h-full fixed w-3/12 shadow-xl px-10 py-14 mt-10 bg-[#fafafafa] hidden md:block">
        <h1 className="text-2xl mb-10">Control Panel</h1>
        <span>Image Size</span>
        <DropdownC
          elements={[
            { element: "Default", value: "default" },
            { element: "Cover", value: "cover" },
            { element: "Stretch", value: "stretch" },
            { element: "Fit Image Size", value: "fit-img-size" },
          ]}
          onChange={(value) => setConfigValue(value)}
        />

        <div
          className="w-fit"
          onClick={() => convertImage && convertImage(configValue)}
        >
          <CButton text="Convert" />
        </div>
      </div>
    </div>
  );
};

export default GridViewC;

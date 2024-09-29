import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

import CButton from "./BaseButtonC";
import ConvertC from "./ConvertC";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import DropdownC from "./DropdownC";
import ContextMenu from "./ContextMenu";

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
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const GridViewC: React.FC<GridViewProps> = ({
  images,
  setImages,
  compressedImages,
  setCompressedImages,
  convertImage,
  setIsLoading,
}) => {
  const [configValue, setConfigValue] = useState("default");
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuItemIndex, setContextMenuItemIndex] = useState(0);

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setMenuPosition({ x: e.pageX, y: e.pageY });
    setMenuVisible(true);
  };

  useEffect(() => {
    const handleCloseMenu = () => {
      setMenuVisible(false);
    };

    if (images.length <= 0 || compressedImages.length <= 0) {
      window.location.href = "/";
      return;
    }

    window.addEventListener("click", handleCloseMenu);
    window.addEventListener("scroll", handleCloseMenu);

    return () => {
      window.removeEventListener("click", handleCloseMenu);
      window.removeEventListener("scroll", handleCloseMenu);
    };
  }, [images, compressedImages]);

  const onDragEnd = (result: DropResult) => {
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

  const handleContextMenuItemAction = (
    action: "moveToTop" | "moveToBottom" | "delete"
  ) => {
    switch (action) {
      case "moveToTop": {
        setIsLoading(true);
        requestAnimationFrame(() => {
          const reorderedCompressedImages = Array.from(compressedImages);
          const [removed] = reorderedCompressedImages.splice(
            contextMenuItemIndex,
            1
          );
          reorderedCompressedImages.splice(0, 0, removed);

          const reorderedImages = reorderedCompressedImages.map(
            (image) => images.find((img) => img.name === image.name)!
          );

          setCompressedImages(reorderedCompressedImages);
          setImages(reorderedImages);
          setIsLoading(false);
        });
        break;
      }
      case "moveToBottom": {
        setIsLoading(true);
        requestAnimationFrame(() => {
          const reorderedCompressedImages = Array.from(compressedImages);
          const [removed] = reorderedCompressedImages.splice(
            contextMenuItemIndex,
            1
          );
          reorderedCompressedImages.splice(
            reorderedCompressedImages.length,
            0,
            removed
          );

          const reorderedImages = reorderedCompressedImages.map(
            (image) => images.find((img) => img.name === image.name)!
          );

          setCompressedImages(reorderedCompressedImages);
          setImages(reorderedImages);
          setIsLoading(false);
        });
        break;
      }
      case "delete": {
        setIsLoading(true);
        requestAnimationFrame(() => {
          const reorderedCompressedImages = Array.from(compressedImages);
          reorderedCompressedImages.splice(contextMenuItemIndex, 1);
          setCompressedImages(reorderedCompressedImages);

          const reorderedImages = reorderedCompressedImages.map(
            (image) => images.find((img) => img.name === image.name)!
          );
          setImages(reorderedImages);
          setIsLoading(false);
        });
        break;
      }
    }
  };

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
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleContextMenu(e);
                          setContextMenuItemIndex(index);
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

      {menuVisible && (
        <div
          className="w-fit absolute"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <ContextMenu onAction={handleContextMenuItemAction} />
        </div>
      )}

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

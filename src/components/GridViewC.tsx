import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult
} from '@hello-pangea/dnd';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { Download, Settings, X } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useContextMenu } from '../hooks/useContextMenu';
import { usePDFConverter } from '../hooks/usePDFConverter';
import { useImageStore } from '../stores/imageStore';
import { useUIStore } from '../stores/uiStore';
import ContextMenu from './ContextMenu';
import ControlPanel from './ControlPanel'; // Import the new component
import ConvertC from './ConvertC';

interface GridViewProps {
  onAddMoreImages?: () => void;
}

const GridViewC = memo<GridViewProps>(({ onAddMoreImages }) => {
  const {
    images,
    compressedImages,
    reorderImages,
    deleteImage,
    moveToTop,
    moveToBottom,
    clearAll
  } = useImageStore();

  const { showMobilePanel, setShowMobilePanel, pdfSettings, setLoading } =
    useUIStore();

  const contextMenu = useContextMenu();
  const { convertToPDF } = usePDFConverter();

  // Handle empty state - redirect to home
  useEffect(() => {
    if (images.length === 0 || compressedImages.length === 0) {
      clearAll();
    }
  }, [images.length, compressedImages.length, clearAll]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      reorderImages(result.source.index, result.destination.index);
    },
    [reorderImages]
  );

  const handleClick = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handleContextMenuAction = useCallback(
    (action: 'moveToTop' | 'moveToBottom' | 'delete') => {
      const selectedIdx = contextMenu.selectedIndex;
      if (selectedIdx === null) return;

      // Hide menu first (it handles animation internally)
      contextMenu.hide();

      setLoading(true);
      requestAnimationFrame(() => {
        switch (action) {
          case 'moveToTop':
            moveToTop(selectedIdx);
            break;
          case 'moveToBottom':
            moveToBottom(selectedIdx);
            break;
          case 'delete':
            deleteImage(selectedIdx);
            break;
        }
        setLoading(false);
      });
    },
    [contextMenu, moveToTop, moveToBottom, deleteImage, setLoading]
  );

  const handleConvert = useCallback(() => {
    convertToPDF();
  }, [convertToPDF]);

  const { imageScaling } = pdfSettings;

  const imageClassName = useMemo(() => {
    return `w-full ${
      imageScaling === 'cover'
        ? 'h-full object-cover'
        : imageScaling === 'stretch'
          ? 'h-full'
          : 'h-fit'
    }`;
  }, [imageScaling]);

  const parentRef = useRef<HTMLDivElement>(null);
  const [offsetTop, setOffsetTop] = useState(0);

  useEffect(() => {
    if (parentRef.current) {
      setOffsetTop(parentRef.current.offsetTop);
    }
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: compressedImages.length,
    estimateSize: () => 600, // Estimate based on visual size
    overscan: 2,
    scrollMargin: offsetTop
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Sidebar - Image List (Desktop) */}
      <div
        className="hidden lg:block fixed left-0 top-0 mt-14 w-64 xl:w-72 bg-white/80 backdrop-blur-sm border-r border-slate-200 overflow-y-auto scrollbar-thin"
        style={{ height: 'calc(100vh - 3.5rem)' }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-800">
              Images ({compressedImages.length})
            </h2>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="grid" direction="vertical">
              {(provided) => (
                <div
                  className="space-y-3"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {compressedImages.map((image, index) => (
                    <Draggable
                      key={`${image.name}-${index}`}
                      draggableId={`${image.name}-${index}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => handleClick(image.name)}
                          onContextMenu={(e) => contextMenu.show(e, index)}
                          className={`${snapshot.isDragging ? 'opacity-80 shadow-lg' : ''}`}
                        >
                          <ConvertC
                            imageSrc={image.src}
                            imageName={image.name}
                            index={index}
                            width={140}
                            height={180}
                          />
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
      </div>

      {/* Main Content - Preview */}
      <div className="flex-1 lg:ml-64 xl:ml-72 lg:mr-80 mt-14 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Mobile Image Thumbnails */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-800">
                  Images ({compressedImages.length})
                </h2>
                <button
                  onClick={() => setShowMobilePanel(true)}
                  className="px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-lg flex items-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Settings
                </button>
              </div>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="mobile-grid" direction="horizontal">
                  {(provided) => (
                    <div
                      className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {compressedImages.map((image, index) => (
                        <Draggable
                          key={`mobile-${image.name}-${index}`}
                          draggableId={`mobile-${image.name}-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => handleClick(image.name)}
                              className="flex-shrink-0"
                            >
                              <ConvertC
                                imageSrc={image.src}
                                imageName={image.name}
                                index={index}
                                width={80}
                                height={100}
                              />
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

            {/* Preview Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-slate-600 hidden lg:block">
                PDF Preview
              </h3>

              <div
                ref={parentRef}
                style={{
                  height: `${virtualizer.getTotalSize() - offsetTop}px`,
                  width: '100%',
                  position: 'relative'
                }}
              >
                {virtualizer.getVirtualItems().map((virtualItem) => {
                  const image = compressedImages[virtualItem.index];
                  return (
                    <div
                      key={image.name}
                      data-index={virtualItem.index}
                      ref={virtualizer.measureElement}
                      className="absolute top-0 left-0 w-full"
                      style={{
                        transform: `translateY(${virtualItem.start - offsetTop}px)`
                      }}
                    >
                      <div className="pb-8">
                        <div
                          className={`w-full bg-white shadow-md border border-slate-100 overflow-hidden ${
                            pdfSettings.imageScaling !== 'fit-img-size'
                              ? pdfSettings.orientation === 'landscape'
                                ? 'aspect-[1.414/1]'
                                : 'aspect-[1/1.414]'
                              : ''
                          }`}
                        >
                          <div className="relative w-full h-full flex items-center justify-center bg-white p-2">
                            <div className="absolute top-3 left-3 px-2 py-1 bg-slate-800/80 text-white text-xs rounded-md z-10">
                              Page {virtualItem.index + 1}
                            </div>
                            <img
                              loading="lazy"
                              className={imageClassName}
                              src={image.src}
                              id={image.name}
                              alt={image.name}
                              style={{
                                padding: `${pdfSettings.margin}px`,
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit:
                                  pdfSettings.imageScaling === 'cover'
                                    ? 'cover'
                                    : pdfSettings.imageScaling === 'stretch'
                                      ? 'fill'
                                      : 'contain'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Control Panel (Desktop) */}
      <div
        className="hidden lg:block fixed right-0 top-0 mt-14 w-80 bg-white/80 backdrop-blur-sm border-l border-slate-200 overflow-y-auto scrollbar-thin"
        style={{ height: 'calc(100vh - 3.5rem)' }}
      >
        <div className="p-5">
          <h2 className="text-lg font-semibold text-slate-800 mb-5">
            Settings
          </h2>
          <ControlPanel
            onConvert={handleConvert}
            onAddMoreImages={onAddMoreImages}
          />
        </div>
      </div>

      {/* Mobile Settings Panel */}
      {showMobilePanel && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setShowMobilePanel(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Settings</h3>
              <button
                onClick={() => setShowMobilePanel(false)}
                className="p-2 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <ControlPanel
                isMobile
                onConvert={handleConvert}
                onAddMoreImages={onAddMoreImages}
              />
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu.isRendered && (
        <div
          className="fixed z-50"
          style={{ top: contextMenu.position.y, left: contextMenu.position.x }}
        >
          <ContextMenu
            onAction={handleContextMenuAction}
            isVisible={contextMenu.isVisible}
          />
        </div>
      )}

      {/* Mobile Convert Button */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
        <button
          onClick={handleConvert}
          className="w-full px-4 py-3.5 bg-primary-600 text-white text-sm font-medium rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Convert to PDF
        </button>
      </div>
    </div>
  );
});

GridViewC.displayName = 'GridViewC';

export default GridViewC;

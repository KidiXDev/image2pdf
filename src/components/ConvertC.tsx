import { memo } from 'react';

interface ConvertCProps {
  imageSrc: string;
  altText?: string;
  imageName?: string;
  width?: number;
  height?: number;
  index?: number;
}

const ConvertC = memo<ConvertCProps>(
  ({
    imageSrc,
    altText = 'Image',
    imageName = 'image.jpg',
    width = 140,
    height = 180,
    index
  }) => {
    return (
      <div className="flex flex-col items-center cursor-grab active:cursor-grabbing">
        <div
          className="relative overflow-hidden rounded-xl shadow-md border border-slate-200 bg-white"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          {/* Index badge */}
          {typeof index === 'number' && (
            <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-slate-800/80 text-white text-xs font-medium flex items-center justify-center">
              {index + 1}
            </div>
          )}

          <img
            src={imageSrc}
            alt={altText}
            loading="lazy"
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
        <span className="mt-2 text-xs text-slate-600 truncate max-w-[140px] text-center">
          {imageName}
        </span>
      </div>
    );
  }
);

ConvertC.displayName = 'ConvertC';

export default ConvertC;

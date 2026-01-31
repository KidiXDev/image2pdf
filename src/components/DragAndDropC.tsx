import { DropzoneRootProps } from "react-dropzone";

interface CDragAndDropProps {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneRootProps>(props?: T) => T;
}

const DragAndDropComponent: React.FC<CDragAndDropProps> = ({
  getRootProps,
  getInputProps,
}) => {
  return (
    <div className="flex flex-col p-4">
      <div
        {...getRootProps()}
        className="flex flex-col items-center gap-5 rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 px-6 py-12 sm:py-16 cursor-pointer transition-smooth"
      >
        <input {...getInputProps()} />
        
        {/* Upload Icon */}
        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
          <svg 
            className="w-8 h-8 text-primary-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
        </div>
        
        <div className="flex max-w-[480px] flex-col items-center gap-2 text-center">
          <p className="text-slate-700 text-lg font-semibold">
            Drag and drop images here
          </p>
          <p className="text-slate-500 text-sm">
            or click to browse your files
          </p>
        </div>
        
        <button 
          type="button"
          className="px-6 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg shadow-sm transition-smooth"
        >
          Select Images
        </button>
        
        <p className="text-xs text-slate-400">
          Supports PNG, JPEG, WebP • Max 280 images
        </p>
      </div>
    </div>
  );
};

export default DragAndDropComponent;

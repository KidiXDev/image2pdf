import { memo } from 'react';
import { DropzoneRootProps } from 'react-dropzone';
import { CloudUpload } from 'lucide-react';

interface CDragAndDropProps {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneRootProps>(props?: T) => T;
}

const DragAndDropComponent = memo<CDragAndDropProps>(({
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
          <CloudUpload className="w-8 h-8 text-primary-500" strokeWidth={1.5} />
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
});

DragAndDropComponent.displayName = 'DragAndDropComponent';

export default DragAndDropComponent;

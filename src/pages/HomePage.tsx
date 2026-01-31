import { memo } from 'react';
import { DropzoneRootProps } from 'react-dropzone';
import { Lock, Zap, CircleDollarSign } from 'lucide-react';

import HeaderC from '../components/HeaderC';
import DragAndDropComponent from '../components/DragAndDropC';
import GridViewC from '../components/GridViewC';
import { useImageStore } from '../stores/imageStore';
import { useUIStore } from '../stores/uiStore';
import { useImageUpload } from '../hooks/useImageUpload';

interface IContentProps {
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneRootProps>(props?: T) => T;
}

const Content = memo<IContentProps>(({ getRootProps, getInputProps }) => {
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
              <Lock className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
            </div>
            <h3 className="font-medium text-slate-800 text-sm">100% Private</h3>
            <p className="text-xs text-slate-500 mt-1">Files never leave your device</p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary-50 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
            </div>
            <h3 className="font-medium text-slate-800 text-sm">Fast & Easy</h3>
            <p className="text-xs text-slate-500 mt-1">Convert in seconds</p>
          </div>
          <div className="text-center p-4">
            <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-primary-50 flex items-center justify-center">
              <CircleDollarSign className="w-5 h-5 text-primary-600" strokeWidth={1.5} />
            </div>
            <h3 className="font-medium text-slate-800 text-sm">Free Forever</h3>
            <p className="text-xs text-slate-500 mt-1">No watermarks or limits</p>
          </div>
        </div>
      </div>
    </div>
  );
});

Content.displayName = 'Content';

const HomePage = () => {
  const { imageIsInputed } = useImageStore();
  const { isLoading, loadingTip } = useUIStore();
  const { getRootProps, getInputProps, open } = useImageUpload();

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
          <GridViewC onAddMoreImages={open} />
        )}
      </div>
    </div>
  );
};

export default HomePage;

import { memo, useCallback } from 'react';
import Swal from 'sweetalert2';
import { FileText, Info } from 'lucide-react';

const HeaderC = memo(() => {
  const reloadPage = useCallback(() => {
    window.location.reload();
  }, []);

  const showAbout = useCallback(() => {
    Swal.fire({
      title: 'About Image2PDF',
      html: `
      <div class="text-left text-slate-600 space-y-3">
        <p class="text-base">The easiest way to convert images to PDF with just a few clicks!</p>
        <p class="text-sm">Image2PDF offers a seamless and efficient way to transform your images into high-quality PDF documents.</p>
        <div class="pt-3 border-t border-slate-200">
          <p class="text-sm">Developed by 
            <a href="https://github.com/KidiXDev" 
               target="_blank" 
               class="text-primary-600 font-medium hover:underline">
              @KidiXDev
            </a>
          </p>
        </div>
      </div>`,
      icon: 'info',
      confirmButtonText: 'Close',
      customClass: {
        popup: 'rounded-2xl shadow-xl',
        title: 'text-xl font-bold text-slate-800',
        confirmButton: 'bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium',
      },
      width: 'auto',
      backdrop: 'rgba(15, 23, 42, 0.4)',
    });
  }, []);

  return (
    <header className="flex w-full items-center justify-between whitespace-nowrap bg-white/80 backdrop-blur-md z-10 border-b border-slate-200/60 px-4 sm:px-6 lg:px-10 py-3 shadow-sm fixed top-0 left-0 right-0">
      <div className="flex items-center gap-3 text-slate-800">
        <button onClick={reloadPage} className="flex items-center gap-3 transition-smooth">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-sm">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800">
            Image2PDF
          </h1>
        </button>
      </div>
      <button
        onClick={showAbout}
        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg transition-smooth"
      >
        <Info className="w-4 h-4" />
        <span className="hidden sm:inline">About</span>
      </button>
    </header>
  );
});

HeaderC.displayName = 'HeaderC';

export default HeaderC;

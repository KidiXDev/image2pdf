import Swal from "sweetalert2";

const reloadPage = () => {
  window.location.reload();
};

const HeaderC = () => {
  return (
    <header className="flex w-full items-center justify-between whitespace-nowrap bg-white/80 backdrop-blur-md z-10 border-b border-slate-200/60 px-4 sm:px-6 lg:px-10 py-3 shadow-sm fixed top-0 left-0 right-0">
      <div className="flex items-center gap-3 text-slate-800">
        <button onClick={reloadPage} className="flex items-center gap-3 transition-smooth">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-sm">
            <svg
              width="18"
              height="18"
              viewBox="0 0 4.2333 4.2333"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <g strokeWidth="1.2506" fill="currentColor">
                <path d="m0.58151 0h2.1204c0.20142 0 0.36356 0.16215 0.36356 0.36356v3.0696c0 0.20141-0.16214 0.36356-0.36356 0.36356h-2.1204c-0.20141 0-0.36356-0.16215-0.36356-0.36356v-3.0696c0-0.20141 0.16215-0.36356 0.36356-0.36356z" opacity="0.5" />
                <path d="m1.4478 0.36019h2.0961c0.20815 0 0.37572 0.16757 0.37572 0.37572v3.0453c0 0.20815-0.16757 0.37572-0.37572 0.37572h-2.0961c-0.20815 0-0.37572-0.16757-0.37572-0.37572v-3.0453c0-0.20815 0.16757-0.37572 0.37572-0.37572z" />
              </g>
            </svg>
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800">
            Image2PDF
          </h1>
        </button>
      </div>
      <button
        onClick={() =>
          Swal.fire({
            title: "About Image2PDF",
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
            icon: "info",
            confirmButtonText: "Close",
            customClass: {
              popup: "rounded-2xl shadow-xl",
              title: "text-xl font-bold text-slate-800",
              confirmButton:
                "bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium",
            },
            width: "auto",
            backdrop: "rgba(15, 23, 42, 0.4)",
          })
        }
        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg transition-smooth"
      >
        About
      </button>
    </header>
  );
};

export default HeaderC;

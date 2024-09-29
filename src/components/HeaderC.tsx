import Swal from "sweetalert2";
import CButton from "./BaseButtonC";

const reloadPage = () => {
  window.location.reload();
};

const HeaderC = () => {
  return (
    <header className="flex w-full items-center justify-between whitespace-nowrap border-b border-solid bg-white z-10 border-b-[#e7edf3] px-10 py-3 shadow-md fixed">
      <div className="flex items-center gap-4 text-[#0e141b]">
        <button onClick={reloadPage}>
          <div className="flex items-center gap-4">
            <div className="size-4">
              <svg
                width="16"
                height="16"
                version="1.1"
                viewBox="0 0 4.2333 4.2333"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g strokeWidth="1.2506">
                  <path d="m0.58151 0h2.1204c0.20142 0 0.36356 0.16215 0.36356 0.36356v3.0696c0 0.20141-0.16214 0.36356-0.36356 0.36356h-2.1204c-0.20141 0-0.36356-0.16215-0.36356-0.36356v-3.0696c0-0.20141 0.16215-0.36356 0.36356-0.36356z" />
                  <path d="m1.512 0.43657h2.1205c0.20141 0 0.36356 0.16215 0.36356 0.36356v3.0696c0 0.20142-0.16215 0.36356-0.36356 0.36356h-2.1205c-0.20141 0-0.36356-0.16214-0.36356-0.36356v-3.0696c0-0.20141 0.16215-0.36356 0.36356-0.36356z" />
                  <path
                    d="m1.4478 0.36019h2.0961c0.20815 0 0.37572 0.16757 0.37572 0.37572v3.0453c0 0.20815-0.16757 0.37572-0.37572 0.37572h-2.0961c-0.20815 0-0.37572-0.16757-0.37572-0.37572v-3.0453c0-0.20815 0.16757-0.37572 0.37572-0.37572z"
                    fill="#fff"
                  />
                </g>
              </svg>
            </div>
            <h2 className="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em]">
              Image2PDF
            </h2>
          </div>
        </button>
      </div>
      <CButton
        text="About"
        onClick={() =>
          Swal.fire({
            title: "About Image2PDF",
            html: `
      <div class="text-justify">
        <p>Easiest way to convert images to PDF with just a few clicks!</p>
        <p>Image2PDF offers a seamless and efficient way to <br/>transform your images into high-quality PDF documents.</p>
        <br/>
        <p>This site was developed by 
          <a href="https://github.com/KidiXDev" 
             target="_blank" 
             class="text-green-700 hover:text-green-500 hover:underline transition">
            @KidiXDev
          </a>
      </div>`,
            icon: "info",
            confirmButtonText: "Close",
            customClass: {
              popup: "bg-white shadow-lg rounded-lg",
              title: "text-lg font-semibold",
              confirmButton:
                "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700",
            },
            width: "auto",
          })
        }
      />
    </header>
  );
};

export default HeaderC;

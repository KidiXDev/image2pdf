import CButton from "./BaseButtonC";

interface CDragAndDropProps {
  getRootProps: any;
  getInputProps: any;
}

const DragAndDropComponent: React.FC<CDragAndDropProps> = ({
  getRootProps,
  getInputProps,
}) => {
  return (
    <div className="flex flex-col p-4">
      <div
        {...getRootProps()}
        className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#d0dbe7] px-6 py-14 cursor-pointer"
      >
        <input {...getInputProps()} />
        <div className="flex max-w-[480px] flex-col items-center gap-2">
          <p className="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
            Drag and drop images here
          </p>
          <p className="text-[#0e141b] text-sm font-normal leading-normal max-w-[480px] text-center">
            or
          </p>
        </div>
        <CButton text="Upload Images" />
      </div>
    </div>
  );
};

export default DragAndDropComponent;

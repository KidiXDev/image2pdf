import ArrowDown from "../assets/IconArrowDown.svg";
import ArrowUp from "../assets/IconArrowUp.svg";
import TrashIcon from "../assets/IconDelete.svg";

interface ContextMenuProps {
  onAction: (action: "moveToTop" | "moveToBottom" | "delete") => void;
}

const ContextMenu = ({ onAction }: ContextMenuProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 z-50 w-52 text-slate-700 text-sm overflow-hidden">
      <button
        className="w-full text-left px-3 py-2.5 bg-white transition-smooth space-x-2 items-center flex"
        onClick={() => onAction("moveToTop")}
      >
        <img src={ArrowUp} alt="Move up" className="w-5 h-5 opacity-60" />
        <span>Move to top</span>
      </button>
      <button
        className="w-full text-left px-3 py-2.5 bg-white transition-smooth space-x-2 items-center flex"
        onClick={() => onAction("moveToBottom")}
      >
        <img src={ArrowDown} alt="Move down" className="w-5 h-5 opacity-60" />
        <span>Move to bottom</span>
      </button>
      <div className="border-t border-slate-100" />
      <button
        className="w-full text-left px-3 py-2.5 bg-white transition-smooth space-x-2 items-center flex text-red-600"
        onClick={() => onAction("delete")}
      >
        <img src={TrashIcon} alt="Delete" className="w-5 h-5 opacity-60" />
        <span>Delete</span>
      </button>
    </div>
  );
};

export default ContextMenu;

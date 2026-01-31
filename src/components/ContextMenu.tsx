import { memo } from "react";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";

interface ContextMenuProps {
  onAction: (action: "moveToTop" | "moveToBottom" | "delete") => void;
  isVisible?: boolean;
}

const ContextMenu = memo<ContextMenuProps>(({ onAction, isVisible = true }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-xl border border-slate-200 z-50 w-52 text-slate-700 text-sm overflow-hidden transition-all duration-200 origin-top-left ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="w-full text-left px-3 py-2.5 bg-white hover:bg-slate-50 transition-colors duration-150 space-x-2 items-center flex"
        onClick={() => onAction("moveToTop")}
      >
        <ArrowUp className="w-4 h-4 text-slate-500" />
        <span>Move to top</span>
      </button>
      <button
        className="w-full text-left px-3 py-2.5 bg-white hover:bg-slate-50 transition-colors duration-150 space-x-2 items-center flex"
        onClick={() => onAction("moveToBottom")}
      >
        <ArrowDown className="w-4 h-4 text-slate-500" />
        <span>Move to bottom</span>
      </button>
      <div className="border-t border-slate-100" />
      <button
        className="w-full text-left px-3 py-2.5 bg-white hover:bg-red-50 transition-colors duration-150 space-x-2 items-center flex text-red-600"
        onClick={() => onAction("delete")}
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete</span>
      </button>
    </div>
  );
});

ContextMenu.displayName = "ContextMenu";

export default ContextMenu;

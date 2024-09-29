import ArrowDown from "../assets/IconArrowDown.svg";
import ArrowUp from "../assets/IconArrowUp.svg";
import TrashIcon from "../assets/IconDelete.svg";

interface ContextMenuProps {
  onAction: (action: "moveToTop" | "moveToBottom" | "delete") => void;
}

const ContextMenu = ({ onAction }: ContextMenuProps) => {
  return (
    <div className="bg-gray-200 rounded-xl z-900 w-60 text-gray-700 text-sm">
      <button
        className="w-full text-left px-3 py-3 hover:bg-gray-300 rounded-t-xl duration-200 space-x-2 items-center flex"
        onClick={() => onAction("moveToTop")}
      >
        <img src={ArrowUp} alt="arrow down" className="w-7 h-auto fill-black" />
        <span>Move to the top</span>
      </button>
      <button
        className="w-full text-left px-3 py-3 hover:bg-gray-300 duration-200 space-x-2 items-center flex"
        onClick={() => onAction("moveToBottom")}
      >
        <img
          src={ArrowDown}
          alt="arrow down"
          className="w-7 h-auto fill-black"
        />
        <span>Move to the Bottom</span>
      </button>
      <hr className="border-gray-300" />
      <button
        className="w-full text-left px-3 py-3 hover:bg-gray-300 rounded-b-xl duration-200 space-x-2 items-center flex"
        onClick={() => onAction("delete")}
      >
        <img
          src={TrashIcon}
          alt="arrow down"
          className="w-7 h-auto fill-black"
        />
        <span>Delete</span>
      </button>
    </div>
  );
};

export default ContextMenu;

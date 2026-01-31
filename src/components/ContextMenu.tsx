import { memo } from 'react';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

interface ContextMenuProps {
  onAction: (action: 'moveToTop' | 'moveToBottom' | 'delete') => void;
}

const ContextMenu = memo<ContextMenuProps>(({ onAction }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 z-50 w-52 text-slate-700 text-sm overflow-hidden">
      <button
        className="w-full text-left px-3 py-2.5 bg-white transition-smooth space-x-2 items-center flex"
        onClick={() => onAction('moveToTop')}
      >
        <ArrowUp className="w-4 h-4 text-slate-500" />
        <span>Move to top</span>
      </button>
      <button
        className="w-full text-left px-3 py-2.5 bg-white transition-smooth space-x-2 items-center flex"
        onClick={() => onAction('moveToBottom')}
      >
        <ArrowDown className="w-4 h-4 text-slate-500" />
        <span>Move to bottom</span>
      </button>
      <div className="border-t border-slate-100" />
      <button
        className="w-full text-left px-3 py-2.5 bg-white transition-smooth space-x-2 items-center flex text-red-600"
        onClick={() => onAction('delete')}
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete</span>
      </button>
    </div>
  );
});

ContextMenu.displayName = 'ContextMenu';

export default ContextMenu;

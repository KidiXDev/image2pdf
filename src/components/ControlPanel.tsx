import { Download, Plus, Trash2 } from 'lucide-react';
import { memo } from 'react';
import { useImageStore } from '../stores/imageStore';
import { useUIStore } from '../stores/uiStore';
import DropdownC from './DropdownC';

interface ControlPanelProps {
  isMobile?: boolean;
  onAddMoreImages?: () => void;
  onConvert: () => void;
}

const ControlPanel = memo<ControlPanelProps>(
  ({ isMobile = false, onAddMoreImages, onConvert }) => {
    const { compressedImages, clearAll } = useImageStore();
    const { pdfSettings, updatePDFSettings } = useUIStore();

    return (
      <div className={`${isMobile ? '' : 'space-y-5'}`}>
        {/* Stats */}
        <div className="bg-slate-50 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Total Images</span>
            <span className="font-semibold text-slate-800">
              {compressedImages.length}
            </span>
          </div>
        </div>

        {/* File Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-500">
            File Name
          </label>
          <input
            type="text"
            value={pdfSettings.fileName}
            onChange={(e) => updatePDFSettings({ fileName: e.target.value })}
            placeholder="result"
            className="w-full px-3 py-2.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        {/* Image Scaling */}
        <DropdownC
          label="Image Scaling"
          value={pdfSettings.imageScaling}
          elements={[
            { element: 'Default (Fit)', value: 'default' },
            { element: 'Cover', value: 'cover' },
            { element: 'Stretch', value: 'stretch' },
            { element: 'Fit to Image Size', value: 'fit-img-size' }
          ]}
          onChange={(value) => updatePDFSettings({ imageScaling: value })}
        />

        {/* Page Size */}
        <DropdownC
          label="Page Size"
          value={pdfSettings.pageSize}
          elements={[
            { element: 'A4 (210 × 297 mm)', value: 'a4' },
            { element: 'Letter (8.5 × 11 in)', value: 'letter' },
            { element: 'Legal (8.5 × 14 in)', value: 'legal' },
            { element: 'A3 (297 × 420 mm)', value: 'a3' },
            { element: 'A5 (148 × 210 mm)', value: 'a5' }
          ]}
          onChange={(value) => updatePDFSettings({ pageSize: value })}
        />

        {/* Orientation */}
        <DropdownC
          label="Orientation"
          value={pdfSettings.orientation}
          elements={[
            { element: 'Portrait', value: 'portrait' },
            { element: 'Landscape', value: 'landscape' }
          ]}
          onChange={(value) => updatePDFSettings({ orientation: value })}
        />

        {/* Margin */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-slate-500">Margin</label>
            <span className="text-xs text-slate-500">
              {pdfSettings.margin}mm
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            value={pdfSettings.margin}
            onChange={(e) =>
              updatePDFSettings({ margin: Number(e.target.value) })
            }
            className="range-slider w-full"
          />
        </div>

        {/* Quality */}
        <DropdownC
          label="Image Quality"
          value={pdfSettings.quality}
          elements={[
            { element: 'High Quality', value: 'high' },
            { element: 'Medium Quality', value: 'medium' },
            { element: 'Low Quality (Smaller file)', value: 'low' }
          ]}
          onChange={(value) => updatePDFSettings({ quality: value })}
        />

        {/* Actions */}
        <div className="space-y-2 pt-4">
          <button
            onClick={onConvert}
            className="w-full px-4 py-3 bg-primary-600 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 hover:bg-primary-700 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Convert to PDF
          </button>

          {onAddMoreImages && (
            <button
              onClick={onAddMoreImages}
              className="w-full px-4 py-2.5 bg-white text-slate-700 text-sm font-medium rounded-lg border border-slate-200 transition-all duration-200 hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add More Images
            </button>
          )}

          <button
            onClick={clearAll}
            className="w-full px-4 py-2.5 bg-white text-red-600 text-sm font-medium rounded-lg border border-red-200 transition-all duration-200 hover:bg-red-50 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>
    );
  }
);

ControlPanel.displayName = 'ControlPanel';

export default ControlPanel;

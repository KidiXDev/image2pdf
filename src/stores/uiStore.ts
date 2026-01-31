import { create } from 'zustand';

interface PDFSettings {
  pageSize: string;
  orientation: string;
  margin: number;
  quality: string;
  fileName: string;
  imageScaling: string;
}

interface UIState {
  isLoading: boolean;
  loadingTip: string;
  showMobilePanel: boolean;
  pdfSettings: PDFSettings;
  
  // Actions
  setLoading: (isLoading: boolean, tip?: string) => void;
  setLoadingTip: (tip: string) => void;
  setShowMobilePanel: (show: boolean) => void;
  updatePDFSettings: (settings: Partial<PDFSettings>) => void;
  resetPDFSettings: () => void;
}

const defaultPDFSettings: PDFSettings = {
  pageSize: 'a4',
  orientation: 'portrait',
  margin: 10,
  quality: 'high',
  fileName: 'result',
  imageScaling: 'default',
};

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  loadingTip: 'Please Wait',
  showMobilePanel: false,
  pdfSettings: { ...defaultPDFSettings },

  setLoading: (isLoading, tip) => set({ 
    isLoading, 
    loadingTip: tip ?? (isLoading ? 'Please Wait' : '') 
  }),

  setLoadingTip: (tip) => set({ loadingTip: tip }),

  setShowMobilePanel: (show) => set({ showMobilePanel: show }),

  updatePDFSettings: (settings) => set((state) => ({
    pdfSettings: { ...state.pdfSettings, ...settings }
  })),

  resetPDFSettings: () => set({ pdfSettings: { ...defaultPDFSettings } }),
}));

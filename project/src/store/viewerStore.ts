import { create } from 'zustand';

interface ViewerState {
  tool: string;
  mediaType: 'dicom' | 'video' | '3d';
  layout: string;
  setTool: (tool: string) => void;
  setMediaType: (mediaType: 'dicom' | 'video' | '3d') => void;
  setLayout: (layout: string) => void;
}

export const useViewerStore = create<ViewerState>((set) => ({
  tool: 'pan',
  mediaType: 'dicom',
  layout: '1x1',
  setTool: (tool) => set({ tool }),
  setMediaType: (mediaType) => set({ mediaType }),
  setLayout: (layout) => set({ layout }),
}));
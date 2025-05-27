import React, { useState } from 'react';
import {
  Move, ZoomIn, ZoomOut, RotateCw, RotateCcw, AlignJustify,
  FlipHorizontal, FlipVertical, Sun, Maximize, ChevronLeft,
  ChevronRight, Grid2x2, Grid3x3, RefreshCw, Play, Trash2, PenLine,
  Share2, Printer, FileDown, Grid
} from 'lucide-react';
import { useViewerStore } from '../store/viewerStore';

interface ViewerToolbarProps {
  activeTool: string;
  onToolChange: (tool: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPan: () => void;
  onFit: () => void;
  onRotate: (direction: 'cw' | 'ccw') => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onWindowLevel: () => void;
  onReset: () => void;
  onInvertColors: () => void;
  onFullScreen: () => void;
  onNextImage: () => void;
  onPrevImage: () => void;
  layout: string;
  onLayoutChange: (layout: string) => void;
  currentImageIndex: number;
  totalImages: number;
  onClearMeasurements: () => void;
  onPlayCine: () => void;
  onPrintImage: () => void;
  onAnnotate: () => void;
  onShare: () => void;
  onExport: () => void;
}

export const ViewerToolbar: React.FC<ViewerToolbarProps> = ({
  activeTool,
  onToolChange,
  onZoomIn,
  onZoomOut,
  onPan,
  onFit,
  onRotate,
  onFlipHorizontal,
  onFlipVertical,
  onWindowLevel,
  onReset,
  onInvertColors,
  onFullScreen,
  onNextImage,
  onPrevImage,
  layout,
  onLayoutChange,
  currentImageIndex,
  totalImages,
  onClearMeasurements,
  onPlayCine,
  onPrintImage,
  onAnnotate,
  onShare,
  onExport
}) => {
  const [showLayoutOptions, setShowLayoutOptions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const { mediaType } = useViewerStore();

  const toolButtons = [
    { name: 'Pan', icon: <Move size={18} />, action: () => onToolChange('Pan') },
    { name: 'Zoom', icon: <ZoomIn size={18} />, action: () => onToolChange('Zoom') },
    { name: 'Wwwc', icon: <Sun size={18} />, action: () => onToolChange('Wwwc') },
    { name: 'Length', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h20M2 18h20M2 6h20"/></svg>, action: () => onToolChange('Length') },
    { name: 'Angle', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18 L18 2 M2 2 L18 18"/></svg>, action: () => onToolChange('Angle') },
    { name: 'RectangleRoi', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>, action: () => onToolChange('RectangleRoi') },
    { name: 'EllipticalRoi', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>, action: () => onToolChange('EllipticalRoi') },
    { name: 'TextMarker', icon: <PenLine size={18} />, action: () => onToolChange('TextMarker') },
  ];

  return (
    <div className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-full mx-auto px-4 py-2">
        {/* Main toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Left side tools - Navigation */}
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm mr-1">Navigate:</span>
            <button
              className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              onClick={onPrevImage}
              disabled={currentImageIndex <= 0}
            >
              <ChevronLeft size={18} />
            </button>
            
            <span className="text-gray-300 text-xs">
              {currentImageIndex + 1} / {totalImages}
            </span>
            
            <button
              className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              onClick={onNextImage}
              disabled={currentImageIndex >= totalImages - 1}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Divider */}
          <div className="h-6 border-l border-gray-600"></div>

          {/* Middle tools - Measurement */}
          {mediaType === 'dicom' && (
            <div className="flex items-center space-x-1">
              <span className="text-white text-sm mr-1">Tools:</span>
              {toolButtons.map((tool) => (
                <button
                  key={tool.name}
                  className={`p-1 rounded ${
                    activeTool === tool.name ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                  onClick={tool.action}
                  title={tool.name}
                >
                  {tool.icon}
                </button>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="h-6 border-l border-gray-600"></div>

          {/* Manipulation tools */}
          <div className="flex items-center space-x-1">
            <span className="text-white text-sm mr-1">Display:</span>
            <button
              className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              onClick={onZoomIn}
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>
            <button
              className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              onClick={onZoomOut}
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
            <button
              className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              onClick={onFit}
              title="Fit to Screen"
            >
              <Maximize size={18} />
            </button>
            <button
              className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              onClick={() => onRotate('cw')}
              title="Rotate Clockwise"
            >
              <RotateCw size={18} />
            </button>
            <button
              className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              onClick={() => onRotate('ccw')}
              title="Rotate Counter-Clockwise"
            >
              <RotateCcw size={18} />
            </button>
            <button
              className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              onClick={onFlipHorizontal}
              title="Flip Horizontal"
            >
              <FlipHorizontal size={18} />
            </button>
            <button
              className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              onClick={onFlipVertical}
              title="Flip Vertical"
            >
              <FlipVertical size={18} />
            </button>
            <button
              className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              onClick={onInvertColors}
              title="Invert Colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20z" />
                <path d="M12 2v20" />
              </svg>
            </button>
            <button
              className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              onClick={onReset}
              title="Reset View"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          {/* Divider */}
          <div className="h-6 border-l border-gray-600"></div>

          {/* Right side tools - Actions */}
          <div className="flex items-center space-x-1">
            <span className="text-white text-sm mr-1">Actions:</span>
            {mediaType === 'dicom' && (
              <>
                <button
                  className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
                  onClick={onPlayCine}
                  title="Play Cine"
                >
                  <Play size={18} />
                </button>
                <button
                  className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
                  onClick={onClearMeasurements}
                  title="Clear Measurements"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
            <button
              className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              onClick={onPrintImage}
              title="Print"
            >
              <Printer size={18} />
            </button>
            <button
              className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              onClick={onExport}
              title="Export"
            >
              <FileDown size={18} />
            </button>
            
            {/* Layout selector with dropdown */}
            <div className="relative">
              <button
                className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
                onClick={() => setShowLayoutOptions(!showLayoutOptions)}
                title="Change Layout"
              >
                <Grid size={18} />
              </button>
              
              {showLayoutOptions && (
                <div className="absolute z-10 mt-2 w-36 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      className={`w-full px-4 py-2 text-left text-sm ${layout === '1x1' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                      onClick={() => { onLayoutChange('1x1'); setShowLayoutOptions(false); }}
                    >
                      Single View (1×1)
                    </button>
                    <button
                      className={`w-full px-4 py-2 text-left text-sm ${layout === '1x2' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                      onClick={() => { onLayoutChange('1x2'); setShowLayoutOptions(false); }}
                    >
                      Two View (1×2)
                    </button>
                    <button
                      className={`w-full px-4 py-2 text-left text-sm ${layout === '2x2' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                      onClick={() => { onLayoutChange('2x2'); setShowLayoutOptions(false); }}
                    >
                      Four View (2×2)
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Share options with dropdown */}
            <div className="relative">
              <button
                className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
                onClick={() => setShowShareOptions(!showShareOptions)}
                title="Share"
              >
                <Share2 size={18} />
              </button>
              
              {showShareOptions && (
                <div className="absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
                      onClick={() => { setShowShareOptions(false); }}
                    >
                      Email Link
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
                      onClick={() => { setShowShareOptions(false); }}
                    >
                      Copy Link
                    </button>
                    <button
                      className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
                      onClick={() => { setShowShareOptions(false); }}
                    >
                      Generate Report
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button
              className="p-1 text-gray-300 hover:text-white hover:bg-gray-700 rounded"
              onClick={onFullScreen}
              title="Full Screen"
            >
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
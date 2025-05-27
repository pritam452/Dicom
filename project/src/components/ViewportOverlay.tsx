import React from 'react';

interface ViewportOverlayProps {
  metadata: {
    patientName: string;
    patientId: string;
    studyDate: string;
    modality: string;
    seriesNumber?: string;
    instanceNumber?: string;
  };
  viewport: {
    scale?: number;
    voi?: {
      windowWidth: number;
      windowCenter: number;
    };
    invert?: boolean;
  };
  currentImageIndex: number;
  totalImages: number;
  onWindowLevelChange?: (windowWidth: number, windowCenter: number) => void;
}

export const ViewportOverlay: React.FC<ViewportOverlayProps> = ({
  metadata,
  viewport,
  currentImageIndex,
  totalImages
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top left - Patient info */}
      <div className="absolute top-2 left-2 text-white text-shadow p-2 rounded bg-black bg-opacity-30">
        <div className="text-sm font-semibold">{metadata.patientName}</div>
        <div className="text-xs">ID: {metadata.patientId}</div>
        <div className="text-xs">Date: {metadata.studyDate}</div>
      </div>

      {/* Top right - Image info */}
      <div className="absolute top-2 right-2 text-white text-shadow p-2 rounded bg-black bg-opacity-30">
        <div className="text-sm font-semibold">{metadata.modality}</div>
        {metadata.seriesNumber && (
          <div className="text-xs">Series: {metadata.seriesNumber}</div>
        )}
        <div className="text-xs">Image: {currentImageIndex + 1} / {totalImages}</div>
      </div>

      {/* Bottom left - Viewport info */}
      {viewport && (
        <div className="absolute bottom-2 left-2 text-white text-shadow p-2 rounded bg-black bg-opacity-30">
          <div className="text-xs">Zoom: {viewport.scale ? (viewport.scale * 100).toFixed(0) : 100}%</div>
          {viewport.voi && (
            <>
              <div className="text-xs">WW: {viewport.voi.windowWidth.toFixed(0)}</div>
              <div className="text-xs">WL: {viewport.voi.windowCenter.toFixed(0)}</div>
            </>
          )}
          {viewport.invert && <div className="text-xs">Inverted</div>}
        </div>
      )}

      <style jsx>{`
        .text-shadow {
          text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};
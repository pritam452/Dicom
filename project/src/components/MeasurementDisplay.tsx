import React from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

interface MeasurementDisplayProps {
  element: HTMLElement;
  activeTool: string;
  measurements: Record<string, any[]>;
}

export const MeasurementDisplay: React.FC<MeasurementDisplayProps> = ({
  element,
  activeTool,
  measurements
}) => {
  const formatMeasurement = (measurement: any, toolName: string): string => {
    switch (toolName) {
      case 'Length':
        return `${measurement.length.toFixed(2)} mm`;
      case 'Angle':
      case 'CobbAngle':
        return `${measurement.angle.toFixed(2)}°`;
      case 'RectangleRoi':
      case 'EllipticalRoi':
        return `Area: ${measurement.area.toFixed(2)} mm²`;
      case 'Probe':
        return `HU: ${measurement.huValue}`;
      case 'TextMarker':
        return measurement.text || '';
      case 'ArrowAnnotate':
        return measurement.text || '';
      case 'Bidirectional':
        return `L1: ${measurement.shortestDiameter.toFixed(2)} mm, L2: ${measurement.longestDiameter.toFixed(2)} mm`;
      default:
        return '';
    }
  };

  return (
    <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg max-w-xs">
      <h3 className="text-lg font-semibold mb-2">Measurements</h3>
      {Object.entries(measurements).map(([toolName, toolMeasurements]) => (
        <div key={toolName} className="mb-2">
          <h4 className="text-sm font-medium text-gray-300">{toolName}</h4>
          <ul className="list-disc list-inside">
            {toolMeasurements.map((measurement, index) => (
              <li key={index} className="text-sm">
                {formatMeasurement(measurement, toolName)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
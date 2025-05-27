import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';

export class CinePlayer {
  private element: HTMLElement;
  private imageIds: string[];
  private isPlaying: boolean = false;
  private frameRate: number = 10;
  private intervalId: number | null = null;
  private currentIndex: number = 0;
  private frameChangeCallback: ((index: number) => void) | null = null;

  constructor(element: HTMLElement, imageIds: string[]) {
    this.element = element;
    this.imageIds = imageIds;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public play(): void {
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    
    this.intervalId = window.setInterval(() => {
      this.nextFrame();
    }, 1000 / this.frameRate);
  }

  public stop(): void {
    if (!this.isPlaying) return;
    
    this.isPlaying = false;
    
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public setFrameRate(frameRate: number): void {
    this.frameRate = frameRate;
    
    if (this.isPlaying) {
      this.stop();
      this.play();
    }
  }

  public setFrameChangeCallback(callback: (index: number) => void): void {
    this.frameChangeCallback = callback;
  }

  private async nextFrame(): Promise<void> {
    if (this.currentIndex < this.imageIds.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
    
    try {
      const image = await cornerstone.loadImage(this.imageIds[this.currentIndex]);
      cornerstone.displayImage(this.element, image);
      
      if (this.frameChangeCallback) {
        this.frameChangeCallback(this.currentIndex);
      }
    } catch (error) {
      console.error('Error loading next frame:', error);
    }
  }

  public dispose(): void {
    this.stop();
  }
}

export const printImage = (element: HTMLElement, metadata: any): void => {
  const canvas = document.createElement('canvas');
  const enabledElement = cornerstone.getEnabledElement(element);
  
  if (!enabledElement || !enabledElement.canvas) {
    console.error('Unable to get canvas from enabled element');
    return;
  }
  
  const width = enabledElement.canvas.width;
  const height = enabledElement.canvas.height;
  
  canvas.width = width;
  canvas.height = height;
  
  const context = canvas.getContext('2d');
  if (!context) {
    console.error('Unable to get 2D context from canvas');
    return;
  }
  
  // Draw the image
  context.drawImage(enabledElement.canvas, 0, 0);
  
  // Add metadata text
  context.fillStyle = 'white';
  context.font = '14px Arial';
  context.textBaseline = 'top';
  
  const patientInfo = `Patient: ${metadata.patientName} (ID: ${metadata.patientId})`;
  const studyInfo = `Study Date: ${metadata.studyDate}, Modality: ${metadata.modality}`;
  
  // Add text with shadow for readability on the image
  context.shadowColor = 'black';
  context.shadowBlur = 4;
  context.shadowOffsetX = 1;
  context.shadowOffsetY = 1;
  
  context.fillText(patientInfo, 10, 10);
  context.fillText(studyInfo, 10, 30);
  
  // Add a timestamp
  const timestamp = `Printed: ${new Date().toLocaleString()}`;
  context.fillText(timestamp, 10, height - 30);
  
  // Create a print window
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to print images');
    return;
  }
  
  printWindow.document.write(`
    <html>
      <head>
        <title>Print - ${metadata.patientName}</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; }
          img { max-width: 100%; }
          @media print {
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
        <img src="${canvas.toDataURL('image/png')}" />
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          };
        </script>
      </body>
    </html>
  `);
  
  printWindow.document.close();
};

export const exportImage = (element: HTMLElement, format: 'png' | 'jpg', filename: string): void => {
  const enabledElement = cornerstone.getEnabledElement(element);
  
  if (!enabledElement || !enabledElement.canvas) {
    console.error('Unable to get canvas from enabled element');
    return;
  }
  
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const dataUrl = enabledElement.canvas.toDataURL(mimeType);
  
  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.click();
};
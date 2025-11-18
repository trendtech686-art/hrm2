/**
 * Export utilities for org chart
 * Export as PNG, SVG, PDF
 */

import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Download a data URL as a file
 */
function downloadFile(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/**
 * Export chart as PNG
 */
export async function exportAsPNG(elementSelector = '.react-flow') {
  try {
    const element = document.querySelector(elementSelector) as HTMLElement;
    if (!element) throw new Error('Chart element not found');

    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 2, // Higher quality
      filter: (node) => {
        // Exclude controls/panels
        return !node.classList?.contains('react-flow__panel');
      }
    });

    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(dataUrl, `org-chart-${timestamp}.png`);
    
    return { success: true };
  } catch (error) {
    console.error('Export PNG failed:', error);
    return { success: false, error };
  }
}

/**
 * Export chart as SVG
 */
export async function exportAsSVG(elementSelector = '.react-flow') {
  try {
    const element = document.querySelector(elementSelector) as HTMLElement;
    if (!element) throw new Error('Chart element not found');

    const dataUrl = await toSvg(element, {
      backgroundColor: '#ffffff',
      filter: (node) => {
        return !node.classList?.contains('react-flow__panel');
      }
    });

    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(dataUrl, `org-chart-${timestamp}.svg`);
    
    return { success: true };
  } catch (error) {
    console.error('Export SVG failed:', error);
    return { success: false, error };
  }
}

/**
 * Export chart as PDF
 */
export async function exportAsPDF(elementSelector = '.react-flow') {
  try {
    const element = document.querySelector(elementSelector) as HTMLElement;
    if (!element) throw new Error('Chart element not found');

    // Get PNG first
    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      filter: (node) => {
        return !node.classList?.contains('react-flow__panel');
      }
    });

    // Calculate dimensions
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => { img.onload = resolve; });

    // Create PDF with appropriate size
    const pdf = new jsPDF({
      orientation: img.width > img.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [img.width, img.height]
    });

    pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);

    const timestamp = new Date().toISOString().split('T')[0];
    pdf.save(`org-chart-${timestamp}.pdf`);
    
    return { success: true };
  } catch (error) {
    console.error('Export PDF failed:', error);
    return { success: false, error };
  }
}

/**
 * Export chart data as JSON
 */
export function exportAsJSON(data: any) {
  try {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(url, `org-chart-data-${timestamp}.json`);
    
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    console.error('Export JSON failed:', error);
    return { success: false, error };
  }
}

/**
 * Copy chart to clipboard as image
 */
export async function copyToClipboard(elementSelector = '.react-flow') {
  try {
    const element = document.querySelector(elementSelector) as HTMLElement;
    if (!element) throw new Error('Chart element not found');

    const blob = await toPng(element, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
      filter: (node) => {
        return !node.classList?.contains('react-flow__panel');
      }
    }).then(dataUrl => {
      return fetch(dataUrl).then(res => res.blob());
    });

    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);

    return { success: true };
  } catch (error) {
    console.error('Copy to clipboard failed:', error);
    return { success: false, error };
  }
}

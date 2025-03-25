// src/components/masterplan/export-masterplan.tsx
'use client';

import { useState } from 'react';
import { Masterplan, MasterplanFormat } from '@/types/masterplan';
import { useToast } from '@/contexts/ToastContext';

interface ExportMasterplanProps {
  masterplan: Masterplan;
}

export default function ExportMasterplan({ masterplan }: ExportMasterplanProps) {
  const { addToast } = useToast();
  const [exporting, setExporting] = useState<MasterplanFormat | null>(null);

  const handleExport = async (format: MasterplanFormat) => {
    setExporting(format);
    
    try {
      // Get content for the selected format
      const content = masterplan.formats[format];
      
      if (!content) {
        throw new Error(`Export format '${format}' is not available`);
      }
      
      // Create a blob based on the format
      let blob: Blob;
      let fileExtension: string;
      
      switch (format) {
        case 'markdown':
          blob = new Blob([content], { type: 'text/markdown' });
          fileExtension = 'md';
          break;
        case 'pdf':
          // In a real app, we'd generate a PDF here
          // For now, we'll just save the HTML that would be converted to PDF
          blob = new Blob([content], { type: 'text/html' });
          fileExtension = 'html';
          break;
        case 'confluence':
          blob = new Blob([content], { type: 'text/plain' });
          fileExtension = 'confluence';
          break;
        case 'jira':
          blob = new Blob([content], { type: 'text/plain' });
          fileExtension = 'jira';
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${masterplan.title.toLowerCase().replace(/\s+/g, '-')}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      addToast(`Successfully exported masterplan as ${format.toUpperCase()}`, 'success');
    } catch (error) {
      addToast(`Failed to export as ${format}: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
      console.error('Export error:', error);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Object.keys(masterplan.formats).map((format) => (
        <div 
          key={format}
          className="border border-gray-200 dark:border-gray-700 rounded-md p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
        >
          <h3 className="font-medium mb-2">{format.charAt(0).toUpperCase() + format.slice(1)}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {format === 'markdown' && 'Export as a Markdown file for easy editing in text editors.'}
            {format === 'pdf' && 'Export as a PDF document for professional presentation.'}
            {format === 'confluence' && 'Export in Confluence format for your wiki.'}
            {format === 'jira' && 'Export as Jira tickets for your project management.'}
          </p>
          <button
            onClick={() => handleExport(format as MasterplanFormat)}
            disabled={exporting !== null}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
          >
            {exporting === format ? 'Exporting...' : 'Download'}
          </button>
        </div>
      ))}
    </div>
  );
}
// src/lib/masterplan/generator.ts
import { Message } from '@/types/conversation';
import { Masterplan, MasterplanFormat, MasterplanSection } from '@/types/masterplan';
import { formatMarkdown, formatPDF, formatConfluence, formatJira } from './formatter';

interface GenerateMasterplanOptions {
  conversationId: string;
  messages: Message[];
  title?: string;
  formats?: MasterplanFormat[];
  customSections?: string[];
}

export class MasterplanGenerator {
  /**
   * Parse markdown content into sections
   */
  parseSections(markdownContent: string, customSections: string[] = []): MasterplanSection[] {
    // Split the markdown content by headings
    const lines = markdownContent.split('\n');
    const sections: MasterplanSection[] = [];
    
    let currentSection: MasterplanSection | null = null;
    let contentBuffer: string[] = [];
    
    for (const line of lines) {
      // Check if the line is a heading (starts with #)
      if (line.startsWith('# ') || line.startsWith('## ') || line.startsWith('### ')) {
        // If we have a current section, save it before starting a new one
        if (currentSection) {
          currentSection.content = contentBuffer.join('\n');
          sections.push(currentSection);
          contentBuffer = [];
        }
        
        // Create a new section
        const level = line.indexOf(' ');
        const title = line.slice(level + 1);
        
        currentSection = {
          id: `section-${sections.length + 1}`,
          title,
          level,
          content: ''
        };
      } else if (currentSection) {
        // Add the line to the current section's content
        contentBuffer.push(line);
      }
    }
    
    // Don't forget to add the last section
    if (currentSection) {
      currentSection.content = contentBuffer.join('\n');
      sections.push(currentSection);
    }
    
    return sections;
  }
  
  /**
   * Generate a masterplan from markdown content
   */
  generateFromMarkdown(
    markdownContent: string,
    conversationId: string,
    title = 'Product Masterplan',
    formats: MasterplanFormat[] = ['markdown']
  ): Masterplan {
    // Parse the markdown content into sections
    const sections = this.parseSections(markdownContent);
    
    // Create the masterplan object
    const masterplan: Masterplan = {
      id: `mp-${Date.now()}`,
      conversationId,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0',
      sections,
      formats: {}
    };
    
    // Generate all requested formats
    for (const format of formats) {
      masterplan.formats[format] = this.formatMasterplan(masterplan, format);
    }
    
    return masterplan;
  }
  
  /**
   * Format the masterplan into the requested format
   */
  formatMasterplan(masterplan: Masterplan, format: MasterplanFormat): string {
    switch (format) {
      case 'markdown':
        return formatMarkdown(masterplan);
      case 'pdf':
        return formatPDF(masterplan);
      case 'confluence':
        return formatConfluence(masterplan);
      case 'jira':
        return formatJira(masterplan);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }
}

export const masterplanGenerator = new MasterplanGenerator();
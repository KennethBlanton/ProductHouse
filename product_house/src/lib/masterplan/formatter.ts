// src/lib/masterplan/formatter.ts
import { Masterplan, MasterplanSection } from '@/types/masterplan';

/**
 * Format masterplan as Markdown
 */
export function formatMarkdown(masterplan: Masterplan): string {
  let markdown = `# ${masterplan.title}\n\n`;
  markdown += `*Version ${masterplan.version} - Updated: ${new Date(masterplan.updatedAt).toLocaleDateString()}*\n\n`;
  
  // Add table of contents
  markdown += '## Table of Contents\n\n';
  masterplan.sections.forEach((section) => {
    const indent = '  '.repeat(section.level - 1);
    markdown += `${indent}- [${section.title}](#${section.title.toLowerCase().replace(/\s+/g, '-')})\n`;
  });
  markdown += '\n';
  
  // Add sections
  masterplan.sections.forEach((section) => {
    const headingLevel = '#'.repeat(section.level);
    markdown += `${headingLevel} ${section.title}\n\n${section.content}\n\n`;
  });
  
  return markdown;
}

/**
 * Format masterplan as PDF (return HTML that can be converted to PDF)
 */
export function formatPDF(masterplan: Masterplan): string {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${masterplan.title}</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        .metadata { color: #666; font-style: italic; margin-bottom: 20px; }
        .toc { background-color: #f5f5f5; padding: 15px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section-title { border-bottom: 1px solid #ddd; padding-bottom: 5px; }
      </style>
    </head>
    <body>
      <h1>${masterplan.title}</h1>
      <div class="metadata">Version ${masterplan.version} - Updated: ${new Date(masterplan.updatedAt).toLocaleDateString()}</div>
      
      <div class="toc">
        <h2>Table of Contents</h2>
        <ul>
  `;
  
  // Add table of contents
  masterplan.sections.forEach((section) => {
    const indent = '&nbsp;&nbsp;'.repeat(section.level - 1);
    html += `<li>${indent}<a href="#${section.id}">${section.title}</a></li>`;
  });
  
  html += `
        </ul>
      </div>
  `;
  
  // Add sections
  masterplan.sections.forEach((section) => {
    const headingLevel = section.level + 1; // h1 is already used for the title
    html += `
      <div class="section">
        <h${headingLevel} id="${section.id}" class="section-title">${section.title}</h${headingLevel}>
        <div class="section-content">
          ${section.content.replace(/\n/g, '<br>')}
        </div>
      </div>
    `;
  });
  
  html += `
    </body>
    </html>
  `;
  
  return html;
}

/**
 * Format masterplan for Confluence
 */
export function formatConfluence(masterplan: Masterplan): string {
  // Simplified implementation - in a real project, this would use Confluence's API
  // or specific format requirements
  let confluenceMarkup = `h1. ${masterplan.title}\n\n`;
  confluenceMarkup += `_Version ${masterplan.version} - Updated: ${new Date(masterplan.updatedAt).toLocaleDateString()}_\n\n`;
  
  // Add table of contents macro
  confluenceMarkup += '{toc}\n\n';
  
  // Add sections
  masterplan.sections.forEach((section) => {
    const headingLevel = 'h' + (section.level + 1); // h1 is already used for the title
    confluenceMarkup += `${headingLevel}. ${section.title}\n\n${section.content}\n\n`;
  });
  
  return confluenceMarkup;
}

/**
 * Format masterplan as Jira tickets (Gherkin format)
 */
export function formatJira(masterplan: Masterplan): string {
  // This is a simplified implementation - in a real project,
  // this would generate actual Jira API payloads or importable format
  
  let jiraFormat = '';
  
  // Find Features section
  const featuresSection = masterplan.sections.find(s => 
    s.title.toLowerCase().includes('feature') || 
    s.title.toLowerCase().includes('functionality')
  );
  
  if (featuresSection) {
    // Extract features as potential epics
    const features = featuresSection.content
      .split('\n')
      .filter(line => line.startsWith('-') || line.startsWith('*'))
      .map(line => line.replace(/^[-*]\s*/, '').trim());
    
    // Generate epics and stories
    jiraFormat += `# Epics and User Stories for ${masterplan.title}\n\n`;
    
    features.forEach((feature, index) => {
      jiraFormat += `## Epic: ${feature}\n\n`;
      
      // Generate some sample user stories for each feature
      jiraFormat += `### User Stories:\n\n`;
      jiraFormat += `* As a user, I want to ${feature.toLowerCase()}, so that I can improve my workflow\n`;
      jiraFormat += `* As an admin, I want to manage ${feature.toLowerCase()}, so that I can ensure quality\n\n`;
      
      // Add Gherkin format for one story
      jiraFormat += `### Acceptance Criteria (Example):\n\n`;
      jiraFormat += `\`\`\`gherkin
Feature: ${feature}

  Scenario: Basic functionality
    Given I am logged in as a user
    When I access the ${feature.toLowerCase()} feature
    Then I should be able to perform basic operations
    
  Scenario: Advanced usage
    Given I am logged in as an admin
    When I configure the ${feature.toLowerCase()} feature
    Then I should see advanced options available
\`\`\`\n\n`;
    });
    
    jiraFormat += `## Technical Tasks\n\n`;
    jiraFormat += `* Set up project structure for ${masterplan.title}\n`;
    jiraFormat += `* Create database schema\n`;
    jiraFormat += `* Implement authentication\n`;
    jiraFormat += `* Create API endpoints\n`;
    jiraFormat += `* Develop frontend UI components\n`;
    jiraFormat += `* Implement integration tests\n`;
  }
  
  return jiraFormat;
}
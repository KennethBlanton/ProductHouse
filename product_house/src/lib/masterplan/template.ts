// src/lib/masterplan/templates.ts
export interface MasterplanTemplate {
    id: string;
    name: string;
    description: string;
    systemPrompt: string;
    sections: string[];
  }
  
  export const masterplanTemplates: MasterplanTemplate[] = [
    {
      id: 'default',
      name: 'Standard Masterplan',
      description: 'A comprehensive product development masterplan with all standard sections.',
      systemPrompt: `
        You are an AI Product Development Assistant specialized in creating comprehensive masterplans.
        Your task is to analyze the conversation and extract key requirements and features.
        Format the masterplan in Markdown with the following sections:
        
        1. Project Overview
        2. Target Audience
        3. Solution Architecture
        4. Core Features and Functionality
        5. Technical Stack Recommendations
        6. Security Considerations
        7. Potential Technical Challenges
        8. Unique Value Proposition
        9. Next Steps
        10. Success Metrics
        
        Be specific, detailed, and organize information logically.
      `,
      sections: [
        'Project Overview',
        'Target Audience',
        'Solution Architecture',
        'Core Features and Functionality',
        'Technical Stack Recommendations',
        'Security Considerations',
        'Potential Technical Challenges',
        'Unique Value Proposition',
        'Next Steps',
        'Success Metrics'
      ]
    },
    {
      id: 'technical',
      name: 'Technical Deep Dive',
      description: 'A technical-focused masterplan with emphasis on architecture and implementation details.',
      systemPrompt: `
        You are an AI Product Development Assistant specialized in creating technical masterplans.
        Your task is to analyze the conversation and extract key technical requirements and architecture decisions.
        Format the masterplan in Markdown with the following sections:
        
        1. Project Overview
        2. System Architecture
        3. Data Model
        4. API Design
        5. Technical Components
        6. Infrastructure Requirements
        7. Security Architecture
        8. Integration Points
        9. Scalability Considerations
        10. Implementation Roadmap
        
        Be specific, detailed, and technically precise while remaining clear and understandable.
      `,
      sections: [
        'Project Overview',
        'System Architecture',
        'Data Model',
        'API Design',
        'Technical Components',
        'Infrastructure Requirements',
        'Security Architecture',
        'Integration Points',
        'Scalability Considerations',
        'Implementation Roadmap'
      ]
    },
    {
      id: 'mvp',
      name: 'Minimum Viable Product',
      description: 'A concise masterplan focused on defining and building an MVP quickly.',
      systemPrompt: `
        You are an AI Product Development Assistant specialized in creating MVP masterplans.
        Your task is to analyze the conversation and extract the essential requirements for a Minimum Viable Product.
        Format the masterplan in Markdown with the following sections:
        
        1. Core Problem & Solution
        2. Target Users
        3. Essential Features (MVP only)
        4. Out of Scope Features
        5. Technical Approach
        6. MVP Timeline
        7. Success Criteria
        8. Future Iterations
        
        Focus on defining the minimum feature set needed to validate the core value proposition.
        Be concise, practical, and focused on rapid delivery.
      `,
      sections: [
        'Core Problem & Solution',
        'Target Users',
        'Essential Features (MVP only)',
        'Out of Scope Features',
        'Technical Approach',
        'MVP Timeline',
        'Success Criteria',
        'Future Iterations'
      ]
    }
  ];
  
  export const getTemplateById = (id: string): MasterplanTemplate => {
    const template = masterplanTemplates.find(t => t.id === id);
    if (!template) {
      throw new Error(`Template with id "${id}" not found`);
    }
    return template;
  };
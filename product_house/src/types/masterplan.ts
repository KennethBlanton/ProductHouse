export type MasterplanFormat = 'markdown' | 'pdf' | 'confluence' | 'jira';

export interface MasterplanSection {
  id: string;
  title: string;
  level: number;
  content: string;
}

export interface MasterplanComment {
  id: string;
  userId: string;
  userName: string;
  sectionId: string;
  content: string;
  timestamp: string;
  category?: 'clarification' | 'risk' | 'modification' | 'technical';
  mentions?: string[]; // User IDs mentioned
}

export interface Masterplan {
  id: string;
  conversationId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  sections: MasterplanSection[];
  formats: {
    [key in MasterplanFormat]?: string;
  };
  comments?: MasterplanComment[];
}

export interface MasterplanVersion {
  id: string;
  masterplanId: string;
  version: string;
  createdAt: string;
  userId: string;
  userName: string;
  changes: {
    sectionId: string;
    oldContent?: string;
    newContent: string;
  }[];
}
// src/components/masterplan/review-workflow.tsx
'use client';

import { useState } from 'react';
import { useClaudeApi } from '@/hooks/useClaudeApi';
import { useToast } from '@/contexts/ToastContext';
import { Masterplan, MasterplanSection } from '@/types/masterplan';
import Loading from '@/components/ui/loading';

interface ReviewWorkflowProps {
  masterplan: Masterplan;
  onApplyChanges: (updatedSections: MasterplanSection[]) => Promise<void>;
}

export default function ReviewWorkflow({ masterplan, onApplyChanges }: ReviewWorkflowProps) {
  const { sendMessage } = useClaudeApi();
  const { addToast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{
    sectionId: string;
    sectionTitle: string;
    originalContent: string;
    suggestedContent: string;
    selected: boolean;
  }>>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    setLoading(true);
    setSuggestions([]);
    
    try {
      // Prepare the masterplan content for Claude
      const masterplanText = masterplan.sections
        .map(section => `## ${section.title}\n\n${section.content}`)
        .join('\n\n');
      
      // System message to guide Claude's response format
      const system = `
        You are an AI assistant reviewing a product masterplan. The user will provide a request 
        for modifications to the masterplan. Your task is to suggest specific changes to the 
        relevant sections based on the user's request.

        Analyze the masterplan carefully and provide targeted suggestions for the sections that 
        need to be modified. Format your response as follows:

        For each section that needs changes:
        1. Begin with "SECTION_ID: {section id}" on its own line
        2. Then "SECTION_TITLE: {section title}" on its own line
        3. Then "SUGGESTED_CONTENT:" on its own line
        4. Then provide the complete revised content for that section
        5. End with "END_SECTION" on its own line

        Only include sections that need changes. Maintain the overall structure and detail level
        of the original content, but improve it according to the user's request.
      `;
      
      // Create messages to send to Claude
      const messages = [
        {
          id: '1',
          content: `Here is the current masterplan:\n\n${masterplanText}\n\nRequest for modifications: ${prompt}`,
          sender: 'user',
          timestamp: new Date().toISOString()
        }
      ];
      
      // Get suggestions from Claude
      const response = await sendMessage(messages, system);
      
      // Parse Claude's response to extract section suggestions
      const sectionRegex = /SECTION_ID: (.*)\nSECTION_TITLE: (.*)\nSUGGESTED_CONTENT:\n([\s\S]*?)\nEND_SECTION/g;
      let match;
      const newSuggestions = [];
      
      while ((match = sectionRegex.exec(response.content)) !== null) {
        const sectionId = match[1].trim();
        const sectionTitle = match[2].trim();
        const suggestedContent = match[3].trim();
        
        // Find original section
        const originalSection = masterplan.sections.find(s => s.id === sectionId);
        
        if (originalSection) {
          newSuggestions.push({
            sectionId,
            sectionTitle,
            originalContent: originalSection.content,
            suggestedContent,
            selected: true // Selected by default
          });
        }
      }
      
      setSuggestions(newSuggestions);
      
      if (newSuggestions.length === 0) {
        addToast('No specific suggestions were generated. Try being more specific in your request.', 'info');
      }
    } catch (error) {
      addToast('Failed to generate suggestions. Please try again.', 'error');
      console.error('Suggestion generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSuggestion = (index: number) => {
    setSuggestions(prev => 
      prev.map((suggestion, i) => 
        i === index ? { ...suggestion, selected: !suggestion.selected } : suggestion
      )
    );
  };

  const handleApplyChanges = async () => {
    const selectedSuggestions = suggestions.filter(s => s.selected);
    
    if (selectedSuggestions.length === 0) {
      addToast('No suggestions selected to apply', 'info');
      return;
    }
    
    setLoading(true);
    
    try {
      // Create updated sections
      const updatedSections = [...masterplan.sections];
      
      selectedSuggestions.forEach(suggestion => {
        const sectionIndex = updatedSections.findIndex(s => s.id === suggestion.sectionId);
        if (sectionIndex !== -1) {
          updatedSections[sectionIndex] = {
            ...updatedSections[sectionIndex],
            content: suggestion.suggestedContent
          };
        }
      });
      
      // Apply changes
      await onApplyChanges(updatedSections);
      
      // Reset state
      setSuggestions([]);
      setPrompt('');
      
      addToast('Changes applied successfully!', 'success');
    } catch (error) {
      addToast('Failed to apply changes. Please try again.', 'error');
      console.error('Apply changes error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6">
      <h2 className="text-xl font-semibold mb-4">AI-Assisted Review</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            What would you like to improve in this masterplan?
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Add more technical details to the architecture section, or Make the next steps more actionable..."
            rows={3}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? 'Generating suggestions...' : 'Generate Suggestions'}
        </button>
      </form>
      
      {loading && (
        <div className="my-6">
          <Loading size="small" message="Processing your request..." />
        </div>
      )}
      
      {suggestions.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Suggestions</h3>
          
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.sectionId}
              className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
            >
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="checkbox"
                  checked={suggestion.selected}
                  onChange={() => toggleSuggestion(index)}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600 rounded"
                />
                <h4 className="font-medium">{suggestion.sectionTitle}</h4>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Original</h5>
                  <div className="whitespace-pre-wrap text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3">
                    {suggestion.originalContent}
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Suggested Changes</h5>
                  <div className="whitespace-pre-wrap text-sm bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                    {suggestion.suggestedContent}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-end mt-4">
            <button
              onClick={handleApplyChanges}
              disabled={loading || suggestions.filter(s => s.selected).length === 0}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded-md disabled:opacity-50"
            >
              Apply Selected Changes
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tips for effective AI assistance:</h3>
        <ul className="text-sm text-gray-500 dark:text-gray-400 list-disc pl-5 space-y-1">
          <li>Be specific about what sections need improvement</li>
          <li>Provide concrete examples or guidance on the direction</li>
          <li>Consider focusing on one aspect at a time for better results</li>
          <li>Review suggestions carefully before applying them</li>
        </ul>
      </div>
    </div>
  );
}
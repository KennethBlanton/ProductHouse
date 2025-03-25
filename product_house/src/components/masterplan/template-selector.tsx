// src/components/masterplan/template-selector.tsx
'use client';

import { useState } from 'react';
import { masterplanTemplates, MasterplanTemplate } from '@/lib/masterplan/templates';

interface TemplateSelectorProps {
  onSelect: (template: MasterplanTemplate) => void;
  onCancel: () => void;
}

export default function TemplateSelector({ onSelect, onCancel }: TemplateSelectorProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(masterplanTemplates[0].id);

  const handleSubmit = () => {
    const template = masterplanTemplates.find(t => t.id === selectedTemplateId);
    if (template) {
      onSelect(template);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md p-6">
      <h2 className="text-xl font-semibold mb-4">Select Masterplan Template</h2>
      
      <div className="space-y-4 mb-6">
        {masterplanTemplates.map(template => (
          <div
            key={template.id}
            className={`border rounded-md p-4 cursor-pointer ${
              selectedTemplateId === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedTemplateId(template.id)}
          >
            <div className="flex items-center">
              <input
                type="radio"
                checked={selectedTemplateId === template.id}
                onChange={() => setSelectedTemplateId(template.id)}
                className="mr-2"
              />
              <div>
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Use Template
        </button>
      </div>
    </div>
  );
}
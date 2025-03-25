// src/components/settings/user-settings.tsx
'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';

export default function UserSettings() {
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  // Mock settings
  const [settings, setSettings] = useState({
    emailNotifications: true,
    aiModel: 'claude-3-opus',
    defaultMasterplanTemplate: 'default'
  });

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    // Mock API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    addToast('Settings saved successfully', 'success');
    setSaving(false);
  };

  // src/components/settings/user-settings.tsx (continued)
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6">
      <h2 className="text-xl font-semibold mb-6">User Settings</h2>
      
      <div className="space-y-6">
        {/* Theme Settings */}
        <div>
          <h3 className="text-lg font-medium mb-3">Appearance</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="theme"
                checked={theme === 'light'}
                onChange={() => handleThemeChange('light')}
                className="mr-2"
              />
              Light Mode
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="theme"
                checked={theme === 'dark'}
                onChange={() => handleThemeChange('dark')}
                className="mr-2"
              />
              Dark Mode
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="theme"
                checked={theme === 'system'}
                onChange={() => handleThemeChange('system')}
                className="mr-2"
              />
              System Default
            </label>
          </div>
        </div>
        
        {/* Notification Settings */}
        <div>
          <h3 className="text-lg font-medium mb-3">Notifications</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="mr-2"
              />
              Email Notifications
            </label>
          </div>
        </div>
        
        {/* AI Model Settings */}
        <div>
          <h3 className="text-lg font-medium mb-3">AI Model</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Default Model
            </label>
            <select
              value={settings.aiModel}
              onChange={(e) => handleSettingChange('aiModel', e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md p-2"
            >
              <option value="claude-3-opus">Claude 3 Opus (Highest Quality)</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet (Balanced)</option>
              <option value="claude-3-haiku">Claude 3 Haiku (Fastest)</option>
            </select>
          </div>
        </div>
        
        {/* Masterplan Settings */}
        <div>
          <h3 className="text-lg font-medium mb-3">Masterplan Defaults</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Default Template
            </label>
            <select
              value={settings.defaultMasterplanTemplate}
              onChange={(e) => handleSettingChange('defaultMasterplanTemplate', e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md p-2"
            >
              <option value="default">Standard Masterplan</option>
              <option value="technical">Technical Deep Dive</option>
              <option value="mvp">Minimum Viable Product</option>
            </select>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
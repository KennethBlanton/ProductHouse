// src/components/masterplan/version-history.tsx
'use client';

import { useState } from 'react';
import { MasterplanVersion } from '@/types/masterplan';
import { useToast } from '@/contexts/ToastContext';

interface VersionHistoryProps {
  versions: MasterplanVersion[];
  currentVersion: string;
  onRestoreVersion: (versionId: string) => Promise<void>;
}

export default function VersionHistory({
  versions,
  currentVersion,
  onRestoreVersion
}: VersionHistoryProps) {
  const { addToast } = useToast();
  const [isRestoring, setIsRestoring] = useState<string | null>(null);
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(null);

  const handleRestore = async (versionId: string) => {
    if (versionId === currentVersion) {
      addToast('This is already the current version', 'info');
      return;
    }

    setIsRestoring(versionId);

    try {
      await onRestoreVersion(versionId);
      addToast('Successfully restored version', 'success');
    } catch (error) {
      addToast('Failed to restore version', 'error');
      console.error('Error restoring version:', error);
    } finally {
      setIsRestoring(null);
    }
  };

  const toggleVersionDetails = (versionId: string) => {
    setExpandedVersionId(expandedVersionId === versionId ? null : versionId);
  };

  // Sort versions by date (newest first)
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Version History</h2>

      {sortedVersions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 italic">No version history available</p>
      ) : (
        <div className="space-y-4">
          {sortedVersions.map((version) => (
            <div
              key={version.id}
              className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden"
            >
              <div
                className={`p-4 ${
                  version.version === currentVersion
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium">Version {version.version}</span>
                      {version.version === currentVersion && (
                        <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Updated by {version.userName} on{' '}
                      {new Date(version.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleVersionDetails(version.id)}
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <svg
                        className={`w-5 h-5 transition-transform ${
                          expandedVersionId === version.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {version.version !== currentVersion && (
                      <button
                        type="button"
                        onClick={() => handleRestore(version.id)}
                        disabled={isRestoring !== null}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        {isRestoring === version.id ? 'Restoring...' : 'Restore'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {expandedVersionId === version.id && version.changes.length > 0 && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                  <h4 className="font-medium mb-2">Changes</h4>
                  <ul className="space-y-3">
                    {version.changes.map((change, index) => (
                      <li
                        key={index}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3"
                      >
                        <div className="font-medium text-sm mb-1">Section updated</div>
                        {change.oldContent && (
                          <div className="text-sm">
                            <div className="text-red-600 dark:text-red-400 line-through mb-2">
                              {change.oldContent.length > 100
                                ? `${change.oldContent.substring(0, 100)}...`
                                : change.oldContent}
                            </div>
                            <div className="text-green-600 dark:text-green-400">
                              {change.newContent.length > 100
                                ? `${change.newContent.substring(0, 100)}...`
                                : change.newContent}
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
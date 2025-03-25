// src/hooks/useMasterplanCollaboration.ts
'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Masterplan, 
  MasterplanComment, 
  MasterplanVersion, 
  MasterplanSection 
} from '@/types/masterplan';
import { useAuth } from '@/contexts/AuthContext';
import { useMasterplan } from '@/hooks/useMasterplan';

export function useMasterplanCollaboration(masterplanId: string) {
  const { user } = useAuth();
  const { 
    masterplan, 
    loading, 
    error, 
    updateMasterplan 
  } = useMasterplan(masterplanId);
  
  const [comments, setComments] = useState<MasterplanComment[]>([]);
  const [versions, setVersions] = useState<MasterplanVersion[]>([]);
  const [saving, setSaving] = useState(false);

  // Initialize data when masterplan is loaded
  useEffect(() => {
    if (masterplan) {
      setComments(masterplan.comments || []);
      // In a real app, versions would be loaded from an API
      // For now, we'll initialize with an empty array
      setVersions([]);
    }
  }, [masterplan]);

  // Add a new comment
  const addComment = async (comment: Omit<MasterplanComment, 'id' | 'timestamp'>) => {
    if (!masterplan || !user) return;

    setSaving(true);
    try {
      const newComment: MasterplanComment = {
        ...comment,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
      };

      const updatedComments = [...comments, newComment];
      setComments(updatedComments);

      await updateMasterplan(masterplan.id, {
        comments: updatedComments,
      });

      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // Delete a comment
  const deleteComment = async (commentId: string) => {
    if (!masterplan) return;

    setSaving(true);
    try {
      const updatedComments = comments.filter(comment => comment.id !== commentId);
      setComments(updatedComments);

      await updateMasterplan(masterplan.id, {
        comments: updatedComments,
      });

      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // Create a new version
  const createVersion = async (updatedSections: MasterplanSection[]) => {
    if (!masterplan || !user) return;

    setSaving(true);
    try {
      // Calculate version number
      const currentVersion = parseFloat(masterplan.version);
      const newVersionNumber = (currentVersion + 0.1).toFixed(1);

      // Identify changes
      const changes = masterplan.sections.map((oldSection, index) => {
        const newSection = updatedSections[index];
        if (oldSection.content !== newSection.content) {
          return {
            sectionId: oldSection.id,
            oldContent: oldSection.content,
            newContent: newSection.content,
          };
        }
        return null;
      }).filter(change => change !== null);

      // Create version record
      const newVersion: MasterplanVersion = {
        id: uuidv4(),
        masterplanId: masterplan.id,
        version: newVersionNumber,
        createdAt: new Date().toISOString(),
        userId: user.id,
        userName: user.name,
        changes: changes as { sectionId: string; oldContent?: string; newContent: string }[],
      };

      // Update masterplan with new version number and sections
      await updateMasterplan(masterplan.id, {
        version: newVersionNumber,
        sections: updatedSections,
      });

      // Update local versions
      const updatedVersions = [...versions, newVersion];
      setVersions(updatedVersions);

      return newVersion;
    } catch (error) {
      console.error('Error creating version:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // Restore to a previous version
  const restoreVersion = async (versionId: string) => {
    if (!masterplan) return;

    setSaving(true);
    try {
      const version = versions.find(v => v.id === versionId);
      if (!version) {
        throw new Error('Version not found');
      }

      // Restore sections from version
      const restoredSections = [...masterplan.sections];
      version.changes.forEach(change => {
        const sectionIndex = restoredSections.findIndex(s => s.id === change.sectionId);
        if (sectionIndex !== -1) {
          restoredSections[sectionIndex] = {
            ...restoredSections[sectionIndex],
            content: change.newContent,
          };
        }
      });

      // Update masterplan with restored version
      await updateMasterplan(masterplan.id, {
        version: version.version,
        sections: restoredSections,
      });

      return true;
    } catch (error) {
      console.error('Error restoring version:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  // Apply AI refinement to a section
  const applyAIRefinement = async (sectionId: string, newContent: string) => {
    if (!masterplan || !user) return;

    setSaving(true);
    try {
      // Create updated sections
      const updatedSections = masterplan.sections.map(section =>
        section.id === sectionId ? { ...section, content: newContent } : section
      );

      // Create a new version with this change
      await createVersion(updatedSections);

      return true;
    } catch (error) {
      console.error('Error applying AI refinement:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return {
    masterplan,
    comments,
    versions,
    loading,
    error,
    saving,
    addComment,
    deleteComment,
    createVersion,
    restoreVersion,
    applyAIRefinement,
  };  // First closing brace for the return object
}     // Second closing brace for the function

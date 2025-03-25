// src/hooks/useMasterplan.ts
'use client';

import { useState, useEffect } from 'react';
import { Masterplan, MasterplanFormat, MasterplanComment } from '@/types/masterplan';
import { useClaudeApi } from './useClaudeApi';
import { masterplanGenerator } from '@/lib/masterplan/generator';
import { Message } from '@/types/conversation';
import { 
  createMasterplan as dbCreateMasterplan,
  getMasterplanById, 
  getMasterplansByUserId,

  updateMasterplan as dbUpdateMasterplan,
  deleteMasterplan,
  getMasterplanVersions
} from '@/lib/repositories/masterplan.repository';
import { 
  addComment, 
  getCommentsBySectionId, 
  getCommentsByMasterplanId,
  updateComment,
  deleteComment
} from '@/lib/repositories/comments.repository';
import { useAuth } from '@/contexts/AuthContext';

export function useMasterplan(masterplanId?: string) {
  const [masterplan, setMasterplan] = useState<Masterplan | null>(null);
  const [masterplans, setMasterplans] = useState<Masterplan[]>([]);
  const [comments, setComments] = useState<MasterplanComment[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const claudeApi = useClaudeApi();
  const { user } = useAuth();
  
  // Load all masterplans
  const loadMasterplans = async () => {
    if (!user) {
      setError("User not authenticated");
      return [];
    }

    try {
      setLoading(true);
      const plans = await getMasterplansByUserId(user.id);
      setMasterplans(plans);
      return plans;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refine section';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Load masterplan if ID is provided
  useEffect(() => {
    if (masterplanId && user) {
      loadMasterplan(masterplanId).catch(err => {
        console.error('Error loading masterplan:', err);
      });
    }
  }, [masterplanId, user]);
  
  // Load all masterplans initially
  useEffect(() => {
    if (user) {
      loadMasterplans().catch(err => {
        console.error('Error loading masterplans:', err);
      });
    }
  }, [user]);
  
  return {
    masterplan,
    masterplans,
    comments,
    versions,
    loading,
    error,
    createMasterplan,
    updateMasterplan,
    removeMasterplan,
    loadMasterplan,
    loadMasterplans,
    addMasterplanComment,
    updateMasterplanComment,
    deleteMasterplanComment,
    refineMasterplanSection
  };
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete comment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // AI-assisted refinement of masterplan sections
  const refineMasterplanSection = async (
    sectionId: string,
    sectionTitle: string,
    content: string,
    refinementPrompt: string
  ) => {
    try {
      setLoading(true);
      
      // Use Claude API to refine the section
      const refinedContent = await claudeApi.refineMasterplanSection(
        sectionTitle,
        content,
        refinementPrompt
      );
      
      // If there's an active masterplan, update the section in it
      if (masterplan) {
        const updatedSections = masterplan.sections.map(section => 
          section.id === sectionId 
            ? { ...section, content: refinedContent }
            : section
        );
        
        // Update masterplan with refined section
        const updatedMasterplan = await updateMasterplan(
          masterplan.id,
          { sections: updatedSections }
        );
        
        return refinedContent;
      }
      
      return refinedContent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add comment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update a comment
  const updateMasterplanComment = async (
    commentId: string,
    content: string,
    category?: string
  ) => {
    try {
      setLoading(true);
      
      const updatedComment = await updateComment(commentId, content, category);
      
      // Update comments state
      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId ? updatedComment : comment
        )
      );
      
      return updatedComment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update comment';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a comment
  const deleteMasterplanComment = async (commentId: string) => {
    try {
      setLoading(true);
      
      const success = await deleteComment(commentId);
      
      if (!success) {
        throw new Error(`Failed to delete comment: ${commentId}`);
      }
      
      // Update comments state
      setComments(prevComments => 
        prevComments.filter(comment => comment.id !== commentId)
      );
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete masterplan';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Add comment to a masterplan section
  const addMasterplanComment = async (
    sectionId: string,
    content: string,
    category?: string,
    mentions: string[] = []
  ) => {
    if (!user || !masterplan) {
      throw new Error('User not authenticated or no active masterplan');
    }

    try {
      setLoading(true);
      
      const newComment = await addComment(
        sectionId,
        masterplan.id,
        user.id,
        content,
        category,
        mentions
      );
      
      // Update comments state
      setComments(prevComments => [...prevComments, newComment]);
      
      return newComment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update masterplan';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete masterplan
  const removeMasterplan = async (id: string) => {
    try {
      setLoading(true);
      
      // Delete masterplan from database
      const success = await deleteMasterplan(id);
      
      if (!success) {
        throw new Error(`Failed to delete masterplan: ${id}`);
      }
      
      // Update state
      if (masterplan?.id === id) {
        setMasterplan(null);
      }
      
      // Refresh masterplans list
      await loadMasterplans();
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create masterplan';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update masterplan
  const updateMasterplan = async (
    id: string,
    updates: Partial<Masterplan>,
    createNewVersion: boolean = false
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      setLoading(true);
      
      // Update masterplan in database
      const updatedMasterplan = await dbUpdateMasterplan(
        id, 
        updates, 
        user.id,
        createNewVersion
      );
      
      // Update state
      setMasterplan(updatedMasterplan);
      
      // Refresh masterplans list
      await loadMasterplans();
      
      // If creating a new version, refresh versions list
      if (createNewVersion) {
        const masterplanVersions = await getMasterplanVersions(id);
        setVersions(masterplanVersions);
      }
      
      return updatedMasterplan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load masterplans';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Load masterplan by ID
  const loadMasterplan = async (id: string) => {
    try {
      setLoading(true);
      const plan = await getMasterplanById(id);
      
      if (!plan) {
        throw new Error(`Masterplan not found: ${id}`);
      }
      
      setMasterplan(plan);

      // Load comments for this masterplan
      const masterplanComments = await getCommentsByMasterplanId(id);
      setComments(masterplanComments);

      // Load versions for this masterplan
      const masterplanVersions = await getMasterplanVersions(id);
      setVersions(masterplanVersions);
      
      return plan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load masterplan';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Create masterplan from conversation
  const createMasterplan = async (
    conversationId: string,
    messages: Message[],
    title: string,
    formats: MasterplanFormat[] = ['markdown']
  ) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      setLoading(true);
      
      // Generate masterplan content using Claude API
      const content = await claudeApi.generateMasterplan(messages);
      
      // Create masterplan object
      const newMasterplan = masterplanGenerator.generateFromMarkdown(
        content,
        conversationId,
        title,
        formats
      );
      
      // Save masterplan to database
      const savedMasterplan = await dbCreateMasterplan({
        ...newMasterplan,
        conversationId
      }, user.id);
      
      // Update state
      setMasterplan(savedMasterplan);
      
      // Refresh masterplans list
      await loadMasterplans();
      
      return savedMasterplan;
    } catch (err) {
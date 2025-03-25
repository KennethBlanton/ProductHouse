import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClaudeApi } from './useClaudeApi';
import { 
  getMasterplanById, 
  getMasterplansByUserId,
  getMasterplanVersions 
} from '@/lib/repositories/masterplan.repository';
import { getCommentsByMasterplanId } from '@/lib/repositories/comments.repository';
import { MasterplanGenerator } from '@/lib/masterplan/generator';

export function useMasterplan(masterplanId?: string) {
  const [masterplan, setMasterplan] = useState(null);
  const [masterplans, setMasterplans] = useState([]);
  const [comments, setComments] = useState([]);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  const claudeApi = useClaudeApi();
  const masterplanGenerator = new MasterplanGenerator();

  // Load masterplan by ID
  const loadMasterplan = async (id: string) => {
    try {
      setLoading(true);
      const plan = await getMasterplanById(id);
      
      if (!plan) {
        throw new Error(`Masterplan not found: ${id}`);
      }
      
      setMasterplan(plan);
      
      const [masterplanComments, masterplanVersions] = await Promise.all([
        getCommentsByMasterplanId(id),
        getMasterplanVersions(id)
      ]);
      
      setComments(masterplanComments);
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to load masterplans';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createMasterplan = async (messages: any[], conversationId: string, title?: string, formats?: string[]) => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      setLoading(true);
      setError(null);
      
      const content = await claudeApi.generateMasterplan(messages);
      
      const newMasterplan = masterplanGenerator.generateFromMarkdown(
        content,
        conversationId,
        title,
        formats
      );
      
      const savedMasterplan = await createMasterplanInDb({
        ...newMasterplan,
        userId: user.id,
        conversationId
      });
      
      setMasterplan(savedMasterplan);
      await loadMasterplans();
      
      return savedMasterplan;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create masterplan';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    if (masterplanId && user) {
      loadMasterplan(masterplanId).catch(err => {
        console.error('Error loading masterplan:', err);
      });
    }
  }, [masterplanId, user]);

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
    loadMasterplan,
    loadMasterplans
  };
}

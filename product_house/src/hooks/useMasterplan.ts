// src/hooks/useMasterplan.ts
'use client';

import { useState, useEffect } from 'react';
import { Masterplan, MasterplanFormat } from '@/types/masterplan';
import { useClaudeApi } from './useClaudeApi';
import { masterplanGenerator } from '@/lib/masterplan/generator';
import { saveMasterplan, getMasterplan, getAllMasterplans, deleteMasterplan } from '@/lib/masterplan/storage';

export function useMasterplan(masterplanId?: string) {
  const [masterplan, setMasterplan] = useState<Masterplan | null>(null);
  const [masterplans, setMasterplans] = useState<Masterplan[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const claudeApi = useClaudeApi();
  
  // Load all masterplans
  const loadMasterplans = async () => {
    try {
      setLoading(true);
      const plans = await getAllMasterplans();
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
  
  // Load masterplan by ID
  const loadMasterplan = async (id: string) => {
    try {
      setLoading(true);
      const plan = await getMasterplan(id);
      
      if (!plan) {
        throw new Error(`Masterplan not found: ${id}`);
      }
      
      setMasterplan(plan);
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
    messages: any[],
    title: string,
    formats: MasterplanFormat[] = ['markdown']
  ) => {
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
      
      // Save masterplan
      await saveMasterplan(newMasterplan);
      
      // Update state
      setMasterplan(newMasterplan);
      
      // Refresh masterplans list
      await loadMasterplans();
      
      return newMasterplan;
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
    updates: Partial<Masterplan>
  ) => {
    try {
      setLoading(true);
      
      // Load current masterplan
      const currentMasterplan = await getMasterplan(id);
      
      if (!currentMasterplan) {
        throw new Error(`Masterplan not found: ${id}`);
      }
      
      // Create updated masterplan
      const updatedMasterplan: Masterplan = {
        ...currentMasterplan,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      // Save updated masterplan
      await saveMasterplan(updatedMasterplan);
      
      // Update state
      setMasterplan(updatedMasterplan);
      
      // Refresh masterplans list
      await loadMasterplans();
      
      return updatedMasterplan;
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
      
      // Delete masterplan
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete masterplan';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Load masterplan if ID is provided
  useEffect(() => {
    if (masterplanId) {
      loadMasterplan(masterplanId).catch(err => {
        console.error('Error loading masterplan:', err);
      });
    }
  }, [masterplanId]);
  
  // Load all masterplans initially
  useEffect(() => {
    loadMasterplans().catch(err => {
      console.error('Error loading masterplans:', err);
    });
  }, []);
  
  return {
    masterplan,
    masterplans,
    loading,
    error,
    createMasterplan,
    updateMasterplan,
    removeMasterplan,
    loadMasterplan,
    loadMasterplans,
  };
}
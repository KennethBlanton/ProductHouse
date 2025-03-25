// src/lib/masterplan/storage.ts
import { Masterplan } from '@/types/masterplan';

// In a real app, this would use a database or API
// For now, we'll use local storage
const STORAGE_KEY = 'masterplans';

/**
 * Save masterplans to local storage
 */
function saveMasterplansToStorage(masterplans: Masterplan[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(masterplans));
  }
}

/**
 * Load masterplans from local storage
 */
function loadMasterplansFromStorage(): Masterplan[] {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
  return [];
}

/**
 * Save a masterplan
 */
export async function saveMasterplan(masterplan: Masterplan): Promise<void> {
  const masterplans = loadMasterplansFromStorage();
  
  // Check if masterplan already exists
  const index = masterplans.findIndex(mp => mp.id === masterplan.id);
  
  if (index >= 0) {
    // Update existing masterplan
    masterplans[index] = {
      ...masterplan,
      updatedAt: new Date().toISOString()
    };
  } else {
    // Add new masterplan
    masterplans.push({
      ...masterplan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  saveMasterplansToStorage(masterplans);
}

/**
 * Get a masterplan by ID
 */
export async function getMasterplan(id: string): Promise<Masterplan | null> {
  const masterplans = loadMasterplansFromStorage();
  const masterplan = masterplans.find(mp => mp.id === id);
  return masterplan || null;
}

/**
 * Get all masterplans
 */
export async function getAllMasterplans(): Promise<Masterplan[]> {
  return loadMasterplansFromStorage();
}

/**
 * Delete a masterplan
 */
export async function deleteMasterplan(id: string): Promise<boolean> {
  const masterplans = loadMasterplansFromStorage();
  const initialLength = masterplans.length;
  const filteredMasterplans = masterplans.filter(mp => mp.id !== id);
  
  if (filteredMasterplans.length < initialLength) {
    saveMasterplansToStorage(filteredMasterplans);
    return true;
  }
  
  return false;
}
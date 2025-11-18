/**
 * Exam Routines Helper - Data structure and storage utilities for Exam Routine Manager
 * 
 * This module provides TypeScript interfaces and CRUD operations for managing
 * exam routines in the Royal Academy application. It follows the existing
 * architecture pattern using localStorage + Supabase key-value storage.
 * 
 * Storage Key: 'royal-academy-exam-routines'
 * Storage Pattern: app_state table in Supabase (key-value pairs)
 */

import { getSupabaseData, setSupabaseData } from './supabaseHelpers';

/**
 * Storage key for exam routines data
 */
export const EXAM_ROUTINES_STORAGE_KEY = 'royal-academy-exam-routines';

/**
 * ExamRoutine Interface
 * 
 * Represents an exam schedule entry or holiday for a specific class.
 * Can represent either a scheduled exam or a holiday within the exam period.
 * 
 * @interface ExamRoutine
 * @property {string} id - Unique identifier for the exam routine entry (e.g., timestamp-based)
 * @property {string} date - Exam date in ISO string format (e.g., "2024-03-15T00:00:00.000Z")
 * @property {string} exam_name - Name of the exam (e.g., "Mathematics Mid-Term", "Science Final")
 * @property {string} class - Class for which exam is scheduled. Use "All" for all classes or specific class like "10", "11", "12"
 * @property {boolean} is_holiday - Flag to indicate if this entry represents a holiday instead of an exam
 * @property {string} notes - Additional notes, instructions, or description about the exam or holiday
 * @property {string} createdAt - ISO timestamp when the routine entry was created
 */
export interface ExamRoutine {
  id: string;
  date: string;
  exam_name: string;
  class: string;
  is_holiday: boolean;
  notes: string;
  createdAt: string;
}

/**
 * Load all exam routines from storage
 * 
 * Retrieves exam routines from Supabase with localStorage fallback.
 * Returns empty array if no data exists.
 * 
 * @returns {Promise<ExamRoutine[]>} Array of exam routines
 */
export async function loadExamRoutines(): Promise<ExamRoutine[]> {
  try {
    const routines = await getSupabaseData<ExamRoutine[]>(EXAM_ROUTINES_STORAGE_KEY, []);
    return routines;
  } catch (error) {
    console.error('[examRoutinesHelper] Error loading exam routines:', error);
    return [];
  }
}

/**
 * Save exam routines to storage
 * 
 * Persists routines to both Supabase and localStorage for redundancy.
 * 
 * @param {ExamRoutine[]} routines - Array of exam routines to save
 * @returns {Promise<boolean>} Success status
 */
export async function saveExamRoutines(routines: ExamRoutine[]): Promise<boolean> {
  try {
    const success = await setSupabaseData(EXAM_ROUTINES_STORAGE_KEY, routines);
    return success;
  } catch (error) {
    console.error('[examRoutinesHelper] Error saving exam routines:', error);
    return false;
  }
}

/**
 * Add a new exam routine
 * 
 * Creates a new exam routine entry with auto-generated ID and timestamp.
 * 
 * @param {Omit<ExamRoutine, 'id' | 'createdAt'>} routineData - Routine data without id and createdAt
 * @returns {Promise<ExamRoutine | null>} The newly created routine or null on failure
 */
export async function addExamRoutine(
  routineData: Omit<ExamRoutine, 'id' | 'createdAt'>
): Promise<ExamRoutine | null> {
  try {
    const routines = await loadExamRoutines();
    
    const newRoutine: ExamRoutine = {
      ...routineData,
      id: `exam-routine-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedRoutines = [...routines, newRoutine];
    const success = await saveExamRoutines(updatedRoutines);
    
    return success ? newRoutine : null;
  } catch (error) {
    console.error('[examRoutinesHelper] Error adding exam routine:', error);
    return null;
  }
}

/**
 * Update an existing exam routine
 * 
 * @param {string} routineId - ID of the routine to update
 * @param {Partial<ExamRoutine>} updates - Partial routine data to update
 * @returns {Promise<boolean>} Success status
 */
export async function updateExamRoutine(
  routineId: string,
  updates: Partial<ExamRoutine>
): Promise<boolean> {
  try {
    const routines = await loadExamRoutines();
    const routineIndex = routines.findIndex(routine => routine.id === routineId);
    
    if (routineIndex === -1) {
      console.warn(`[examRoutinesHelper] Routine with ID ${routineId} not found`);
      return false;
    }
    
    routines[routineIndex] = { ...routines[routineIndex], ...updates };
    const success = await saveExamRoutines(routines);
    
    return success;
  } catch (error) {
    console.error('[examRoutinesHelper] Error updating exam routine:', error);
    return false;
  }
}

/**
 * Delete an exam routine
 * 
 * @param {string} routineId - ID of the routine to delete
 * @returns {Promise<boolean>} Success status
 */
export async function deleteExamRoutine(routineId: string): Promise<boolean> {
  try {
    const routines = await loadExamRoutines();
    const filteredRoutines = routines.filter(routine => routine.id !== routineId);
    
    if (filteredRoutines.length === routines.length) {
      console.warn(`[examRoutinesHelper] Routine with ID ${routineId} not found`);
      return false;
    }
    
    const success = await saveExamRoutines(filteredRoutines);
    return success;
  } catch (error) {
    console.error('[examRoutinesHelper] Error deleting exam routine:', error);
    return false;
  }
}

/**
 * Get routines for a specific class
 * 
 * @param {string} className - Class identifier (e.g., "10", "11", "All")
 * @returns {Promise<ExamRoutine[]>} Routines for the specified class
 */
export async function getRoutinesByClass(className: string): Promise<ExamRoutine[]> {
  try {
    const routines = await loadExamRoutines();
    return routines.filter(routine => 
      routine.class === className || routine.class === "All"
    );
  } catch (error) {
    console.error('[examRoutinesHelper] Error getting routines by class:', error);
    return [];
  }
}



/**
 * Get routines within a date range
 * 
 * @param {string} startDate - Start date in ISO format
 * @param {string} endDate - End date in ISO format
 * @returns {Promise<ExamRoutine[]>} Routines within the date range
 */
export async function getRoutinesByDateRange(
  startDate: string,
  endDate: string
): Promise<ExamRoutine[]> {
  try {
    const routines = await loadExamRoutines();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return routines.filter(routine => {
      const routineDate = new Date(routine.date);
      return routineDate >= start && routineDate <= end;
    });
  } catch (error) {
    console.error('[examRoutinesHelper] Error getting routines by date range:', error);
    return [];
  }
}

/**
 * Get routines for a specific month and year
 * 
 * @param {number} month - Month (1-12)
 * @param {number} year - Year (e.g., 2024)
 * @returns {Promise<ExamRoutine[]>} Routines in the specified month
 */
export async function getRoutinesByMonth(
  month: number,
  year: number
): Promise<ExamRoutine[]> {
  try {
    const routines = await loadExamRoutines();
    
    return routines.filter(routine => {
      const routineDate = new Date(routine.date);
      return routineDate.getMonth() + 1 === month && 
             routineDate.getFullYear() === year;
    });
  } catch (error) {
    console.error('[examRoutinesHelper] Error getting routines by month:', error);
    return [];
  }
}

/**
 * Get routines for a specific date
 * 
 * @param {string} date - Date in ISO format
 * @returns {Promise<ExamRoutine[]>} Routines on the specified date
 */
export async function getRoutinesByDate(date: string): Promise<ExamRoutine[]> {
  try {
    const routines = await loadExamRoutines();
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return routines.filter(routine => {
      const routineDate = new Date(routine.date);
      routineDate.setHours(0, 0, 0, 0);
      return routineDate.getTime() === targetDate.getTime();
    });
  } catch (error) {
    console.error('[examRoutinesHelper] Error getting routines by date:', error);
    return [];
  }
}

/**
 * Get all holidays (entries where is_holiday is true)
 * 
 * @returns {Promise<ExamRoutine[]>} All holiday entries
 */
export async function getHolidays(): Promise<ExamRoutine[]> {
  try {
    const routines = await loadExamRoutines();
    return routines.filter(routine => routine.is_holiday === true);
  } catch (error) {
    console.error('[examRoutinesHelper] Error getting holidays:', error);
    return [];
  }
}

/**
 * Get all exams (entries where is_holiday is false)
 * 
 * @returns {Promise<ExamRoutine[]>} All exam entries
 */
export async function getExams(): Promise<ExamRoutine[]> {
  try {
    const routines = await loadExamRoutines();
    return routines.filter(routine => routine.is_holiday === false);
  } catch (error) {
    console.error('[examRoutinesHelper] Error getting exams:', error);
    return [];
  }
}

/**
 * Get a single routine by ID
 * 
 * @param {string} routineId - ID of the routine to retrieve
 * @returns {Promise<ExamRoutine | null>} The routine or null if not found
 */
export async function getRoutineById(routineId: string): Promise<ExamRoutine | null> {
  try {
    const routines = await loadExamRoutines();
    return routines.find(routine => routine.id === routineId) || null;
  } catch (error) {
    console.error('[examRoutinesHelper] Error getting routine by ID:', error);
    return null;
  }
}

/**
 * Get upcoming exams (exams with dates in the future)
 * 
 * @param {string} [className] - Optional class filter
 * @returns {Promise<ExamRoutine[]>} Upcoming exam entries sorted by date
 */
export async function getUpcomingExams(
  className?: string
): Promise<ExamRoutine[]> {
  try {
    const routines = await loadExamRoutines();
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    let upcomingExams = routines.filter(routine => {
      const routineDate = new Date(routine.date);
      routineDate.setHours(0, 0, 0, 0);
      return !routine.is_holiday && routineDate >= now;
    });
    
    if (className) {
      upcomingExams = upcomingExams.filter(routine => 
        routine.class === className || routine.class === "All"
      );
    }
    
    return upcomingExams.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (error) {
    console.error('[examRoutinesHelper] Error getting upcoming exams:', error);
    return [];
  }
}

/**
 * Search routines by exam name (case-insensitive partial match)
 * 
 * @param {string} searchTerm - Search term to match against exam names
 * @returns {Promise<ExamRoutine[]>} Routines with matching exam names
 */
export async function searchRoutinesByExamName(searchTerm: string): Promise<ExamRoutine[]> {
  try {
    const routines = await loadExamRoutines();
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    return routines.filter(routine => 
      routine.exam_name.toLowerCase().includes(lowerSearchTerm)
    );
  } catch (error) {
    console.error('[examRoutinesHelper] Error searching routines by exam name:', error);
    return [];
  }
}

/**
 * Books Helper - Data structure and storage utilities for Yearly Books Manager
 * 
 * This module provides TypeScript interfaces and CRUD operations for managing
 * yearly books in the Royal Academy application. It follows the existing
 * architecture pattern using localStorage + Supabase key-value storage.
 * 
 * Storage Key: 'royal-academy-yearly-books'
 * Storage Pattern: app_state table in Supabase (key-value pairs)
 */

import { getSupabaseData, setSupabaseData } from './supabaseHelpers';

/**
 * Storage key for yearly books data
 */
export const YEARLY_BOOKS_STORAGE_KEY = 'royal-academy-yearly-books';

/**
 * YearlyBook Interface
 * 
 * Represents a book recommended for a specific class and academic year.
 * 
 * @interface YearlyBook
 * @property {string} id - Unique identifier for the book (e.g., timestamp-based)
 * @property {number} class - Class number (1-12) for which the book is recommended
 * @property {string} year - Academic year (e.g., "2024-2025")
 * @property {string} title - Title of the book
 * @property {string} author - Author name
 * @property {string} description - Brief description of the book and why it's recommended
 * @property {string} buying_link - URL where the book can be purchased
 * @property {string} createdAt - ISO timestamp when the book was added to the system
 */
export interface YearlyBook {
  id: string;
  class: number;
  year: string;
  title: string;
  author: string;
  description: string;
  cover_photo?: string;
  buying_link: string;
  createdAt: string;
}

/**
 * Load all yearly books from storage
 * 
 * Retrieves books from Supabase with localStorage fallback.
 * Returns empty array if no data exists.
 * 
 * @returns {Promise<YearlyBook[]>} Array of yearly books
 */
export async function loadYearlyBooks(): Promise<YearlyBook[]> {
  try {
    const books = await getSupabaseData<YearlyBook[]>(YEARLY_BOOKS_STORAGE_KEY, []);
    return books;
  } catch (error) {
    console.error('[booksHelper] Error loading yearly books:', error);
    return [];
  }
}

/**
 * Save yearly books to storage
 * 
 * Persists books to both Supabase and localStorage for redundancy.
 * 
 * @param {YearlyBook[]} books - Array of books to save
 * @returns {Promise<boolean>} Success status
 */
export async function saveYearlyBooks(books: YearlyBook[]): Promise<boolean> {
  try {
    const success = await setSupabaseData(YEARLY_BOOKS_STORAGE_KEY, books);
    return success;
  } catch (error) {
    console.error('[booksHelper] Error saving yearly books:', error);
    return false;
  }
}

/**
 * Add a new yearly book
 * 
 * Creates a new book entry with auto-generated ID and timestamp.
 * 
 * @param {Omit<YearlyBook, 'id' | 'createdAt'>} bookData - Book data without id and createdAt
 * @returns {Promise<YearlyBook | null>} The newly created book or null on failure
 */
export async function addYearlyBook(
  bookData: Omit<YearlyBook, 'id' | 'createdAt'>
): Promise<YearlyBook | null> {
  try {
    const books = await loadYearlyBooks();
    
    const newBook: YearlyBook = {
      ...bookData,
      id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedBooks = [...books, newBook];
    const success = await saveYearlyBooks(updatedBooks);
    
    return success ? newBook : null;
  } catch (error) {
    console.error('[booksHelper] Error adding yearly book:', error);
    return null;
  }
}

/**
 * Update an existing yearly book
 * 
 * @param {string} bookId - ID of the book to update
 * @param {Partial<YearlyBook>} updates - Partial book data to update
 * @returns {Promise<boolean>} Success status
 */
export async function updateYearlyBook(
  bookId: string,
  updates: Partial<YearlyBook>
): Promise<boolean> {
  try {
    const books = await loadYearlyBooks();
    const bookIndex = books.findIndex(book => book.id === bookId);
    
    if (bookIndex === -1) {
      console.warn(`[booksHelper] Book with ID ${bookId} not found`);
      return false;
    }
    
    books[bookIndex] = { ...books[bookIndex], ...updates };
    const success = await saveYearlyBooks(books);
    
    return success;
  } catch (error) {
    console.error('[booksHelper] Error updating yearly book:', error);
    return false;
  }
}

/**
 * Delete a yearly book
 * 
 * @param {string} bookId - ID of the book to delete
 * @returns {Promise<boolean>} Success status
 */
export async function deleteYearlyBook(bookId: string): Promise<boolean> {
  try {
    const books = await loadYearlyBooks();
    const filteredBooks = books.filter(book => book.id !== bookId);
    
    if (filteredBooks.length === books.length) {
      console.warn(`[booksHelper] Book with ID ${bookId} not found`);
      return false;
    }
    
    const success = await saveYearlyBooks(filteredBooks);
    return success;
  } catch (error) {
    console.error('[booksHelper] Error deleting yearly book:', error);
    return false;
  }
}

/**
 * Get books for a specific class
 * 
 * @param {number} classNumber - Class number (1-12)
 * @returns {Promise<YearlyBook[]>} Books for the specified class
 */
export async function getBooksByClass(classNumber: number): Promise<YearlyBook[]> {
  try {
    const books = await loadYearlyBooks();
    return books.filter(book => book.class === classNumber);
  } catch (error) {
    console.error('[booksHelper] Error getting books by class:', error);
    return [];
  }
}

/**
 * Get books for a specific academic year
 * 
 * @param {string} year - Academic year (e.g., "2024-2025")
 * @returns {Promise<YearlyBook[]>} Books for the specified year
 */
export async function getBooksByYear(year: string): Promise<YearlyBook[]> {
  try {
    const books = await loadYearlyBooks();
    return books.filter(book => book.year === year);
  } catch (error) {
    console.error('[booksHelper] Error getting books by year:', error);
    return [];
  }
}

/**
 * Get books for a specific class and year
 * 
 * @param {number} classNumber - Class number (1-12)
 * @param {string} year - Academic year (e.g., "2024-2025")
 * @returns {Promise<YearlyBook[]>} Books matching both class and year
 */
export async function getBooksByClassAndYear(
  classNumber: number,
  year: string
): Promise<YearlyBook[]> {
  try {
    const books = await loadYearlyBooks();
    return books.filter(
      book => book.class === classNumber && book.year === year
    );
  } catch (error) {
    console.error('[booksHelper] Error getting books by class and year:', error);
    return [];
  }
}

/**
 * Get a single book by ID
 * 
 * @param {string} bookId - ID of the book to retrieve
 * @returns {Promise<YearlyBook | null>} The book or null if not found
 */
export async function getBookById(bookId: string): Promise<YearlyBook | null> {
  try {
    const books = await loadYearlyBooks();
    return books.find(book => book.id === bookId) || null;
  } catch (error) {
    console.error('[booksHelper] Error getting book by ID:', error);
    return null;
  }
}

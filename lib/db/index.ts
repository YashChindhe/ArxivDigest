/**
 * Database utilities for Neon PostgreSQL
 * This file will contain functions to interact with the Neon database
 * 
 * To use this with Neon:
 * 1. Install: npm install @vercel/postgres
 * 2. Set DATABASE_URL in .env.local
 * 3. Uncomment the sql import below
 */

// import { sql } from '@vercel/postgres';

/**
 * For now, using a placeholder implementation with in-memory storage
 * Replace with actual @vercel/postgres once configured
 */

export interface Paper {
  id: string;
  title: string;
  arxivUrl: string;
  summary: {
    coreContribution: string;
    methodology: string;
    keyResults: string;
  };
  timestamp: string;
  userId?: string;
}

// In-memory storage for demo purposes
// In production, this would be a real database
const paperHistory: Record<string, Paper> = {};

/**
 * Initialize database tables (run once during setup)
 * Placeholder - implement with actual database client
 */
export async function initializeDatabase() {
  console.log('Database initialization placeholder');
  console.log('Update lib/db/index.ts after configuring @vercel/postgres');
}

/**
 * Save a paper to the database (and history)
 */
export async function savePaper(paper: Paper) {
  paperHistory[paper.id] = paper;
  console.log('Paper saved to history:', paper.id);
  return paper;
}

/**
 * Get all papers from history
 */
export async function getAllPaperHistory(): Promise<Paper[]> {
  return Object.values(paperHistory).sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Get saved papers for a user
 * Placeholder - implement with actual database client
 */
export async function getUserPapers(userId: string) {
  console.log('Getting papers for user:', userId);
  return Object.values(paperHistory).filter((p) => p.userId === userId);
}

/**
 * Delete a paper from history
 */
export async function deletePaper(paperId: string): Promise<boolean> {
  if (paperHistory[paperId]) {
    delete paperHistory[paperId];
    return true;
  }
  return false;
}

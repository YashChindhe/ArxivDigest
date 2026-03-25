import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('DATABASE_URL is not set. Database features will be disabled.');
}

const sql = databaseUrl ? (neon(databaseUrl) as any) : async (...args: any[]) => {
  console.warn('Database call ignored: DATABASE_URL not set');
  return [] as any;
};

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

/**
 * Initialize database tables
 */
export async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS papers (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        arxiv_url TEXT NOT NULL,
        core_contribution TEXT,
        methodology TEXT,
        key_results TEXT,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        user_id TEXT
      );
    `;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

/**
 * Save a paper to the database
 */
export async function savePaper(paper: Paper) {
  try {
    await sql`
      INSERT INTO papers (id, title, arxiv_url, core_contribution, methodology, key_results, timestamp, user_id)
      VALUES (
        ${paper.id}, 
        ${paper.title}, 
        ${paper.arxivUrl}, 
        ${paper.summary.coreContribution}, 
        ${paper.summary.methodology}, 
        ${paper.summary.keyResults}, 
        ${paper.timestamp}, 
        ${paper.userId || null}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        core_contribution = EXCLUDED.core_contribution,
        methodology = EXCLUDED.methodology,
        key_results = EXCLUDED.key_results;
    `;
    return paper;
  } catch (error) {
    console.error('Error saving paper:', error);
    // Fallback to in-memory if DB fails for some reason (not recommended for production)
    return paper;
  }
}

/**
 * Get all papers from history
 */
export async function getAllPaperHistory(): Promise<Paper[]> {
  try {
    const result = await sql`
      SELECT * FROM papers ORDER BY timestamp DESC LIMIT 50;
    `;
    
    return result.map((row: any) => ({
      id: row.id,
      title: row.title,
      arxivUrl: row.arxiv_url,
      summary: {
        coreContribution: row.core_contribution,
        methodology: row.methodology,
        keyResults: row.key_results,
      },
      timestamp: row.timestamp.toISOString(),
      userId: row.user_id
    }));
  } catch (error) {
    console.error('Error fetching papers:', error);
    return [];
  }
}

/**
 * Get saved papers for a user
 */
export async function getUserPapers(userId: string): Promise<Paper[]> {
  try {
    const result = await sql`
      SELECT * FROM papers WHERE user_id = ${userId} ORDER BY timestamp DESC;
    `;
    
    return result.map((row: any) => ({
      id: row.id,
      title: row.title,
      arxivUrl: row.arxiv_url,
      summary: {
        coreContribution: row.core_contribution,
        methodology: row.methodology,
        keyResults: row.key_results,
      },
      timestamp: row.timestamp.toISOString(),
      userId: row.user_id
    }));
  } catch (error) {
    console.error('Error fetching user papers:', error);
    return [];
  }
}

/**
 * Delete a paper from history
 */
export async function deletePaper(paperId: string): Promise<boolean> {
  try {
    await sql`DELETE FROM papers WHERE id = ${paperId}`;
    return true;
  } catch (error) {
    console.error('Error deleting paper:', error);
    return false;
  }
}

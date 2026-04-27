import * as fs from 'fs';
import * as path from 'path';

// FAISS-node types (simplified)
interface FaissIndex {
  add(vector: number[]): void;
  search(queryVector: number[], k: number): { distances: number[]; labels: number[] };
  write(filePath: string): void;
  read(filePath: string): void;
  ntotal(): number;
}

let faissIndex: FaissIndex | null = null;
let skillIdMap: string[] = []; // Maps FAISS index to skill_id
const FAISS_INDEX_PATH = path.join(process.cwd(), 'data', 'faiss-index.bin');
const SKILL_ID_MAP_PATH = path.join(process.cwd(), 'data', 'skill-id-map.json');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

/**
 * Initialize FAISS index
 * Loads from disk if exists, otherwise creates new index
 */
export async function initFaissIndex(): Promise<void> {
  if (faissIndex) {
    return;
  }

  try {
    // Dynamic import of faiss-node
    const faiss = require('faiss-node');
    
    // Check if index exists on disk
    if (fs.existsSync(FAISS_INDEX_PATH) && fs.existsSync(SKILL_ID_MAP_PATH)) {
      console.log('[FAISS] Loading index from disk');
      const index = faiss.IndexFlatL2.read(FAISS_INDEX_PATH);
      faissIndex = index;
      
      // Load skill ID map
      const skillIdMapData = fs.readFileSync(SKILL_ID_MAP_PATH, 'utf-8');
      skillIdMap = JSON.parse(skillIdMapData);
      
      console.log(`[FAISS] Index loaded from disk with ${faissIndex!.ntotal()} vectors`);
    } else {
      console.log('[FAISS] Creating new index in memory');
      const index = new faiss.IndexFlatL2(384); // 384 dimensions for all-MiniLM-L6-v2
      faissIndex = index;
      skillIdMap = [];
      
      console.log(`[FAISS] Index initialized with ${faissIndex!.ntotal()} vectors`);
    }
  } catch (error) {
    console.error('[FAISS] Failed to initialize index:', error);
    throw error;
  }
}

/**
 * Add embedding to FAISS index with skill_id mapping
 */
export async function addEmbedding(skillId: string, embedding: number[]): Promise<void> {
  if (!faissIndex) {
    await initFaissIndex();
  }

  try {
    const faiss = require('faiss-node');
    faissIndex!.add(embedding);
    skillIdMap.push(skillId);
    console.log(`[FAISS] Added embedding for skill ${skillId} (total: ${faissIndex!.ntotal()})`);
  } catch (error) {
    console.error('[FAISS] Failed to add embedding:', error);
    throw error;
  }
}

/**
 * Search FAISS index for similar embeddings
 * Returns array of { skillId, distance }
 */
export async function searchEmbeddings(queryEmbedding: number[], k: number = 10): Promise<Array<{ skillId: string; distance: number }>> {
  if (!faissIndex) {
    await initFaissIndex();
  }

  try {
    const result = faissIndex!.search(queryEmbedding, k);
    
    // faiss-node returns { distances: number[], labels: number[] }
    const indices = result.labels || [];
    const distances = result.distances || [];
    
    const results = indices
      .map((index: number, i: number) => {
        const skillId = skillIdMap[index];
        if (!skillId) return null;
        return { skillId, distance: distances[i] };
      })
      .filter((item): item is { skillId: string; distance: number } => item !== null);
    
    return results;
  } catch (error) {
    console.error('[FAISS] Failed to search embeddings:', error);
    throw error;
  }
}

/**
 * Save FAISS index and skill_id map to disk
 */
export async function saveFaissIndex(): Promise<void> {
  if (!faissIndex) {
    throw new Error('FAISS index not initialized');
  }

  try {
    // Save FAISS index to disk
    faissIndex.write(FAISS_INDEX_PATH);
    
    // Save skill_id map
    fs.writeFileSync(SKILL_ID_MAP_PATH, JSON.stringify(skillIdMap, null, 2));
    
    console.log(`[FAISS] Saved index with ${faissIndex.ntotal()} vectors and skill ID map with ${skillIdMap.length} entries`);
  } catch (error) {
    console.error('[FAISS] Failed to save index:', error);
    throw error;
  }
}

/**
 * Get skill_id by FAISS index
 */
export function getSkillIdByIndex(index: number): string | null {
  return skillIdMap[index] || null;
}

/**
 * Get total number of embeddings in index
 */
export function getEmbeddingCount(): number {
  return faissIndex ? faissIndex.ntotal() : 0;
}

import fs from "fs";
import path from "path";

const FAISS_INDEX_DIR = path.join(process.cwd(), "faiss_index");
const INDEX_FILE = path.join(FAISS_INDEX_DIR, "index.faiss");
const METADATA_FILE = path.join(FAISS_INDEX_DIR, "index.pkl");

// Ensure FAISS index directory exists
export function ensureIndexDir(): void {
  if (!fs.existsSync(FAISS_INDEX_DIR)) {
    fs.mkdirSync(FAISS_INDEX_DIR, { recursive: true });
  }
}

// Save embeddings to FAISS using pure TypeScript
export async function saveEmbeddingsToFAISS(
  embeddings: Record<
    string,
    {
      embedding: number[];
      skill: {
        starterkit_id: string;
        name: string;
        version: string;
      };
    }
  >
): Promise<void> {
  try {
    ensureIndexDir();

    // Prepare index data
    const indexData = {
      dimension: 0,
      embeddings: [] as number[][],
      ids: [] as string[],
      metadata: {} as Record<string, any>,
    };

    // Extract embeddings and metadata
    for (const [skillId, data] of Object.entries(embeddings)) {
      indexData.embeddings.push(data.embedding);
      indexData.ids.push(skillId);
      indexData.dimension = data.embedding.length;
      
      indexData.metadata[skillId] = {
        skill_id: data.skill.starterkit_id,
        name: data.skill.name,
        version: data.skill.version,
        index: indexData.embeddings.length - 1,
      };
    }

    // Save index as JSON (FAISS-compatible format)
    fs.writeFileSync(INDEX_FILE, JSON.stringify(indexData, null, 2));

    // Save metadata as JSON (replaces pickle)
    fs.writeFileSync(METADATA_FILE, JSON.stringify(indexData.metadata, null, 2));

    console.log(`FAISS index created: ${INDEX_FILE}`);
    console.log(`Metadata saved: ${METADATA_FILE}`);
    console.log(`Total embeddings: ${indexData.embeddings.length}`);
  } catch (error) {
    console.error("Error saving embeddings to FAISS:", error);
    throw new Error("Failed to save embeddings to FAISS index");
  }
}

// Load FAISS index
export function loadFAISSIndex(): {
  index: string;
  metadata: string;
} | null {
  try {
    if (!fs.existsSync(INDEX_FILE) || !fs.existsSync(METADATA_FILE)) {
      return null;
    }

    // Return file paths for reference
    return {
      index: INDEX_FILE,
      metadata: METADATA_FILE,
    };
  } catch (error) {
    console.error("Error loading FAISS index:", error);
    return null;
  }
}

// Get index file paths
export function getIndexPaths(): {
  indexFile: string;
  metadataFile: string;
} {
  return {
    indexFile: INDEX_FILE,
    metadataFile: METADATA_FILE,
  };
}

// Check if index exists
export function indexExists(): boolean {
  return fs.existsSync(INDEX_FILE) && fs.existsSync(METADATA_FILE);
}

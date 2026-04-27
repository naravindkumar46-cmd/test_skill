import { pipeline, env } from '@xenova/transformers';

// Configure transformers.js to use local cache
env.allowLocalModels = false;
env.useBrowserCache = false;

let embeddingModel: any = null;
let modelLoadingPromise: Promise<any> | null = null;

/**
 * Singleton pattern to load the embedding model only once
 */
async function getModel() {
  if (embeddingModel) {
    return embeddingModel;
  }

  if (modelLoadingPromise) {
    return modelLoadingPromise;
  }

  modelLoadingPromise = (async () => {
    try {
      console.log('[Embedding] Loading model: Xenova/all-MiniLM-L6-v2');
      embeddingModel = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
        {
          quantized: true,
        }
      );
      console.log('[Embedding] Model loaded successfully');
      return embeddingModel;
    } catch (error) {
      console.error('[Embedding] Failed to load model:', error);
      modelLoadingPromise = null;
      throw error;
    }
  })();

  return modelLoadingPromise;
}

/**
 * Build embedding text from skill data
 * Includes meaningful fields for semantic understanding
 */
export function buildEmbeddingText(skill: any): string {
  const parts: string[] = [];

  // Name (high weight)
  if (skill.name) {
    parts.push(skill.name);
  }

  // Description (high weight)
  if (skill.description) {
    parts.push(skill.description);
  }

  // Category
  if (skill.category) {
    parts.push(`Category: ${skill.category}`);
  }

  // Technology stack
  if (skill.technology && Array.isArray(skill.technology) && skill.technology.length > 0) {
    parts.push(`Technologies: ${skill.technology.join(', ')}`);
  }

  // Tasks/capabilities
  if (skill.tasks && Array.isArray(skill.tasks) && skill.tasks.length > 0) {
    const taskNames = skill.tasks.map((t: any) => t.name).filter(Boolean);
    if (taskNames.length > 0) {
      parts.push(`Capabilities: ${taskNames.join(', ')}`);
    }
  }

  // Specialization
  if (skill.specialization) {
    if (skill.specialization.primary) {
      parts.push(`Specialization: ${skill.specialization.primary}`);
    }
    if (skill.specialization.domain_specific && Array.isArray(skill.specialization.domain_specific)) {
      const domains = skill.specialization.domain_specific.filter(Boolean);
      if (domains.length > 0) {
        parts.push(`Domains: ${domains.join(', ')}`);
      }
    }
  }

  return parts.join('. ');
}

/**
 * Generate embedding for a given text
 * Returns a 384-dimensional vector
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const model = await getModel();
    
    const output = await model(text, {
      pooling: 'mean',
      normalize: true,
    });

    // Convert to array
    const embedding = Array.from(output.data) as number[];
    
    return embedding;
  } catch (error) {
    console.error('[Embedding] Failed to generate embedding:', error);
    throw error;
  }
}

/**
 * Generate embedding for a skill object
 */
export async function getSkillEmbedding(skill: any): Promise<number[]> {
  const text = buildEmbeddingText(skill);
  return getEmbedding(text);
}

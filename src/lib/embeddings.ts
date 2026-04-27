import { pipeline } from "@xenova/transformers";
import { StoredSkillCard } from "./skillSchema";

let embeddingPipeline: any = null;

// Initialize embedding pipeline
async function initEmbeddingPipeline() {
  if (!embeddingPipeline) {
    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
      { quantized: true }
    );
  }
  return embeddingPipeline;
}

// Generate embeddings for skill cards using Xenova/all-MiniLM-L6-v2
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const extractor = await initEmbeddingPipeline();
    
    // Generate embeddings
    const result = await extractor(text, {
      pooling: "mean",
      normalize: true,
    });

    // Convert to array
    return Array.from(result.data);
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}

// Generate embeddings for multiple skills
export async function generateSkillEmbeddings(
  skills: StoredSkillCard[]
): Promise<Record<string, { embedding: number[]; skill: StoredSkillCard }>> {
  const embeddings: Record<
    string,
    { embedding: number[]; skill: StoredSkillCard }
  > = {};

  for (const skill of skills) {
    try {
      // Create text representation of skill for embedding
      const skillText = `
        Name: ${skill.name}
        Description: ${skill.description}
        Technology: ${skill.technology?.join(", ") || ""}
        Primary Specialization: ${skill.specialization.primary}
        Domain: ${skill.specialization.domain_specific?.join(", ") || ""}
        Tasks: ${skill.tasks?.map((t) => t.name).join(", ") || ""}
      `.trim();

      console.log(`Generating embedding for skill: ${skill.starterkit_id}`);
      const embedding = await generateEmbedding(skillText);

      embeddings[skill.starterkit_id] = {
        embedding,
        skill,
      };
    } catch (error) {
      console.error(
        `Failed to generate embedding for skill ${skill.starterkit_id}:`,
        error
      );
    }
  }

  return embeddings;
}

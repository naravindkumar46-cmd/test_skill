import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import redis from "@/lib/redis";
import { SkillCardSchema, StoredSkillCard } from "@/lib/skillSchema";
import { createCategorizer } from "@/lib/categorization";
import { z } from "zod";

const UpdateSchema = z.object({
  skill_card: SkillCardSchema,
  file_url: z.string().min(1, "File URL is required"),
  user_comment: z.string().optional(),
});

/**
 * GET /api/skills/my-skills/[id]
 * Returns latest version of a skill if owned by authenticated user.
 */
export const GET = withAuth(async (_req, { user, params }) => {
  const { id } = await params;

  const latestVersion = await redis.get(`skill:${id}:latest`);
  if (!latestVersion) {
    return NextResponse.json({ error: `Skill ${id} not found` }, { status: 404 });
  }

  const data = await redis.get(`skill:${id}:${latestVersion}`);
  if (!data) {
    return NextResponse.json(
      { error: `Skill ${id} version ${latestVersion} not found` },
      { status: 404 }
    );
  }

  const skill = JSON.parse(data) as StoredSkillCard;
  if (skill.uploaded_by !== user.user_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(skill);
});

/**
 * PUT /api/skills/my-skills/[id]
 * Updates latest user-owned skill and resets moderation to pending.
 */
export const PUT = withAuth(async (req: NextRequest, { user, params }) => {
  const { id } = await params;

  const latestVersion = await redis.get(`skill:${id}:latest`);
  if (!latestVersion) {
    return NextResponse.json({ error: `Skill ${id} not found` }, { status: 404 });
  }

  const redisKey = `skill:${id}:${latestVersion}`;
  const existingData = await redis.get(redisKey);
  if (!existingData) {
    return NextResponse.json(
      { error: `Skill ${id} version ${latestVersion} not found` },
      { status: 404 }
    );
  }

  const existing = JSON.parse(existingData) as StoredSkillCard;
  if (existing.uploaded_by !== user.user_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = UpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  const { skill_card, file_url, user_comment } = parsed.data;

  if (existing.is_rejected && !user_comment?.trim()) {
    return NextResponse.json(
      { error: "Please explain what you changed based on admin rejection before resubmitting." },
      { status: 400 }
    );
  }

  // Keep path/version authoritative for safe in-place update.
  const normalizedSkill = {
    ...skill_card,
    starterkit_id: id,
    version: existing.version,
  };

  const updated: StoredSkillCard = {
    ...normalizedSkill,
    uploaded_by: user.user_id,
    uploaded_at: new Date().toISOString(),
    file_url,
    is_approved: false,
    is_rejected: false,
    approved_by: null,
    rejected_by: null,
    approved_at: null,
    rejected_at: null,
    rejection_note: null,
    category: existing.category,
    subcategory: existing.subcategory,
    moderation_history: existing.moderation_history || [],
  };

  try {
    const categorizer = createCategorizer();
    const categorization = await categorizer.categorizeSkill(
      normalizedSkill.name,
      normalizedSkill.description,
      normalizedSkill.technology || [],
      normalizedSkill.tasks || []
    );
    updated.category = categorization.category;
    updated.subcategory = categorization.subcategory;
  } catch {
    // Keep previous category if auto-categorization fails.
  }

  updated.moderation_history.push({
    actor_role: "USER",
    actor_id: user.user_id,
    action: "RESUBMITTED",
    comment: user_comment?.trim() || "Skill updated and resubmitted for review",
    at: new Date().toISOString(),
  });

  await redis.set(redisKey, JSON.stringify(updated));

  return NextResponse.json({
    success: true,
    message: "Skill updated and resubmitted for approval",
    skill: updated,
  });
});

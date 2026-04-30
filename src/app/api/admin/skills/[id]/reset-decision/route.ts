import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/withAuth";
import redis from "@/lib/redis";
import { StoredSkillCard } from "@/lib/skillSchema";

/**
 * POST /api/admin/skills/[id]/reset-decision
 * Allows admin to undo prior approval/rejection.
 */
export const POST = withAdmin(async (_req, { params }) => {
  const { id } = await params;

  const latestVersion = await redis.get(`skill:${id}:latest`);
  if (!latestVersion) {
    return NextResponse.json({ error: `Skill ${id} not found` }, { status: 404 });
  }

  const redisKey = `skill:${id}:${latestVersion}`;
  const data = await redis.get(redisKey);
  if (!data) {
    return NextResponse.json(
      { error: `Skill ${id} version ${latestVersion} not found` },
      { status: 404 }
    );
  }

  const skill = JSON.parse(data) as StoredSkillCard;

  const updated: StoredSkillCard = {
    ...skill,
    is_approved: false,
    is_rejected: false,
    approved_by: null,
    approved_at: null,
    rejected_by: null,
    rejected_at: null,
    rejection_note: null,
  };

  await redis.set(redisKey, JSON.stringify(updated));

  return NextResponse.json({
    success: true,
    message: "Decision reset successfully",
    skill: updated,
  });
});

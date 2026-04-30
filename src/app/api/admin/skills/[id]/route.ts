import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from "@/lib/withAuth";
import redis from "@/lib/redis";
import { StoredSkillCard } from "@/lib/skillSchema";

/**
 * GET /api/admin/skills/[id]
 * Returns latest version of a skill for admin review regardless of status.
 */
export const GET = withAdmin(async (_req: NextRequest, { params }) => {
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
  return NextResponse.json(skill);
});

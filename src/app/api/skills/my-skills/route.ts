import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import redis from "@/lib/redis";
import { StoredSkillCard } from "@/lib/skillSchema";

/**
 * GET /api/skills/my-skills
 * Returns all skills uploaded by the authenticated user
 */
export const GET = withAuth(async (req: NextRequest, { user }) => {
  const { searchParams } = req.nextUrl;

  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");

  // 1. Get all skillIds from your existing index
  const skillIds = await redis.smembers("skills:index");

  if (skillIds.length === 0) {
    return NextResponse.json({ skills: [], total: 0, page, limit });
  }

  const userSkills: StoredSkillCard[] = [];

  // 2. Fetch all versions and filter by uploaded_by user
  await Promise.all(
    skillIds.map(async (skillId) => {
      const latestVersion = await redis.get(`skill:${skillId}:latest`);
      if (!latestVersion) return;

      const data = await redis.get(`skill:${skillId}:${latestVersion}`);
      if (!data) return;

      const skill = JSON.parse(data) as StoredSkillCard;

      // Only return skills uploaded by this user
      if (skill.uploaded_by !== user.user_id) return;

      userSkills.push(skill);
    })
  );

  // 3. Sort by upload date (newest first)
  userSkills.sort(
    (a, b) =>
      new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
  );

  // 4. Pagination logic
  const total = userSkills.length;
  const start = (page - 1) * limit;
  const paginated = userSkills.slice(start, start + limit);

  return NextResponse.json({
    skills: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

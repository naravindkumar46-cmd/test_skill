import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import redis from "@/lib/redis";
import { StoredSkillCard } from "@/lib/skillSchema";

/**
 * GET /api/admin/skills/all
 * Adheres to existing Redis-based indexing.
 * Returns ALL skills (Approved, Pending, or Rejected) for Admin Console.
 */
export const GET = withAuth(async (req: NextRequest) => {
  const { searchParams } = req.nextUrl;

  // Optional filters for the admin view
  const status = searchParams.get("status"); // e.g., "pending"
  const technology = searchParams.get("technology");

  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");

  // 1. Get all skillIds from your existing index
  const skillIds = await redis.smembers("skills:index");

  if (skillIds.length === 0) {
    return NextResponse.json({ skills: [], total: 0, page, limit });
  }

  const allSkills: StoredSkillCard[] = [];

  // 2. Fetch all versions and parse data
  await Promise.all(
    skillIds.map(async (skillId) => {
      const latestVersion = await redis.get(`skill:${skillId}:latest`);
      if (!latestVersion) return;

      const data = await redis.get(`skill:${skillId}:${latestVersion}`);
      if (!data) return;

      const skill = JSON.parse(data) as StoredSkillCard;

      // ❌ REMOVED: if (!skill.is_approved) return; 
      // We want everything here.

      // ✅ Apply Optional Filters (status/technology) if provided
      if (status) {
        // Explicitly map mutually exclusive states for correct admin filtering
        const currentStatus = skill.is_rejected
          ? "rejected"
          : skill.is_approved
          ? "approved"
          : "pending";
        if (currentStatus !== status) return;
      }

      if (technology && !skill.technology?.includes(technology)) return;

      allSkills.push(skill);
    })
  );

  // 3. Sort by upload date (newest first)
  allSkills.sort(
    (a, b) =>
      new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
  );

  // 4. Pagination logic
  const total = allSkills.length;
  const start = (page - 1) * limit;
  const paginated = allSkills.slice(start, start + limit);

  return NextResponse.json({
    skills: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

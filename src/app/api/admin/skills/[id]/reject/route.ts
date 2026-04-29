import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from "@/lib/withAuth";
import redis from "@/lib/redis";
import { StoredSkillCard } from "@/lib/skillSchema";
import { z } from "zod";

const RejectSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required"),
});

/**
 * POST /api/admin/skills/[id]/reject
 * Admin rejects a pending skill
 */
export const POST = withAdmin(async (req: NextRequest, { user, params }) => {
  try {
    const { id } = await params;
    const body = RejectSchema.safeParse(await req.json());

    if (!body.success) {
      return NextResponse.json(
        { error: "Rejection reason is required" },
        { status: 400 }
      );
    }

    const { reason } = body.data;

    // Get the latest version of the skill
    const latestVersion = await redis.get(`skill:${id}:latest`);
    if (!latestVersion) {
      return NextResponse.json(
        { error: `Skill ${id} not found` },
        { status: 404 }
      );
    }

    // Fetch the skill
    const skillData = await redis.get(`skill:${id}:${latestVersion}`);
    if (!skillData) {
      return NextResponse.json(
        { error: `Skill ${id} version ${latestVersion} not found` },
        { status: 404 }
      );
    }

    const skill: StoredSkillCard = JSON.parse(skillData);

    // Check if already rejected
    if (skill.is_rejected) {
      return NextResponse.json(
        { error: "Skill is already rejected" },
        { status: 409 }
      );
    }

    // Update skill with rejection
    skill.is_rejected = true;
    skill.rejected_by = user.user_id;
    skill.rejected_at = new Date().toISOString();
    skill.rejection_note = reason;

    // Save back to Redis
    await redis.set(`skill:${id}:${latestVersion}`, JSON.stringify(skill));

    return NextResponse.json({
      success: true,
      message: `Skill ${id} rejected successfully`,
      skill,
    });
  } catch (error: any) {
    console.error("Rejection error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reject skill" },
      { status: 500 }
    );
  }
});

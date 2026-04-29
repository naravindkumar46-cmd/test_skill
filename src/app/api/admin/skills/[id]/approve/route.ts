import { NextRequest, NextResponse } from "next/server";
import { withAdmin } from "@/lib/withAuth";
import redis from "@/lib/redis";
import { StoredSkillCard } from "@/lib/skillSchema";
import { z } from "zod";

const ApproveSchema = z.object({
  notes: z.string().optional(),
});

const RejectSchema = z.object({
  reason: z.string().min(1, "Rejection reason is required"),
});

/**
 * POST /api/admin/skills/[id]/approve
 * Admin approves a pending skill
 */
export const POST = withAdmin(async (req: NextRequest, { user, params }) => {
  try {
    const { id } = await params;
    const body = ApproveSchema.safeParse(await req.json());

    if (!body.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

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

    // Check if already approved
    if (skill.is_approved) {
      return NextResponse.json(
        { error: "Skill is already approved" },
        { status: 409 }
      );
    }

    // Update skill with approval
    skill.is_approved = true;
    skill.approved_by = user.user_id;
    skill.approved_at = new Date().toISOString();

    // Save back to Redis
    await redis.set(`skill:${id}:${latestVersion}`, JSON.stringify(skill));

    return NextResponse.json({
      success: true,
      message: `Skill ${id} approved successfully`,
      skill,
    });
  } catch (error: any) {
    console.error("Approval error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to approve skill" },
      { status: 500 }
    );
  }
});

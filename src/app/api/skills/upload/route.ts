import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import redis from "@/lib/redis";
import { SkillCardSchema, StoredSkillCard } from "@/lib/skillSchema";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const POST = withAuth(async (req: NextRequest, { user }) => {
  // 1. parse multipart form
  const formData = await req.formData();
  const jsonFile = formData.get("skill_card") as File;
  const mdFile   = formData.get("skill_md")   as File;

  if (!jsonFile || !mdFile) {
    return NextResponse.json(
      { error: "Both skill_card (JSON) and skill_md (MD) files are required" },
      { status: 400 }
    );
  }

  // 2. validate file types
  if (!jsonFile.name.endsWith(".json")) {
    return NextResponse.json(
      { error: "skill_card must be a .json file" },
      { status: 400 }
    );
  }

  if (!mdFile.name.endsWith(".md")) {
    return NextResponse.json(
      { error: "skill_md must be a .md file" },
      { status: 400 }
    );
  }

  // 3. parse and validate JSON against schema
  let json: unknown;
  try {
    const text = await jsonFile.text();
    json = JSON.parse(text);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON file" },
      { status: 400 }
    );
  }

  const parsed = SkillCardSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  const skill    = parsed.data;
  const redisKey = `skill:${skill.starterkit_id}:${skill.version}`;

  // 4. reject if same starterkit_id + version already exists
  const exists = await redis.exists(redisKey);
  if (exists) {
    return NextResponse.json(
      { error: `Skill ${skill.starterkit_id} version ${skill.version} already exists` },
      { status: 409 }
    );
  }

  // 5. save MD file to filesystem
  const uploadDir = path.join(
    process.cwd(),
    process.env.SKILLS_UPLOAD_PATH!,
    skill.starterkit_id,
    skill.version
  );

  await mkdir(uploadDir, { recursive: true });
  const mdBuffer = Buffer.from(await mdFile.arrayBuffer());
  await writeFile(path.join(uploadDir, "skill.md"), mdBuffer);

  // 6. build stored skill card with server-side fields
  const storedSkill: StoredSkillCard = {
    ...skill,
    uploaded_by:    user.user_id,
    uploaded_at:    new Date().toISOString(),
    md_path:        `${skill.starterkit_id}/${skill.version}/skill.md`,
    is_approved:    false,
    is_rejected:    false,
    approved_by:    null,
    rejected_by:    null,
    approved_at:    null,
    rejected_at:    null,
    rejection_note: null,
  };

  // 7. store in Redis
  await redis.set(redisKey, JSON.stringify(storedSkill));

  // 8. update latest pointer
  await redis.set(`skill:${skill.starterkit_id}:latest`, skill.version);

  // 9. add to skill index for listing
  await redis.sadd("skills:index", skill.starterkit_id);

  return NextResponse.json({
    success: true,
    message: "Skill uploaded successfully — pending approval",
    skill: {
      id:          skill.starterkit_id,
      version:     skill.version,
      name:        skill.name,
      is_approved: false,
      is_rejected: false,
      uploaded_by: user.user_id,
      uploaded_at: storedSkill.uploaded_at,
    },
  });
});
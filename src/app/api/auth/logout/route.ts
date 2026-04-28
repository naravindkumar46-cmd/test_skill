import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";

export const POST = withAuth(async () => {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  response.cookies.delete(process.env.COOKIE_NAME!);
  response.cookies.delete(process.env.COOKIE_REFRESH_NAME!);

  return response;
});
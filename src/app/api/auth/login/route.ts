import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";
import { z } from "zod";

const LoginSchema = z.object({
  user_id: z.string().min(1),
  password: z.string().min(1),
});

/**
 * SHARED CORS HEADERS
 * Updated to include Max-Age and allow-credentials for cross-port support.
 */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Max-Age": "86400",
};

/**
 * 1. THE PREFLIGHT HANDLER (OPTIONS)
 * Handles the browser's security handshake.
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * 2. THE LOGIN HANDLER (POST)
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Validate the incoming request body
    const body = await req.json();
    const parsed = LoginSchema.parse(body);

    // 2. Call Central Auth server to verify credentials
    let authData;
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/auth/login`,
        parsed
      );
      authData = data;
    } catch (err: any) {
      return NextResponse.json(
        {
          success: false,
          error: err.response?.data ?? err.message,
        },
        {
          status: 401,
          headers: CORS_HEADERS,
        }
      );
    }

    // 3. Fetch user details from /me using the new token
    let email = authData.user_id;
    try {
      const { data: meData } = await axios.get(
        `${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/auth/me`,
        { headers: { Authorization: `Bearer ${authData.access_token}` } }
      );
      email = meData.email;
    } catch {
      // Fallback to user_id if /me fails
    }

    // 4. Sync User profile into local Postgres DB
    let synced = false;
    let dbUser = null;

    try {
      dbUser = await prisma.user.upsert({
        where: { id: authData.user_id },
        update: {
          email,
          role: authData.role?.toUpperCase() === "ADMIN" ? "ADMIN" : "USER",
        },
        create: {
          id: authData.user_id,
          email,
          role: authData.role?.toUpperCase() === "ADMIN" ? "ADMIN" : "USER",
        },
      });

      synced = !!(dbUser.businessGroup && dbUser.IOU && dbUser.account);
    } catch (err) {
      console.error("DB sync error:", err);
    }

    // 5. Build the Response object
    const response = NextResponse.json(
      {
        success: true,
        synced,
        access_token: authData.access_token,
        user: {
          id: authData.user_id,
          role: authData.role,
          dbData: dbUser,
        },
      },
      {
        headers: CORS_HEADERS,
      }
    );

    // 6. Set Cookies for the Frontend (Lax + Path are key for localhost)
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax" as const,
    };

    const accessTokenName = process.env.COOKIE_NAME || "sel_access_token";
    const refreshTokenName = process.env.COOKIE_REFRESH_NAME || "sel_refresh_token";

    // Set Access Token
    response.cookies.set(accessTokenName, authData.access_token, {
      ...cookieOptions,
      maxAge: authData.expires_in ?? 3600,
    });

    // Set Refresh Token
    response.cookies.set(refreshTokenName, authData.refresh_token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      {
        status: 400,
        headers: CORS_HEADERS,
      }
    );
  }
}
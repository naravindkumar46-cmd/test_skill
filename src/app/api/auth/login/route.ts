import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/prisma";
import { z } from "zod";

const LoginSchema = z.object({
  user_id:  z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    // 1. validate body
    const body   = await req.json();
    const parsed = LoginSchema.parse(body);

    // 2. call central auth app
    let authData;
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/auth/login`,
        parsed
      );
      authData = data;
    } catch (err: any) {
      return NextResponse.json({
        success: false,
        synced:  false,
        user:    null,
        error:   err.response?.data ?? err.message,
      });
    }

    // 3. fetch email from /me using the new access token
    let email = authData.user_id; // fallback
    try {
      const { data: meData } = await axios.get(
        `${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/auth/me`,
        { headers: { Authorization: `Bearer ${authData.access_token}` } }
      );
      email = meData.email;
    } catch {
      // keep fallback
    }

    // 4. sync user into DB
    let synced = false;
    let dbUser = null;

    try {
      dbUser = await prisma.user.upsert({
        where:  { id: authData.user_id },
        update: {
          email,
          role: authData.role?.toUpperCase() === "ADMIN" ? "ADMIN" : "USER",
        },
        create: {
          id:    authData.user_id,
          email,
          role:  authData.role?.toUpperCase() === "ADMIN" ? "ADMIN" : "USER",
        },
      });

      // synced = true only if profile is complete
      synced = !!(dbUser.businessGroup && dbUser.IOU && dbUser.account);
    } catch (err) {
      console.error("DB sync error:", err);
      synced = false;
    }

    // 5. build response with app-specific cookies
    const cookieOptions = {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      path:     "/",
    };

    const response = NextResponse.json({
      success:              true,
      synced,
      access_token:         authData.access_token,
      refresh_token:        authData.refresh_token,
      expires_in:           authData.expires_in,
      must_change_password: authData.must_change_password,
      password_expired:     authData.password_expired,
      user: {
        id:     authData.user_id,
        role:   authData.role,
        dbData: dbUser,
      },
    });

    response.cookies.set(process.env.COOKIE_NAME!, authData.access_token, {
      ...cookieOptions,
      maxAge: authData.expires_in ?? 60 * 60,
    });

    response.cookies.set(process.env.COOKIE_REFRESH_NAME!, authData.refresh_token, {
      ...cookieOptions,
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;

  } catch (error: any) {
    return NextResponse.json(
      { success: false, synced: false, error: error.message },
      { status: 400 }
    );
  }
}
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export interface AuthUser {
  user_id:              string;
  email:                string;
  role:                 string;
  must_change_password: boolean;
  password_expired:     boolean;
  created_at:           string;
}

async function verifyToken(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME!)?.value;

    if (!token) return null;

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/auth/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return data;
  } catch {
    return null;
  }
}

export function withAuth(
  handler: (
    req: NextRequest,
    ctx: { user: AuthUser; params: any }
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, { params }: { params: any }) => {
    const user = await verifyToken();

    if (!user) {
      return NextResponse.json(
        { detail: "Token expired" },
        { status: 401 }
      );
    }

    return handler(req, { user, params });
  };
}

export function withAdmin(
  handler: (
    req: NextRequest,
    ctx: { user: AuthUser; params: any }
  ) => Promise<NextResponse>
) {
  return async (req: NextRequest, { params }: { params: any }) => {
    const user = await verifyToken();

    if (!user) {
      return NextResponse.json(
        { detail: "Token expired" },
        { status: 401 }
      );
    }

    if (user.role !== "admin" && user.role !== "ADMIN") {
      return NextResponse.json(
        { detail: "Forbidden" },
        { status: 403 }
      );
    }

    return handler(req, { user, params });
  };
}
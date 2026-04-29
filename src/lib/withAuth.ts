import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios"; // Added AxiosError

export interface AuthUser {
  user_id: string;
  email: string;
  role: string;
  must_change_password: boolean;
  password_expired: boolean;
  created_at: string;
}

async function verifyToken(req?: NextRequest): Promise<AuthUser | null> {
  try {
    // 1. Try to get token from Cookies
    const cookieStore = await cookies();
    let token = cookieStore.get(process.env.COOKIE_NAME!)?.value;

    // 2. Fallback: Try to get token from Authorization Header
    if (!token && req) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) return null;

    // 3. Central Auth Handshake
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/auth/me`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return data;
  } catch (err) {
    // Cast to AxiosError to safely access .response
    const axiosError = err as AxiosError<{ detail?: string }>;
    console.error(
      "Auth Verification Failed:", 
      axiosError.response?.data?.detail || axiosError.message
    );
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
    const user = await verifyToken(req);

    if (!user) {
      return NextResponse.json(
        { detail: "Token expired or missing" },
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
    const user = await verifyToken(req);

    if (!user) {
      return NextResponse.json(
        { detail: "Token expired or missing" },
        { status: 401 }
      );
    }

    // Role check - handles both uppercase and lowercase
    if (user.role.toLowerCase() !== "admin") {
      return NextResponse.json(
        { detail: "Forbidden" },
        { status: 403 }
      );
    }

    return handler(req, { user, params });
  };
}
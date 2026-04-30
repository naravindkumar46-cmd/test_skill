import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Frontend proxy for GET /api/skills/[id]
 * Returns approved skill detail from backend.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    const searchParams = req.nextUrl.searchParams;

    const cookieStore = await cookies();
    const token = cookieStore.get('sel_access_token')?.value;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${backendUrl}/api/skills/${id}?${searchParams}`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill details from backend' },
      { status: 500 }
    );
  }
}

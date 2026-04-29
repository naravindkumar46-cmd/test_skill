import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Frontend proxy for /api/skills/my-skills
 * Forwards user's skills requests to backend
 */
export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    const searchParams = req.nextUrl.searchParams;
    
    const cookieStore = await cookies();
    const token = cookieStore.get('sel_access_token')?.value;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${backendUrl}/api/skills/my-skills?${searchParams}`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Backend error:', data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch your skills' },
      { status: 500 }
    );
  }
}

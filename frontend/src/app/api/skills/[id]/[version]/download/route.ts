import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Frontend proxy for POST /api/skills/[id]/[version]/download
 * Records download and returns backend payload with file_url.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; version: string }> }
) {
  try {
    const { id, version } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

    const cookieStore = await cookies();
    const token = cookieStore.get('sel_access_token')?.value;
    const body = await req.json();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${backendUrl}/api/skills/${id}/${version}/download`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
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
      { error: 'Failed to process download request' },
      { status: 500 }
    );
  }
}

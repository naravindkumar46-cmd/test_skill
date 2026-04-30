import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Frontend proxy for POST /api/admin/skills/[id]/reset-decision
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

    const cookieStore = await cookies();
    const token = cookieStore.get('sel_access_token')?.value;

    const response = await fetch(`${backendUrl}/api/admin/skills/${id}/reset-decision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json(data, { status: response.status });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Failed to reset decision' }, { status: 500 });
  }
}

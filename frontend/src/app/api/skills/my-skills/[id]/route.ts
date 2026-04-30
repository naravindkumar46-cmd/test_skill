import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Frontend proxy for GET /api/skills/my-skills/[id]
 * Returns latest skill detail for owner (USER).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

    const cookieStore = await cookies();
    const token = cookieStore.get('sel_access_token')?.value;

    const response = await fetch(`${backendUrl}/api/skills/my-skills/${id}`, {
      method: 'GET',
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
    return NextResponse.json(
      { error: 'Failed to fetch your skill detail' },
      { status: 500 }
    );
  }
}

/**
 * Frontend proxy for PUT /api/skills/my-skills/[id]
 * Updates user-owned skill and sends it back to pending approval.
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

    const cookieStore = await cookies();
    const token = cookieStore.get('sel_access_token')?.value;
    const body = await req.json();

    const response = await fetch(`${backendUrl}/api/skills/my-skills/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json(data, { status: response.status });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to update your skill' },
      { status: 500 }
    );
  }
}

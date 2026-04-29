import { NextRequest, NextResponse } from 'next/server';

/**
 * Frontend API route that proxies login requests to the backend
 * This avoids CORS issues by making the request server-to-server
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Determine backend URL from environment or default to localhost:4000
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Forward the response with cookies if any
    const result = NextResponse.json(data);
    
    // Copy cookies from backend response if they exist
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      result.headers.append('set-cookie', setCookieHeader);
    }

    return result;
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

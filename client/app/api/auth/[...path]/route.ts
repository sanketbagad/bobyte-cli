import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathStr = path.join('/');
  const searchParams = request.nextUrl.searchParams;
  
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const url = `${backendUrl}/api/auth/${pathStr}?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    const result = NextResponse.json(data, { status: response.status });
    
    // Forward cookies from backend
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      result.headers.set('set-cookie', setCookie);
    }
    
    return result;
  } catch (error) {
    console.error('Auth API route error:', error);
    return NextResponse.json(
      { error: 'Failed to process auth request' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathStr = path.join('/');
  const body = await request.json().catch(() => ({}));
  
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const url = `${backendUrl}/api/auth/${pathStr}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: request.headers.get('cookie') || '',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    const result = NextResponse.json(data, { status: response.status });
    
    // Forward cookies from backend
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      result.headers.set('set-cookie', setCookie);
    }
    
    return result;
  } catch (error) {
    console.error('Auth API route error:', error);
    return NextResponse.json(
      { error: 'Failed to process auth request' },
      { status: 500 }
    );
  }
}

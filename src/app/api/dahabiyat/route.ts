// Backward compatibility alias for /api/dahabiyat -> /api/dahabiyas
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Redirect to the correct endpoint
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const redirectUrl = `/api/dahabiyas${searchParams ? '?' + searchParams : ''}`;
    
    // Forward the request to the correct endpoint
    const baseUrl = url.origin;
    const response = await fetch(`${baseUrl}${redirectUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Internal-Redirect',
        // Forward auth headers if present
        ...(request.headers.get('authorization') && {
          'authorization': request.headers.get('authorization')!
        }),
        ...(request.headers.get('cookie') && {
          'cookie': request.headers.get('cookie')!
        })
      },
    });
    
    if (!response.ok) {
      throw new Error(`Upstream request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in dahabiyat compatibility endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dahabiyas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const baseUrl = url.origin;
    const body = await request.text();
    
    const response = await fetch(`${baseUrl}/api/dahabiyas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Internal-Redirect',
        // Forward auth headers if present
        ...(request.headers.get('authorization') && {
          'authorization': request.headers.get('authorization')!
        }),
        ...(request.headers.get('cookie') && {
          'cookie': request.headers.get('cookie')!
        })
      },
      body,
    });
    
    if (!response.ok) {
      throw new Error(`Upstream request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in dahabiyat compatibility endpoint (POST):', error);
    return NextResponse.json(
      { error: 'Failed to create dahabiya' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const baseUrl = url.origin;
    const body = await request.text();
    
    const response = await fetch(`${baseUrl}/api/dahabiyas`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Internal-Redirect',
        // Forward auth headers if present
        ...(request.headers.get('authorization') && {
          'authorization': request.headers.get('authorization')!
        }),
        ...(request.headers.get('cookie') && {
          'cookie': request.headers.get('cookie')!
        })
      },
      body,
    });
    
    if (!response.ok) {
      throw new Error(`Upstream request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in dahabiyat compatibility endpoint (PUT):', error);
    return NextResponse.json(
      { error: 'Failed to update dahabiya' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const baseUrl = url.origin;
    
    const response = await fetch(`${baseUrl}/api/dahabiyas`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Internal-Redirect',
        // Forward auth headers if present
        ...(request.headers.get('authorization') && {
          'authorization': request.headers.get('authorization')!
        }),
        ...(request.headers.get('cookie') && {
          'cookie': request.headers.get('cookie')!
        })
      },
    });
    
    if (!response.ok) {
      throw new Error(`Upstream request failed: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in dahabiyat compatibility endpoint (DELETE):', error);
    return NextResponse.json(
      { error: 'Failed to delete dahabiya' },
      { status: 500 }
    );
  }
}

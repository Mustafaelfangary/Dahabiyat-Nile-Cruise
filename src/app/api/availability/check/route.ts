import { NextRequest, NextResponse } from "next/server";

// Redirect old availability check endpoint to new unified endpoint
export async function POST(request: NextRequest) {
  console.log("🔄 Redirecting from old /api/availability/check to /api/availability");
  
  try {
    const body = await request.json();
    
    // Forward the request to the new endpoint
    const baseUrl = new URL(request.url).origin;
    const response = await fetch(`${baseUrl}/api/availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('❌ Error in availability check redirect:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  console.log("🔄 Redirecting GET from old /api/availability/check to /api/availability");
  
  try {
    // Forward the request to the new endpoint
    const baseUrl = new URL(request.url).origin;
    const searchParams = new URL(request.url).searchParams.toString();
    const response = await fetch(`${baseUrl}/api/availability${searchParams ? '?' + searchParams : ''}`, {
      method: 'GET',
      headers: request.headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('❌ Error in availability check redirect:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}

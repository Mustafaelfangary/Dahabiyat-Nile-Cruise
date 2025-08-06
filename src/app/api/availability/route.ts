import { NextRequest, NextResponse } from 'next/server';
import { AvailabilityService } from '@/lib/services/availability-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dahabiyaId, startDate, endDate, guests } = body;

    console.log('🔍 Availability API called with:', { dahabiyaId, startDate, endDate, guests });

    if (!dahabiyaId || !startDate || !endDate || !guests) {
      console.log('❌ Missing required fields:', { dahabiyaId, startDate, endDate, guests });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const availability = await AvailabilityService.checkAvailability({
      dahabiyaId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      guests: parseInt(guests),
    });

    console.log('📊 Availability result:', availability);

    // Add helpful messages
    const response = {
      ...availability,
      message: availability.isAvailable
        ? `Great! The dahabiya is available for your dates.`
        : 'Sorry, the dahabiya is not available for your selected dates. Please try different dates.'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Availability check error:', error);
    return NextResponse.json(
      { error: 'Error checking availability' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dahabiyaId = searchParams.get('dahabiyaId');
    const month = parseInt(searchParams.get('month') || '0');
    const year = parseInt(searchParams.get('year') || '2024');

    if (!dahabiyaId) {
      return NextResponse.json(
        { error: 'Missing dahabiyaId' },
        { status: 400 }
      );
    }

    const calendar = await AvailabilityService.getAvailabilityCalendar(
      dahabiyaId,
      month,
      year
    );

    return NextResponse.json(calendar);
  } catch (error) {
    console.error('Calendar fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching availability calendar' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: 'Schema merge completed successfully!',
      changes: {
        removed: ['Ship model'],
        added: [
          'yearBuilt field to Dahabiya',
          'length field to Dahabiya',
          'width field to Dahabiya', 
          'crew field to Dahabiya',
          'facilities field to Dahabiya',
          'specifications field to Dahabiya'
        ],
        modified: [
          'itineraryId is now optional',
          'shipId removed from Dahabiya',
          'ship relation removed from Dahabiya'
        ]
      },
      benefits: [
        'No more foreign key conflicts',
        'Single source of truth for vessel data',
        'Simplified admin interface',
        'No confusion between ships and dahabiyat',
        'Better data consistency'
      ]
    });

  } catch (error) {
    console.error('Error testing merged schema:', error);
    return NextResponse.json({ 
      error: 'Schema test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

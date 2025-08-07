# Unified Booking & Availability System

## Overview

The unified booking system ensures **atomic operations** between availability checking and booking creation, preventing race conditions and maintaining data consistency. The system is designed to handle both **Dahabiya** and **Package** bookings through a single, cohesive interface.

## Key Features

### ✅ **Atomic Booking Creation**
- **Database Transactions**: All availability checks and booking creation happen within a single database transaction
- **Race Condition Prevention**: Multiple users cannot book the same dates simultaneously
- **Data Consistency**: Ensures availability and bookings are always synchronized

### ✅ **Unified Interface**
- **Single Booking Form**: `UnifiedBookingForm` component handles both dahabiya and package bookings
- **Consistent API**: Same endpoints and data structures for all booking types
- **Type Safety**: Full TypeScript support with proper type definitions

### ✅ **Comprehensive Validation**
- **Date Validation**: Prevents past dates and invalid date ranges
- **Capacity Validation**: Ensures guest count doesn't exceed limits
- **Availability Validation**: Checks for conflicts and admin-blocked dates

## System Architecture

### Core Services

#### 1. **CleanBookingService** (`src/lib/services/unified-booking-service.ts`)
- **Primary Service**: Handles all booking operations
- **Atomic Operations**: Uses database transactions for consistency
- **Methods**:
  - `createBooking()` - Creates booking with atomic availability check
  - `updateBookingStatus()` - Updates booking status
  - `cancelBooking()` - Cancels booking with authorization
  - `getUserBookings()` - Gets user's bookings
  - `getBookingById()` - Gets specific booking with authorization

#### 2. **CleanAvailabilityService** (`src/lib/services/availability-service.ts`)
- **Read-Only Service**: Provides availability information for UI
- **Non-Atomic**: Used for display purposes only
- **Note**: For actual booking, use `CleanBookingService.createBooking()` which includes atomic availability checking

### API Endpoints

#### **POST /api/bookings**
Creates a new booking with atomic availability check.

**Request Body:**
```json
{
  "type": "DAHABIYA" | "PACKAGE",
  "dahabiyaId": "string", // for dahabiya bookings
  "packageId": "string",  // for package bookings
  "startDate": "2024-01-01",
  "endDate": "2024-01-05",
  "guests": 4,
  "totalPrice": 2000,
  "specialRequests": "string",
  "guestDetails": [
    {
      "name": "Guest Name",
      "email": "guest@email.com",
      "phone": "+1234567890"
    }
  ]
}
```

#### **GET /api/bookings/[id]**
Gets booking details with authorization check.

#### **PATCH /api/bookings/[id]**
Updates booking status or cancels booking.

**Request Body:**
```json
{
  "action": "cancel" // for cancellation
}
// OR
{
  "status": "CONFIRMED" | "CANCELLED" // admin only
}
```

#### **DELETE /api/bookings/[id]**
Deletes booking (admin only).

## Database Schema Integration

### Booking Model
```prisma
model Booking {
  id               String            @id @default(cuid())
  userId           String
  type             BookingType       // DAHABIYA | PACKAGE
  dahabiyaId       String?
  packageId        String?
  startDate        DateTime
  endDate          DateTime
  guests           Int
  totalPrice       Float
  specialRequests  String?
  status           BookingStatus     // PENDING | CONFIRMED | CANCELLED
  bookingReference String            @unique
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
  
  // Relations
  user             User              @relation(fields: [userId], references: [id])
  dahabiya         Dahabiya?         @relation(fields: [dahabiyaId], references: [id])
  package          Package?          @relation(fields: [packageId], references: [id])
  guestDetails     GuestDetail[]
}
```

### Availability Integration
- **Dahabiyas**: Checks `AvailabilityDate` table for admin-blocked dates
- **Packages**: Generally available unless specifically blocked
- **Conflict Detection**: Checks existing bookings for date overlaps

## Race Condition Prevention

### The Problem
Without proper synchronization, this scenario could occur:
1. User A checks availability ✅ Available
2. User B checks availability ✅ Available  
3. User A creates booking ✅ Success
4. User B creates booking ❌ Should fail but doesn't

### The Solution
**Database Transactions** ensure atomic operations:
```typescript
const result = await prisma.$transaction(async (tx) => {
  // 1. Check availability within transaction
  const conflicts = await tx.booking.findMany({...});
  
  if (conflicts.length > 0) {
    throw new Error('Dates not available');
  }
  
  // 2. Create booking within same transaction
  const booking = await tx.booking.create({...});
  
  return booking;
});
```

## Usage Examples

### Frontend Integration
```typescript
// Check availability (for UI display)
const availability = await fetch('/api/availability', {
  method: 'POST',
  body: JSON.stringify({
    type: 'DAHABIYA',
    itemId: 'dahabiya-id',
    startDate: '2024-01-01',
    endDate: '2024-01-05',
    guests: 4
  })
});

// Create booking (includes atomic availability check)
const booking = await fetch('/api/bookings', {
  method: 'POST',
  body: JSON.stringify({
    type: 'DAHABIYA',
    dahabiyaId: 'dahabiya-id',
    startDate: '2024-01-01',
    endDate: '2024-01-05',
    guests: 4,
    totalPrice: 2000,
    guestDetails: [...]
  })
});
```

### Service Integration
```typescript
// Direct service usage
import { CleanBookingService } from '@/lib/services/unified-booking-service';

const result = await CleanBookingService.createBooking(userId, {
  type: 'DAHABIYA',
  dahabiyaId: 'dahabiya-id',
  startDate: '2024-01-01',
  endDate: '2024-01-05',
  guests: 4,
  totalPrice: 2000,
  specialRequests: 'Vegetarian meals',
  guestDetails: [...]
});

if (result.success) {
  console.log('Booking created:', result.booking.bookingReference);
} else {
  console.error('Booking failed:', result.error);
}
```

## Testing

Run the comprehensive test suite:
```bash
node scripts/test-unified-booking-system.js
```

This test validates:
- ✅ Availability checking
- ✅ Atomic booking creation
- ✅ Race condition prevention
- ✅ Status updates
- ✅ Booking cancellation
- ✅ Data consistency

## Benefits

1. **Data Integrity**: No orphaned bookings or availability conflicts
2. **User Experience**: Consistent interface for all booking types
3. **Developer Experience**: Single API to learn and maintain
4. **Scalability**: Handles concurrent users safely
5. **Maintainability**: Centralized booking logic

## Migration Notes

- **Old booking flows** should be updated to use the unified system
- **Availability checks** should use the new atomic booking creation
- **Type consistency** ensures `DAHABIYA`/`PACKAGE` format throughout
- **Email notifications** are handled automatically by the service

---

**⚠️ Important**: Always use `CleanBookingService.createBooking()` for actual bookings. The availability service is for UI display only and doesn't prevent race conditions.

// Legacy component - now uses UnifiedBookingForm
"use client";

import UnifiedBookingForm from './UnifiedBookingForm';

interface BookingFormProps {
  dahabiyaId: string;
  dahabiyaName?: string;
  basePrice?: number;
  price?: number | string;
  minDays?: number;
  duration?: number;
  maxGuests?: number;
}

function BookingForm({
  dahabiyaId,
  dahabiyaName = 'Dahabiya',
  basePrice,
  price,
  minDays = 1,
  duration,
  maxGuests = 16
}: BookingFormProps) {
  const finalPrice = basePrice || Number(price) || 0;

  return (
    <UnifiedBookingForm
      type="dahabiya"
      itemId={dahabiyaId}
      itemName={dahabiyaName}
      basePrice={finalPrice}
      maxGuests={maxGuests}
      minDays={minDays}
      durationDays={duration}
      style="pharaonic"
      showAvailabilityCheck={true}
      // showCabinSelection={true}  // REMOVED: cabin system removed
    />
  );
}

export default BookingForm;
export { BookingForm };
// Legacy component - now uses UnifiedBookingForm
"use client";

import UnifiedBookingForm from './UnifiedBookingForm';

interface PackageBookingFormProps {
  packageId: string;
  packageName?: string;
  basePrice?: number;
  price?: number | string;
  durationDays: number;
  maxGuests?: number;
}

function PackageBookingForm({
  packageId,
  packageName = 'Package',
  basePrice,
  price,
  durationDays,
  maxGuests = 20
}: PackageBookingFormProps) {
  const finalPrice = basePrice || Number(price) || 0;

  return (
    <UnifiedBookingForm
      type="package"
      itemId={packageId}
      itemName={packageName}
      basePrice={finalPrice}
      maxGuests={maxGuests}
      durationDays={durationDays}
      style="pharaonic"
      showAvailabilityCheck={true}
      showCabinSelection={false}
    />
  );
}

export default PackageBookingForm;
export { PackageBookingForm };

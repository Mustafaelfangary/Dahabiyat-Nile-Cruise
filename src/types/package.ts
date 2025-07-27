import type { Prisma } from "@prisma/client";
import type { Decimal } from "@prisma/client/runtime/library";

// Current Package types based on the actual Package model
export interface PackageWithRelations {
  id: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: Decimal;
  durationDays: number;
  mainImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  itineraryDays: Array<{
    id: string;
    dayNumber: number;
    title: string;
    description: string;
    images: Array<{
      id: string;
      url: string;
      alt?: string;
    }>;
  }>;
}

export interface PackageFormData {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  durationDays: number;
  mainImageUrl?: string;
  itineraryDays: Array<{
    dayNumber: number;
    title: string;
    description: string;
    images?: Array<{
      url: string;
      alt?: string;
    }>;
  }>;
}

export interface PackageCreateInput extends Omit<PackageFormData, 'price'> {
  price: Decimal;
}
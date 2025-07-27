import React from 'react';
import { DahabiyaDetail } from '@/components/dahabiyas';

interface DahabiyaPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DahabiyaPage({ params }: DahabiyaPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <DahabiyaDetail slug={slug} />
    </div>
  );
}

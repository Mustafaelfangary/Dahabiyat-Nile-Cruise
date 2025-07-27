import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Since the Page model has been removed, redirect all dynamic pages to 404
  // Pages are now managed through the website content system at /admin/website
  notFound();
}
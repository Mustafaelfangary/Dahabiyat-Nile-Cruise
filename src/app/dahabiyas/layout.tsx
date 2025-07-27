import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dahabiyas - Cleopatra Dahabiyat',
  description: 'Explore our collection of traditional Nile sailing vessels. Experience luxury and comfort aboard our carefully selected dahabiyas.',
  keywords: 'dahabiya, nile cruise, egypt, luxury travel, traditional sailing',
};

export default function DahabiyasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

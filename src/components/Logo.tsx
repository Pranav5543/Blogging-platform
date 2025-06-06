
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
      <LayoutDashboard className="h-6 w-6 text-primary" />
      <span className="font-headline text-xl font-bold text-primary">Digital Workbench</span>
    </Link>
  );
}

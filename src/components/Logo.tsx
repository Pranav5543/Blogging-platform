
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react'; // Using LayoutDashboard as a generic 'canvas' or 'mind' icon placeholder

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base ml-2 sm:ml-0"> {/* Added ml-2 for small screens, default for sm and up */}
      <LayoutDashboard className="h-6 w-6 text-primary" />
      <span className="font-headline text-xl font-bold text-primary">MindCanvas</span>
    </Link>
  );
}

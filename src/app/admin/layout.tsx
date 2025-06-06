
"use client";

import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import { Spinner } from '@/components/Spinner';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not loading, no user, and NOT on the login page, redirect to login
    if (!loading && !user && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-grow items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }
  
  // If there's no user AND we are NOT on the login page, show "Redirecting..."
  // This prevents the login page itself from showing this message.
  if (!user && pathname !== '/admin/login') {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-grow items-center justify-center">
          <p>Redirecting to login...</p>
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  // If user is authenticated OR if we are on the login page (even if !user), render children
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar /> {/* Admin might have a different Navbar or a sub-nav */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

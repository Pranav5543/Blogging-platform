"use client";

import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import { Spinner } from '@/components/Spinner';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

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
  
  if (!user) {
     // This case should ideally be handled by the useEffect redirect,
     // but as a fallback, show spinner or a message before redirect kicks in.
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

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar /> {/* Admin might have a different Navbar or a sub-nav */}
      <main className="flex-grow container py-8">
        {children}
      </main>
    </div>
  );
}

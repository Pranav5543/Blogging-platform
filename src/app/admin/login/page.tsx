
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChromeIcon, Shield } from 'lucide-react'; 
import { toast } from "@/hooks/use-toast";
import { Spinner } from '@/components/Spinner';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/admin/dashboard');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      // Diagnostic log
      console.log("Attempting Google Sign-In. SDK is using authDomain:", auth.app.options.authDomain);
      
      await signInWithPopup(auth, googleProvider);
      toast({ title: "Login Successful", description: "Redirecting to dashboard..." });
      router.push('/admin/dashboard');
    } catch (error) {
      console.error("Google Sign-In Error: ", error);
      let errorMessage = "Could not sign in with Google. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = String((error as { message: string }).message);
        if ('code' in error) {
           console.error("Firebase Error Code:", (error as { code: string }).code);
        }
      }
      
      toast({ 
        title: "Login Failed", 
        description: errorMessage, 
        variant: "destructive" 
      });
    }
  };

  if (loading || (!loading && user)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading your session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
        <CardHeader className="text-center p-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner">
            <Shield size={40} strokeWidth={1.5} />
          </div>
          <CardTitle className="text-3xl font-headline text-primary">Admin Access</CardTitle>
          <CardDescription className="text-muted-foreground pt-1">Securely sign in to manage your Digital Workbench.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <Button 
            onClick={handleGoogleSignIn} 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 ease-in-out transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 py-3 text-base"
            aria-label="Sign in with Google"
          >
            <ChromeIcon className="mr-2 h-5 w-5" />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


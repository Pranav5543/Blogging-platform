
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, KeyRound, Loader2 as Loader } from 'lucide-react'; 
import { toast } from "@/hooks/use-toast";
import { Spinner } from '@/components/Spinner';

export default function LoginPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/admin/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Login Successful", description: "Redirecting to dashboard..." });
      router.push('/admin/dashboard');
    } catch (error) {
      console.error("Email/Password Auth Error: ", error);
      let errorMessage = "An error occurred. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
        if ('code' in error) {
          const firebaseErrorCode = (error as { code: string }).code;
          console.error("Firebase Error Code:", firebaseErrorCode);
          if (firebaseErrorCode === 'auth/user-not-found' || firebaseErrorCode === 'auth/invalid-credential') {
            errorMessage = 'Invalid email or password. Please check your credentials.';
          } else if (firebaseErrorCode === 'auth/wrong-password') {
            errorMessage = 'Incorrect password. Please try again.';
          } else if (firebaseErrorCode === 'auth/too-many-requests') {
            errorMessage = 'Access temporarily disabled due to too many failed login attempts. Please try again later.';
          }
        }
      }
      toast({ 
        title: "Login Failed", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || (!authLoading && user)) {
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
          <CardTitle className="text-3xl font-headline text-primary">
            Admin Access
          </CardTitle>
          <CardDescription className="text-muted-foreground pt-1">
            Securely sign in to manage your Digital Workbench.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-0">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                 <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="pl-10"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 ease-in-out transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 py-3 text-base"
            >
              {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="p-8 pt-2 flex flex-col items-center">
          <p className="text-xs text-muted-foreground">
            Admin accounts are created via the Firebase Console.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
    

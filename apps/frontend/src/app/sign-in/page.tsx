"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';
import { LinkedinIcon } from '@/components/icons/LinkedinIcon';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export default function SignInPage() {
  const { setRole } = useUserRole();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLinkedInLogin = () => {
    setIsLoading(true);
    // This will be handled by the backend
    window.location.href = 'http://localhost:3001/auth/linkedin';
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sign-in logic
    setRole('job_seeker'); 
    toast({
      title: "Signed In Successfully",
      description: "Welcome back! Redirecting to your dashboard.",
    });
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
       <Button variant="ghost" className="absolute top-4 left-4" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Link>
      </Button>
      <Card className="w-full max-w-md shadow-2xl animate-scaleUp">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-headline">Sign In to TrueMatch</CardTitle>
          <CardDescription>Access your account or create a new one.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-6">
            <Button 
              type="button"
              variant="outline" 
              className="w-full hover:bg-accent/20 active:scale-95 transition-all"
              onClick={handleLinkedInLogin}
              disabled={isLoading}
            >
              <LinkedinIcon className="mr-2 h-5 w-5" /> 
              {isLoading ? 'Redirecting to LinkedIn...' : 'Sign in with LinkedIn'}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full hover:opacity-80 active:scale-95 transition-all">
              <Mail className="mr-2 h-5 w-5" /> Sign In with Email
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link href="#" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
          <Link href="#" className="mt-2 font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

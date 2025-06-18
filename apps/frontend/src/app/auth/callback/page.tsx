'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/contexts/UserRoleContext';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { setRole } = useUserRole();

  useEffect(() => {
    const status = searchParams.get('status');
    
    if (status === 'success') {
      const userParam = searchParams.get('user');
      if (userParam) {
        try {
          const user = JSON.parse(userParam);
          setRole('job_seeker');
          
          // Store user data in localStorage for welcome message
          if (user.email) {
            localStorage.setItem('userEmail', user.email);
          }
          
          // Show welcome message with email
          toast({
            title: 'Successfully signed in',
            description: `Welcome, ${user.email || 'User'}!`,
          });
        } catch (e) {
          console.error('Error parsing user data:', e);
          toast({
            title: 'Error',
            description: 'Failed to process user data',
            variant: 'destructive',
          });
        }
      }
      router.push('/dashboard');
    } else if (status === 'error') {
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      toast({
        title: 'Sign in failed',
        description: errorDescription || 'An error occurred during sign in',
        variant: 'destructive',
      });
      
      router.push('/sign-in');
    } else {
      // No status or unknown status, redirect to sign in
      router.push('/sign-in');
    }
  }, [router, searchParams, setRole, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-t-primary border-muted rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}

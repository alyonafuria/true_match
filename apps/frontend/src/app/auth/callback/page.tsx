'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/contexts/UserRoleContext';
import { loginWithII } from '@/lib/ii';
import type { LinkedInUser } from '@/types/auth';

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { setRole } = useUserRole();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const handleAuth = async () => {
      const status = searchParams.get('status');
      
      if (status === 'success') {
        const userParam = searchParams.get('user');
        if (userParam) {
          try {
            const user = JSON.parse(userParam) as LinkedInUser;
            setRole('job_seeker');
            
            // Store user data in localStorage for welcome message
            if (user.email) {
              localStorage.setItem('userEmail', user.email);
            }
            if (user.name) {
              localStorage.setItem('userName', user.name);
            }
            
            // Start II authentication
            setIsAuthenticating(true);
            
            // Login with Internet Identity
            await loginWithII(
              (principal: string) => {
                console.log('II login successful with principal:', principal);
                localStorage.setItem('iiPrincipal', principal);
                
                toast({
                  title: 'Successfully signed in',
                  description: `Welcome, ${user.email || 'User'}!`,
                });
                
                router.push('/dashboard');
              },
              {
                id: user.sub,
                email: user.email
              }
            );
          } catch (e) {
            console.error('Error during authentication:', e);
            setIsAuthenticating(false);
            toast({
              title: 'Error',
              description: 'Failed to complete authentication',
              variant: 'destructive',
            });
            router.push('/sign-in');
          }
        } else {
          router.push('/sign-in');
        }
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
    };

    handleAuth();
  }, [router, searchParams, setRole, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-t-primary border-muted rounded-full animate-spin mx-auto"></div>
        <p className="text-muted-foreground">
          {isAuthenticating ? 'Completing Internet Identity authentication...' : 'Completing sign in...'}
        </p>
      </div>
    </div>
  );
}

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
  const [isIIConnecting, setIsIIConnecting] = useState(false);

  useEffect(() => {
    const handleAuth = async () => {
      console.log('Auth callback received params:', searchParams.toString());
      
      const status = searchParams.get('status');
      
      if (status === 'success') {
        const userParam = searchParams.get('user');
        if (userParam) {
          try {
            const user = JSON.parse(decodeURIComponent(userParam)) as LinkedInUser;
            console.log('Parsed user data:', user);
            
            if (!user.email || !user.id) {
              throw new Error('Missing required user data');
            }
            
            // Store user data in localStorage
            localStorage.setItem('userEmail', user.email);
            if (user.name) {
              localStorage.setItem('userName', user.name);
            }
            
            // Store complete user data
            localStorage.setItem('user', JSON.stringify(user));
            
            console.log('User data stored, initiating II login...');
            
            // Show loading message
            toast({
              title: 'Connecting to Internet Identity...',
              description: 'Please complete the Internet Identity authentication',
            });
            
            // Set loading state
            setIsIIConnecting(true);
            
            // Start II login flow
            try {
              await loginWithII(
                (principal) => {
                  console.log('II login successful with principal:', principal);
                  
                  // Store the II principal in localStorage
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('iiPrincipal', principal);
                    console.log('Stored II principal in localStorage');
                  }
                  
                  // Set user role after successful II login
                  setRole('job_seeker');
                  
                  // Show success message
                  toast({
                    title: 'Successfully signed in',
                    description: `Welcome, ${user.email || 'User'}!`,
                  });
                  
                  // Redirect to dashboard
                  router.push('/dashboard');
                },
                { id: user.id, email: user.email }
              );
            } catch (error) {
              console.error('II login failed:', error);
              toast({
                title: 'Authentication Error',
                description: 'Failed to connect with Internet Identity. Please try again.',
                variant: 'destructive',
              });
              router.push('/sign-in');
            } finally {
              setIsIIConnecting(false);
            }
            
          } catch (error) {
            console.error('Error handling authentication:', error);
            toast({
              title: 'Authentication Error',
              description: 'There was an error processing your login. Please try again.',
              variant: 'destructive',
            });
            router.push('/sign-in');
          }
        } else {
          console.error('No user data in callback');
          toast({
            title: 'Authentication Error',
            description: 'No user data received. Please try logging in again.',
            variant: 'destructive',
          });
          router.push('/sign-in');
        }
      } else if (status === 'error') {
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        console.error('Auth error:', { error, errorDescription });
        
        toast({
          title: 'Sign in failed',
          description: errorDescription || 'An error occurred during sign in',
          variant: 'destructive',
        });
        
        router.push('/sign-in');
      } else {
        console.error('No status in callback, redirecting to sign-in');
        // No status or unknown status, redirect to sign in
        router.push('/sign-in');
      }
    };

    handleAuth();
  }, [searchParams, router, setRole, toast]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 space-y-4 text-center">
        <h1 className="text-2xl font-bold">
          {isIIConnecting ? 'Connecting to Internet Identity...' : 'Completing Sign In'}
        </h1>
        <p>
          {isIIConnecting 
            ? 'Please complete the authentication in the popup window...' 
            : 'Please wait while we sign you in...'}
        </p>
        {isIIConnecting && (
          <div className="mt-4 animate-pulse">
            <div className="h-4 bg-primary/20 rounded w-3/4 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
}

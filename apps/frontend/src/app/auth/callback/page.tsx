'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/contexts/UserRoleContext';
import { loginWithII } from '@/lib/ii';

interface UserData {
  id: string;
  email: string;
  name?: string;
  sub?: string;
}

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { setRole } = useUserRole();
  const [isIIConnecting, setIsIIConnecting] = useState(false);

  const handleIILogin = useCallback(async (user: UserData) => {
    try {
      setIsIIConnecting(true);
      
      // Show loading message for II login
      toast({
        title: 'Connecting to Internet Identity...',
        description: 'Please complete the Internet Identity authentication',
      });
      
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
  }, [router, setRole, toast]);

  useEffect(() => {
    const processAuth = async () => {
      try {
        const status = searchParams.get('status');
        
        if (status !== 'success') {
          throw new Error('Authentication failed: Invalid status');
        }

        const userParam = searchParams.get('user');
        if (!userParam) {
          throw new Error('Authentication failed: No user data');
        }

        // Decode and parse user data
        const user = JSON.parse(decodeURIComponent(userParam)) as UserData;
        console.log('Parsed user data:', user);
        
        if (!user.email || !(user.id || user.sub)) {
          throw new Error('Authentication failed: Missing required user data');
        }
        
        // Use sub as id if id is not present
        const userId = user.id || user.sub || '';
        if (!userId) {
          throw new Error('Authentication failed: No user ID found');
        }
        
        // Store user data in localStorage
        localStorage.setItem('userEmail', user.email);
        if (user.name) {
          localStorage.setItem('userName', user.name);
        }
        
        // Store complete user data with consistent id
        const userData = { ...user, id: userId };
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('User data stored, checking for existing II principal...');
        
        // Check if we already have an II principal for this user
        const storedPrincipal = localStorage.getItem('iiPrincipal');
        if (storedPrincipal) {
          console.log('Found existing II principal, proceeding to dashboard');
          setRole('job_seeker');
          router.push('/dashboard');
          return;
        }
        
        // Start II login flow
        await handleIILogin({ ...userData, id: userId });
        
      } catch (error) {
        console.error('Authentication error:', error);
        toast({
          title: 'Authentication Error',
          description: error instanceof Error ? error.message : 'An unknown error occurred',
          variant: 'destructive',
        });
        router.push('/sign-in');
      }
    };

    processAuth();
  }, [searchParams, router, toast, setRole, handleIILogin]);

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

"use client";

import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { role, isLoading } = useUserRole();
  const router = useRouter();

  useEffect(() => {
    // This is a client component, so router is available.
    // In a real app, you'd check auth status. If not authenticated, redirect to /sign-in.
    // For this scaffold, we assume if someone reaches here, they are "signed in".
    // The role context handles initial role loading.
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full bg-primary/20" />
          <Skeleton className="h-6 w-48 bg-primary/20" />
          <p className="text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    );
  }
  
  // If no role after loading (should not happen with default), redirect or show error
  if (!role && !isLoading) {
     router.push('/sign-in'); // Or a role selection page
     return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p>Redirecting...</p>
      </div>
     );
  }


  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

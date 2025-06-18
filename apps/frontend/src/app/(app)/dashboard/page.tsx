"use client";

import { useUserRole } from '@/contexts/UserRoleContext';
import { UserDashboard } from '@/components/dashboards/UserDashboard';
import { EmployerDashboard } from '@/components/dashboards/EmployerDashboard';
import { VerifierDashboard } from '@/components/dashboards/VerifierDashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, Briefcase, FileCheck } from 'lucide-react';
import type { UserRole } from '@/types';


export default function DashboardPage() {
  const { role, isLoading, setRole } = useUserRole();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-3/4" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
          <Skeleton className="h-40 rounded-lg" />
        </div>
        <Skeleton className="h-64 rounded-lg" />
      </div>
    );
  }

  if (!role) {
    // This case should ideally be handled by _app or a higher-level layout redirecting to login or role selection
    return (
       <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
        <Card className="w-full max-w-lg p-8 text-center">
            <CardHeader>
                <CardTitle className="text-2xl font-bold font-headline">Select Your Role</CardTitle>
                <CardDescription>Choose how you want to use TrueMatch today.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={() => setRole('job_seeker' as UserRole)} className="w-full" size="lg">
                    <UserCircle className="mr-2 h-5 w-5" /> Continue as Job Seeker
                </Button>
                <Button onClick={() => setRole('employer' as UserRole)} className="w-full" size="lg">
                    <Briefcase className="mr-2 h-5 w-5" /> Continue as Employer
                </Button>
                <Button onClick={() => setRole('verifier' as UserRole)} className="w-full" size="lg">
                    <FileCheck className="mr-2 h-5 w-5" /> Continue as Verifier
                </Button>
            </CardContent>
        </Card>
       </div>
    );
  }

  switch (role) {
    case 'job_seeker':
      return <UserDashboard />;
    case 'employer':
      return <EmployerDashboard />;
    case 'verifier':
      return <VerifierDashboard />;
    default:
      return <div>Invalid role selected.</div>;
  }
}

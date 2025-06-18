"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileText, Briefcase, CheckCircle, ArrowRight, UserCircle } from 'lucide-react';
import { sampleUserProfile, sampleJobs } from '@/lib/data'; // Assuming UserProfile includes CV status
import Image from 'next/image';

export function UserDashboard() {
  const userProfile = sampleUserProfile;
  const recommendedJob = sampleJobs[0]; // Example recommended job

  // Calculate profile completion
  let profileCompletion = 0;
  if (userProfile.headline) profileCompletion += 20;
  if (userProfile.summary) profileCompletion += 20;
  if (userProfile.parsedInfo?.experience && userProfile.parsedInfo.experience.length > 0) profileCompletion += 20;
  if (userProfile.parsedInfo?.education && userProfile.parsedInfo.education.length > 0) profileCompletion += 20;
  if (userProfile.skills && userProfile.skills.length > 0) profileCompletion += 20;
  
  // Get user email from localStorage
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold font-headline">Welcome back, {userEmail || 'User'}!</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideInUp">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-headline">CV Status</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${userProfile.verificationStatus === 'Verified' ? 'text-green-600' : 'text-amber-600'}`}>
              {userProfile.verificationStatus}
            </div>
            <p className="text-xs text-muted-foreground">
              {userProfile.verificationStatus === 'Verified' ? 'Your CV is fully verified.' : 'Some items may need verification.'}
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild className="w-full hover:bg-accent/10 active:scale-[0.98] transition-all">
              <Link href="/profile">View My CV <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideInUp" style={{animationDelay: '0.1s'}}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-headline">Profile Completion</CardTitle>
            <CheckCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileCompletion}%</div>
            <Progress value={profileCompletion} className="w-full mt-2 h-2" />
          </CardContent>
           <CardFooter>
            <Button variant="outline" size="sm" asChild className="w-full hover:bg-accent/10 active:scale-[0.98] transition-all">
              <Link href="/profile">Complete Profile <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideInUp md:col-span-2 lg:col-span-1" style={{animationDelay: '0.2s'}}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-headline">Best Job Fit</CardTitle>
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {recommendedJob ? (
              <>
                <div className="text-lg font-semibold">{recommendedJob.title}</div>
                <p className="text-sm text-muted-foreground">{recommendedJob.company}</p>
                <div className="mt-2 text-primary font-semibold">{recommendedJob.fitPercentage}% Match</div>
              </>
            ) : (
              <p className="text-muted-foreground">No specific job recommendations yet. Explore the job board!</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="default" size="sm" asChild className="w-full hover:opacity-80 active:scale-[0.98] transition-all">
              <Link href="/jobs">Explore Jobs <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         <Card className="animate-slideInUp" style={{animationDelay: '0.3s'}}>
          <CardHeader>
            <CardTitle className="font-headline">Recent Applications</CardTitle>
            <CardDescription>Track the status of your latest job applications.</CardDescription>
          </CardHeader>
          <CardContent>
             {sampleUserProfile.parsedInfo?.education && sampleUserProfile.parsedInfo.education.length > 0 ? (
                <ul className="space-y-2">
                {[...sampleJobs].slice(0,2).map(job => (
                  <li key={job.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50">
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <span className="text-sm text-primary">Applied</span>
                  </li>
                ))}
              </ul>
             ) : (
                <p className="text-muted-foreground">No recent applications.</p>
             )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full hover:bg-accent/10 active:scale-[0.98] transition-all">
                <Link href="/applications">View All Applications <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="animate-slideInUp" style={{animationDelay: '0.4s'}}>
            <CardHeader>
                <CardTitle className="font-headline">Quick Actions</CardTitle>
                <CardDescription>Get started with these common tasks.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" asChild className="w-full hover:bg-accent/10 active:scale-[0.98] transition-all">
                    <Link href="/profile" className="flex flex-col h-24 justify-center items-center">
                        <UserCircle className="h-8 w-8 mb-1 text-primary" />
                        Update Profile
                    </Link>
                </Button>
                <Button variant="outline" asChild className="w-full hover:bg-accent/10 active:scale-[0.98] transition-all">
                    <Link href="/jobs" className="flex flex-col h-24 justify-center items-center">
                        <Briefcase className="h-8 w-8 mb-1 text-primary" />
                        Search Jobs
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

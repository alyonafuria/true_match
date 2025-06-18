"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileCheck, ClipboardList, AlertTriangle, CheckCircle2, ArrowRight, TrendingUp } from 'lucide-react';
import { sampleVerificationQueue } from '@/lib/data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const verificationActivityData = [
  { name: 'Mon', verified: 5, rejected: 1 },
  { name: 'Tue', verified: 7, rejected: 2 },
  { name: 'Wed', verified: 6, rejected: 0 },
  { name: 'Thu', verified: 8, rejected: 1 },
  { name: 'Fri', verified: 10, rejected: 3 },
  { name: 'Sat', verified: 4, rejected: 1 },
  { name: 'Sun', verified: 3, rejected: 0 },
];


export function VerifierDashboard() {
  const pendingClaimsCount = sampleVerificationQueue.filter(claim => claim.status === 'Pending').length;
  const approvedTodayCount = sampleVerificationQueue.filter(claim => claim.status === 'Approved' /* && isToday(claim.verifiedDate) */).length || 5; // Placeholder
  const averageReviewTime = "24 hours"; // Placeholder

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold font-headline">Verifier Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideInUp">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-headline">Pending Reviews</CardTitle>
            <ClipboardList className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingClaimsCount}</div>
            <p className="text-xs text-muted-foreground">Claims awaiting your verification</p>
          </CardContent>
          <CardFooter>
            <Button variant="default" size="sm" asChild className="w-full hover:opacity-80 active:scale-[0.98] transition-all">
              <Link href="/review">Go to Review Queue <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideInUp" style={{animationDelay: '0.1s'}}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-headline">Approved Today</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedTodayCount}</div>
            <p className="text-xs text-muted-foreground">Claims verified and approved today</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideInUp" style={{animationDelay: '0.2s'}}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-headline">Avg. Review Time</CardTitle>
            <AlertTriangle className="h-5 w-5 text-muted-foreground" /> {/* Using AlertTriangle as a placeholder icon */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageReviewTime}</div>
            <p className="text-xs text-muted-foreground">Average time to process a claim</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-1 animate-slideInUp" style={{animationDelay: '0.3s'}}>
          <CardHeader>
            <CardTitle className="font-headline">High Priority Claims</CardTitle>
            <CardDescription>Oldest pending claims needing attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Claim Type</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleVerificationQueue
                  .filter(claim => claim.status === 'Pending')
                  .sort((a,b) => new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime())
                  .slice(0, 3)
                  .map(claim => (
                  <TableRow key={claim.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{claim.candidateName}</TableCell>
                    <TableCell>{claim.claimType}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(claim.submittedDate).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {sampleVerificationQueue.filter(claim => claim.status === 'Pending').length === 0 && (
                <p className="text-muted-foreground mt-4 text-center">No pending claims. Great job!</p>
            )}
          </CardContent>
          <CardFooter>
             <Button variant="outline" size="sm" asChild className="w-full hover:bg-accent/10 active:scale-[0.98] transition-all">
              <Link href="/review">View Full Queue <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>

         <Card className="lg:col-span-1 animate-slideInUp" style={{animationDelay: '0.4s'}}>
          <CardHeader>
            <CardTitle className="font-headline">Verification Activity</CardTitle>
            <CardDescription>Claims processed this week.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={verificationActivityData} margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                  cursor={{ fill: 'hsl(var(--accent)/0.1)' }}
                />
                <Bar dataKey="verified" stackId="a" fill="hsl(var(--primary))" name="Approved" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" stackId="a" fill="hsl(var(--destructive))" name="Rejected" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

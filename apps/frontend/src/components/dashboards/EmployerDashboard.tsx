
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Briefcase, Users, CreditCard, PlusCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'; // Assuming recharts is available
import { sampleEmployerJobs, sampleEmployerPayments, sampleApplicants } from '@/lib/data';

const applicationTrendData = [
  { name: 'Mon', applications: 4 },
  { name: 'Tue', applications: 3 },
  { name: 'Wed', applications: 6 },
  { name: 'Thu', applications: 5 },
  { name: 'Fri', applications: 8 },
  { name: 'Sat', applications: 7 },
  { name: 'Sun', applications: 10 },
];

export function EmployerDashboard() {
  const openJobsCount = sampleEmployerJobs.filter(job => job.status === 'open').length;
  const totalApplicantsCount = sampleEmployerJobs.reduce((sum, job) => sum + (job.applicantsCount || 0), 0);
  const pendingPaymentsCount = sampleEmployerPayments.filter(pay => pay.status === 'Pending').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold font-headline">Employer Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideInUp">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-headline">Open Jobs</CardTitle>
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openJobsCount}</div>
            <p className="text-xs text-muted-foreground">Currently active job postings</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" asChild className="w-full hover:bg-accent/10 active:scale-[0.98] transition-all">
              <Link href="/jobs/manage">Manage Jobs <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideInUp" style={{animationDelay: '0.1s'}}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-headline">Total Applicants</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplicantsCount}</div>
            <p className="text-xs text-muted-foreground">Across all active jobs</p>
          </CardContent>
           <CardFooter>
            <Button variant="outline" size="sm" asChild className="w-full hover:bg-accent/10 active:scale-[0.98] transition-all">
              <Link href="/jobs/manage">View Applicants <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideInUp" style={{animationDelay: '0.2s'}}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium font-headline">Pending Payments</CardTitle>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPaymentsCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting payment completion</p>
          </CardContent>
          <CardFooter>
            <Button variant="default" size="sm" asChild className="w-full hover:opacity-80 active:scale-[0.98] transition-all">
              <Link href="/payments">Manage Payments <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-1 animate-slideInUp" style={{animationDelay: '0.3s'}}>
          <CardHeader>
            <CardTitle className="font-headline">Recent Job Postings</CardTitle>
            <CardDescription>Overview of your latest job ads.</CardDescription>
          </CardHeader>
          <CardContent>
            {sampleEmployerJobs.slice(0, 3).map(job => (
              <div key={job.id} className="flex items-center justify-between py-2 border-b last:border-none">
                <div>
                  <Link href={`/jobs/manage`} className="font-medium hover:underline">{job.title}</Link>
                  <p className="text-sm text-muted-foreground">{job.applicantsCount || 0} Applicants</p>
                </div>
                <Badge variant={job.status === 'open' ? 'default' : 'secondary'} className={`${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {job.status === 'open' ? 'Open' : 'Closed'}
                </Badge>
              </div>
            ))}
            {sampleEmployerJobs.length === 0 && <p className="text-muted-foreground">No jobs posted yet.</p>}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full hover:bg-accent/10 active:scale-[0.98] transition-all">
              <Link href="/jobs/post">Post a New Job <PlusCircle className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="lg:col-span-1 animate-slideInUp" style={{animationDelay: '0.4s'}}>
          <CardHeader>
            <CardTitle className="font-headline">Application Trends</CardTitle>
            <CardDescription>Number of applications received this week.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={applicationTrendData} margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
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
                <Line type="monotone" dataKey="applications" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r:4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Minimal Badge component if not using shadcn/ui Badge directly or for custom styling
function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
  let baseStyle = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";
  if (variant === 'default') baseStyle += " border-transparent bg-primary text-primary-foreground";
  else baseStyle += " border-transparent bg-secondary text-secondary-foreground";
  return <div className={`${baseStyle} ${className}`}>{children}</div>;
}

"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { sampleUserApplications } from '@/lib/data';
import type { Application } from '@/types';
import { CheckSquare, Briefcase, Percent, CalendarDays, ExternalLink, Filter, TrendingUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const applicationStatusOrder: Record<Application['status'], number> = {
  'Offered': 1,
  'Interviewing': 2,
  'Screening': 3,
  'Applied': 4,
  'Withdrawn': 5,
  'Rejected': 6,
};

const applicationActivityData = [
  { name: 'Jan', applications: 2 },
  { name: 'Feb', applications: 3 },
  { name: 'Mar', applications: 1 },
  { name: 'Apr', applications: 4 },
  { name: 'May', applications: 2 },
  { name: 'Jun', applications: 5 },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(sampleUserApplications);
  const [filterStatus, setFilterStatus] = useState<string>('');

  const filteredApplications = applications
    .filter(app => filterStatus ? app.status === filterStatus : true)
    .sort((a, b) => applicationStatusOrder[a.status] - applicationStatusOrder[b.status] || new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());

  const getStatusBadgeVariant = (status: Application['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Offered': return 'default'; // Or a success variant
      case 'Interviewing': return 'default';
      case 'Screening': return 'secondary';
      case 'Applied': return 'outline';
      case 'Rejected':
      case 'Withdrawn': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getStatusColorClass = (status: Application['status']): string => {
    switch (status) {
      case 'Offered': return 'bg-green-100 text-green-700 border-green-300';
      case 'Interviewing': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Screening': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Applied': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Rejected':
      case 'Withdrawn': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">My Applications</h1>
            <p className="text-muted-foreground">Track your job application progress.</p>
        </div>
        <div className="w-full md:w-auto">
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value === 'all' ? '' : value)}>
            <SelectTrigger className="w-full md:w-[180px] h-11">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.keys(applicationStatusOrder).map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline flex items-center"><CheckSquare className="mr-2 h-5 w-5 text-primary"/>Applied Jobs List</CardTitle>
            <CardDescription>A summary of jobs you've applied for.</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredApplications.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job Title</TableHead>
                    <TableHead className="hidden md:table-cell">Company</TableHead>
                    <TableHead className="text-center">Fit %</TableHead>
                    <TableHead className="hidden sm:table-cell text-center">Date Applied</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((app) => (
                    <TableRow key={app.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{app.job.title}</TableCell>
                      <TableCell className="hidden md:table-cell">{app.job.company}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-300">
                          <Percent className="mr-1 h-3 w-3" />
                          {app.fitPercentage}%
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center">{new Date(app.appliedDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={getStatusBadgeVariant(app.status)} className={getStatusColorClass(app.status)}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild className="hover:bg-accent/10 active:scale-95 transition-all">
                          <a href={`/jobs/${app.job.id}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                            <span className="sr-only">View Job</span>
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
                <div className="text-center py-12">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold font-headline">No Applications Found</h3>
                  <p className="text-muted-foreground mt-2">
                    {filterStatus ? `No applications match the status "${filterStatus}".` : "You haven't applied for any jobs yet."}
                  </p>
                  <Button asChild className="mt-4 hover:opacity-80 active:scale-95 transition-all">
                    <a href="/jobs">Explore Jobs</a>
                  </Button>
                </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary"/>Application Activity</CardTitle>
                    <CardDescription>Your application submissions over time.</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={applicationActivityData} margin={{ top: 5, right: 20, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false}/>
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
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline">Application Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>✔️ Ensure your profile is fully verified for higher visibility.</p>
                    <p>✔️ Tailor your CV summary for each application.</p>
                    <p>✔️ Research the company before an interview.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

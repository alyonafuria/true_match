"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { sampleEmployerJobs, sampleApplicants } from '@/lib/data';
import type { Job } from '@/types';
import { Briefcase, Users, Edit3, Trash2, Eye, PlusCircle, MoreHorizontal, ChevronDown, CheckCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<Job[]>(sampleEmployerJobs);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState<Job | null>(null);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const { toast } = useToast();

  const handleViewApplicants = (job: Job) => {
    setSelectedJobForApplicants(job);
    setIsApplicantsModalOpen(true);
  };
  
  const handleCloseJob = (jobId: string) => {
    setJobs(prevJobs => prevJobs.map(job => job.id === jobId ? {...job, status: 'closed'} : job));
    toast({ title: "Job Closed", description: `Job "${jobs.find(j=>j.id === jobId)?.title}" has been closed.`});
  };

  const handleDeleteJob = (job: Job) => {
    setJobToDelete(job);
  };

  const confirmDeleteJob = () => {
    if (jobToDelete) {
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobToDelete.id));
      toast({ title: "Job Deleted", description: `Job "${jobToDelete.title}" has been deleted.`, variant: "destructive"});
      setJobToDelete(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">Manage Job Postings</h1>
            <p className="text-muted-foreground">Oversee your active and past job listings.</p>
        </div>
        <Button asChild className="hover:opacity-80 active:scale-95 transition-all">
          <Link href="/jobs/post">
            <PlusCircle className="mr-2 h-4 w-4" /> Post New Job
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary"/>Your Job Listings</CardTitle>
          <CardDescription>View, edit, or close your job postings. Click on a job to see applicants.</CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Applicants</TableHead>
                  <TableHead className="hidden md:table-cell text-center">Posted Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                        <Link href={`/jobs/manage/${job.id}`} className="hover:underline">{job.title}</Link>
                        <p className="text-xs text-muted-foreground md:hidden">{job.status === 'open' ? 'Open' : 'Closed'} - {job.applicantsCount || 0} Applicants</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={job.status === 'open' ? 'default' : 'secondary'} className={`${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {job.status === 'open' ? 'Open' : 'Closed'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center">{job.applicantsCount || 0}</TableCell>
                    <TableCell className="hidden md:table-cell text-center">{new Date(job.postedDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewApplicants(job)}>
                            <Users className="mr-2 h-4 w-4" /> View Applicants
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/jobs/edit/${job.id}`}><Edit3 className="mr-2 h-4 w-4" /> Edit Job</Link>
                          </DropdownMenuItem>
                           {job.status === 'open' && (
                            <DropdownMenuItem onClick={() => handleCloseJob(job.id)}>
                                <XCircle className="mr-2 h-4 w-4" /> Close Job
                            </DropdownMenuItem>
                           )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteJob(job)} className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Job
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold font-headline">No Jobs Posted Yet</h3>
              <p className="text-muted-foreground mt-2">Start by posting your first job to attract talent.</p>
            </div>
          )}
        </CardContent>
         {jobs.length > 0 && <CardFooter className="text-sm text-muted-foreground">Total Jobs: {jobs.length}</CardFooter>}
      </Card>

      {/* Applicants Modal */}
      <Dialog open={isApplicantsModalOpen} onOpenChange={setIsApplicantsModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-headline">Applicants for "{selectedJobForApplicants?.title}"</DialogTitle>
            <DialogDescription>
              Review candidates who applied for this position, sorted by fit percentage.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            {sampleApplicants.sort((a,b) => b.fitPercentage - a.fitPercentage).map(applicant => (
                <Card key={applicant.id} className="mb-4 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold">{applicant.name}</h4>
                                <p className="text-sm text-muted-foreground">Status: {applicant.status}</p>
                            </div>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">{applicant.fitPercentage}% Fit</Badge>
                        </div>
                        <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="outline" asChild className="hover:bg-accent/10 active:scale-95 transition-all">
                                <Link href={applicant.cvUrl} target="_blank">View CV</Link>
                            </Button>
                            {/* More actions like 'Shortlist', 'Reject' can be added here */}
                        </div>
                    </CardContent>
                </Card>
            ))}
            {sampleApplicants.length === 0 && <p className="text-muted-foreground text-center py-4">No applicants for this job yet.</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplicantsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the job posting for "{jobToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setJobToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteJob} className="hover:opacity-80 active:scale-95 transition-all">Delete Job</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

// Placeholder for edit job page /jobs/edit/[id]
// Placeholder for manage job details /jobs/manage/[id]

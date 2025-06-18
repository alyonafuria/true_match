"use client";

import Link from 'next/link';
import type { Job } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Percent, ArrowRight, DollarSign } from 'lucide-react';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useToast } from '@/hooks/use-toast';

interface JobCardProps {
  job: Job;
  showApplyButton?: boolean;
  showFitPercentage?: boolean;
}

export function JobCard({ job, showApplyButton = true, showFitPercentage = true }: JobCardProps) {
  const { role } = useUserRole();
  const { toast } = useToast();

  const handleApply = () => {
    // Simulate application
    toast({
      title: "Applied Successfully!",
      description: `You have applied for ${job.title} at ${job.company}.`,
    });
    // Potentially navigate to applications page or update state
  };
  
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full animate-scaleUp">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold font-headline hover:text-primary transition-colors">
                <Link href={`/jobs/${job.id}`}>{job.title}</Link>
            </CardTitle>
            {role === 'job_seeker' && showFitPercentage && job.fitPercentage && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Percent className="mr-1 h-3 w-3" /> {job.fitPercentage}% Match
              </Badge>
            )}
        </div>
        <CardDescription className="flex items-center text-sm text-muted-foreground pt-1">
          <Briefcase className="h-4 w-4 mr-2" /> {job.company}
          <MapPin className="h-4 w-4 mx-2" /> {job.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{job.description}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {job.requiredSkills.slice(0, 4).map(skill => (
            <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
          ))}
          {job.requiredSkills.length > 4 && <Badge variant="outline" className="text-xs">+{job.requiredSkills.length - 4} more</Badge>}
        </div>
        {job.salaryRange && (
             <p className="text-sm font-medium text-primary flex items-center"><DollarSign className="h-4 w-4 mr-1" />{job.salaryRange}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <p className="text-xs text-muted-foreground">Posted: {new Date(job.postedDate).toLocaleDateString()}</p>
        {role === 'job_seeker' && showApplyButton && (
          <Button size="sm" onClick={handleApply} className="hover:opacity-80 active:scale-95 transition-all">
            Apply Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
         {role !== 'job_seeker' && ( // Or based on specific page context like manage jobs
          <Button size="sm" asChild variant="outline" className="hover:bg-accent/10 active:scale-95 transition-all">
            <Link href={`/jobs/manage/${job.id}`}>View Details <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

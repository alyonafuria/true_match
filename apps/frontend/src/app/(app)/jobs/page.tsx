
"use client";

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { JobCard } from '@/components/JobCard';
import { sampleJobs } from '@/lib/data';
import type { Job } from '@/types';
import { Search, Filter, X, Briefcase, MapPin, Settings2 } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";


const JOBS_PER_PAGE = 6;

export default function JobBoardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const uniqueLocations = useMemo(() => Array.from(new Set(sampleJobs.map(job => job.location))), []);
  const allSkills = useMemo(() => Array.from(new Set(sampleJobs.flatMap(job => job.requiredSkills))), []);

  const filteredJobs = useMemo(() => {
    return sampleJobs.filter(job => {
      const matchesSearchTerm = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                job.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLocation = locationFilter ? job.location === locationFilter : true;
      const matchesSkill = skillFilter ? job.requiredSkills.includes(skillFilter) : true;
      return matchesSearchTerm && matchesLocation && matchesSkill;
    });
  }, [searchTerm, locationFilter, skillFilter]);

  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const currentJobs = filteredJobs.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setSkillFilter('');
    setCurrentPage(1);
  };
  
  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Find Your Next Opportunity</h1>
        <p className="text-muted-foreground text-lg">
          Explore thousands of job openings from top companies. Use filters to narrow down your search.
        </p>
      </header>

      <div className="p-6 bg-card rounded-xl shadow-lg border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2 lg:col-span-2">
            <label htmlFor="search-jobs" className="block text-sm font-medium mb-1">Search Jobs</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="search-jobs"
                type="text"
                placeholder="Job title, keywords, or company"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-10 h-11"
              />
            </div>
          </div>
          <div>
            <label htmlFor="location-filter" className="block text-sm font-medium mb-1">Location</label>
            <Select value={locationFilter} onValueChange={(value) => { setLocationFilter(value === 'all' ? '' : value); setCurrentPage(1); }}>
              <SelectTrigger className="h-11">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="skill-filter" className="block text-sm font-medium mb-1">Skill</label>
            <Select value={skillFilter} onValueChange={(value) => { setSkillFilter(value === 'all' ? '' : value); setCurrentPage(1); }}>
              <SelectTrigger className="h-11">
                <Settings2 className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="All Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {allSkills.map(skill => <SelectItem key={skill} value={skill}>{skill}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        {(searchTerm || locationFilter || skillFilter) && (
            <Button variant="ghost" onClick={clearFilters} className="text-sm text-primary hover:text-primary/80">
                <X className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
        )}
      </div>

      {currentJobs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold font-headline">No Jobs Found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search filters or check back later.</p>
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }} 
                className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Logic to display pages: always show first, last, current, and +/- 1 from current.
              // Show ellipsis if there's a gap.
              const showPageLink = totalPages <= 5 || // Show all if 5 or less pages
                                   pageNum === 1 || pageNum === totalPages || // Always show first and last
                                   Math.abs(pageNum - currentPage) <= 1; // Show current and its immediate neighbors
              
              const showEllipsisStart = totalPages > 5 && currentPage > 3 && pageNum === 2;
              const showEllipsisEnd = totalPages > 5 && currentPage < totalPages - 2 && pageNum === totalPages - 1;


              if (showPageLink) {
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); handlePageChange(pageNum); }}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              } else if (showEllipsisStart || showEllipsisEnd) {
                 return <PaginationEllipsis key={`ellipsis-${pageNum}`} />;
              }
              return null;
            })}
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }} 
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

// Minimal placeholder for job details page, accessible via /jobs/[id]
export function JobDetailsPagePlaceholder({ jobId }: { jobId: string }) {
  const job = sampleJobs.find(j => j.id === jobId);
  if (!job) return <div>Job not found</div>;

  return (
    <div>
      <h1>{job.title}</h1>
      <p>{job.company}</p>
      <p>{job.description}</p>
      {/* Add more details here */}
    </div>
  );
}

// You would create a src/app/(app)/jobs/[id]/page.tsx for actual job detail pages.
// For now, this placeholder function serves as a reminder for structure.


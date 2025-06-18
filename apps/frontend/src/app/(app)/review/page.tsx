"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { sampleVerificationQueue } from '@/lib/data';
import type { VerificationClaim } from '@/types';
import { CheckCircle, XCircle, FileCheck, Filter, AlertTriangle, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

export default function ReviewQueuePage() {
  const [claims, setClaims] = useState<VerificationClaim[]>(sampleVerificationQueue);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedClaim, setSelectedClaim] = useState<VerificationClaim | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();

  const filteredClaims = claims
    .filter(claim => filterStatus ? claim.status === filterStatus : true)
    .sort((a,b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        return new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime();
    });

  const getStatusBadgeVariant = (status: VerificationClaim['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Approved': return 'default'; // Success variant
      case 'Pending': return 'secondary';
      case 'Rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusColorClass = (status: VerificationClaim['status']): string => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700 border-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const openActionModal = (claim: VerificationClaim, type: 'approve' | 'reject') => {
    setSelectedClaim(claim);
    setActionType(type);
    setRejectionReason('');
    setIsActionModalOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedClaim || !actionType) return;

    // Simulate API call
    const newStatus = actionType === 'approve' ? 'Approved' : 'Rejected';
    setClaims(prevClaims => prevClaims.map(c => c.id === selectedClaim.id ? {...c, status: newStatus} : c));
    
    toast({
        title: `Claim ${newStatus}`,
        description: `Claim for ${selectedClaim.candidateName} has been ${newStatus.toLowerCase()}. ${actionType === 'reject' && rejectionReason ? `Reason: ${rejectionReason}` : ''}`
    });

    setIsActionModalOpen(false);
    setSelectedClaim(null);
    setActionType(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">Review Queue</h1>
            <p className="text-muted-foreground">Verify or reject submitted claims from candidates.</p>
        </div>
         <div className="w-full md:w-auto">
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value === 'all' ? '' : value)}>
            <SelectTrigger className="w-full md:w-[180px] h-11">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><FileCheck className="mr-2 h-5 w-5 text-primary"/>Verification Claims</CardTitle>
          <CardDescription>Review each claim carefully before taking action.</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredClaims.length > 0 ? (
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead className="min-w-[150px]">Claim Details</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Submitted</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClaims.map((claim) => (
                  <TableRow key={claim.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{claim.candidateName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate" title={claim.details}>{claim.details}</TableCell>
                    <TableCell className="hidden md:table-cell">{claim.claimType}</TableCell>
                    <TableCell className="hidden sm:table-cell text-center">{new Date(claim.submittedDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getStatusBadgeVariant(claim.status)} className={getStatusColorClass(claim.status)}>
                        {claim.status === 'Pending' && <Clock className="mr-1 h-3 w-3 animate-pulse" />}
                        {claim.status === 'Approved' && <CheckCircle className="mr-1 h-3 w-3" />}
                        {claim.status === 'Rejected' && <XCircle className="mr-1 h-3 w-3" />}
                        {claim.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {claim.status === 'Pending' ? (
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => openActionModal(claim, 'approve')} className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white active:scale-95 transition-all">
                            <CheckCircle className="mr-1 h-4 w-4" /> Approve
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openActionModal(claim, 'reject')} className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white active:scale-95 transition-all">
                            <XCircle className="mr-1 h-4 w-4" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Reviewed</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          ) : (
             <div className="text-center py-12">
              <FileCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold font-headline">No Claims Found</h3>
              <p className="text-muted-foreground mt-2">
                {filterStatus ? `No claims match the status "${filterStatus}".` : "The review queue is currently empty. Well done!"}
              </p>
            </div>
          )}
        </CardContent>
         {filteredClaims.length > 0 && <CardFooter className="text-sm text-muted-foreground">Total Claims: {filteredClaims.length}</CardFooter>}
      </Card>

      {/* Action Modal */}
      <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-headline">Confirm Action: {actionType === 'approve' ? 'Approve' : 'Reject'} Claim</DialogTitle>
            <DialogDescription>
              For candidate: <strong>{selectedClaim?.candidateName}</strong> <br/>
              Claim: <strong>{selectedClaim?.details}</strong>
            </DialogDescription>
          </DialogHeader>
          {actionType === 'reject' && (
            <div className="space-y-2 my-4">
              <Label htmlFor="rejectionReason">Reason for Rejection (Optional)</Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Provide a brief reason for rejecting this claim..."
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionModalOpen(false)}>Cancel</Button>
            <Button 
              variant={actionType === 'approve' ? 'default' : 'destructive'} 
              onClick={handleConfirmAction}
              className="hover:opacity-80 active:scale-95 transition-all"
            >
              {actionType === 'approve' ? <><CheckCircle className="mr-2 h-4 w-4"/>Confirm Approval</> : <><XCircle className="mr-2 h-4 w-4"/>Confirm Rejection</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { sampleEmployerPayments } from '@/lib/data';
import type { Payment } from '@/types';
import { CreditCard, PlusCircle, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { CardanoIcon } from '@/components/icons/CardanoIcon';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(sampleEmployerPayments);

  const getStatusBadgeVariant = (status: Payment['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Paid': return 'default'; // Success variant might be better
      case 'Pending': return 'secondary';
      case 'Failed': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getStatusColorClass = (status: Payment['status']): string => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-700 border-green-300';
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Failed': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };


  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold font-headline">Payments</h1>
            <p className="text-muted-foreground">Manage your job post payments and billing history.</p>
        </div>
        <Button asChild className="hover:opacity-80 active:scale-95 transition-all">
          <Link href="/payments/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Make a New Payment
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium font-headline">Total Spent</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$148.00</div>
                <p className="text-xs text-muted-foreground">Across all successful payments</p>
            </CardContent>
        </Card>
        <Card className="shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium font-headline">Pending Payments</CardTitle>
                 <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$49.00</div>
                <p className="text-xs text-muted-foreground">1 payment awaiting completion</p>
            </CardContent>
        </Card>
        <Card className="shadow-lg">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium font-headline">Failed Payments</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$0.00</div>
                <p className="text-xs text-muted-foreground">No failed payments recently</p>
            </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center"><CreditCard className="mr-2 h-5 w-5 text-primary"/>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead className="hidden md:table-cell">Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Method</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{payment.jobTitle}</TableCell>
                    <TableCell className="hidden md:table-cell">${payment.amount.toFixed(2)}</TableCell>
                    <TableCell className="hidden sm:table-cell">{new Date(payment.date).toLocaleDateString()}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {payment.method === 'Cardano' ? <CardanoIcon className="h-5 w-5 text-blue-500" /> : <CreditCard className="h-5 w-5 text-muted-foreground" />}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={getStatusBadgeVariant(payment.status)} className={getStatusColorClass(payment.status)}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold font-headline">No Payment History</h3>
              <p className="text-muted-foreground mt-2">Your payment transactions will appear here.</p>
            </div>
          )}
        </CardContent>
        {payments.length > 0 && <CardFooter className="text-sm text-muted-foreground">Displaying {payments.length} most recent transactions.</CardFooter>}
      </Card>
    </div>
  );
}

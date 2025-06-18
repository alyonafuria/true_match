"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, CheckCircle, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';
import { CardanoIcon } from '@/components/icons/CardanoIcon';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const sampleUnpaidJobs = [
  { id: 'job789', title: 'UX Designer Pro', amount: 75.00 },
  { id: 'job456', title: 'Marketing Manager', amount: 49.00 },
];

export default function NewPaymentPage() {
  const [selectedJobId, setSelectedJobId] = useState<string | undefined>(sampleUnpaidJobs[0]?.id);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cardano'>('card');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const { toast } = useToast();
  const router = useRouter();

  const selectedJob = sampleUnpaidJobs.find(job => job.id === selectedJobId);

  const handleSubmitPayment = async () => {
    if (!selectedJob) {
      toast({ title: "Error", description: "Please select a job to pay for.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    setPaymentStatus('processing');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Simulate random success/failure
    const isSuccess = Math.random() > 0.2; // 80% success rate
    
    if (isSuccess) {
      setPaymentStatus('success');
      toast({
        title: "Payment Successful!",
        description: `Payment of $${selectedJob.amount.toFixed(2)} for "${selectedJob.title}" processed via ${paymentMethod}.`,
      });
      // In a real app, update payment status in backend
      setTimeout(() => router.push('/payments'), 2000);
    } else {
      setPaymentStatus('error');
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again or use a different method.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/payments"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Payments</Link>
      </Button>
      <h1 className="text-3xl font-bold text-center font-headline">Make a Payment</h1>
      
      {paymentStatus === 'success' ? (
        <Card className="text-center shadow-lg p-8">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl font-headline">Payment Successful!</CardTitle>
            <CardDescription className="mt-2">
                Your payment for "{selectedJob?.title}" has been confirmed. Redirecting...
            </CardDescription>
        </Card>
      ) : paymentStatus === 'processing' ? (
         <Card className="text-center shadow-lg p-8">
            <RefreshCw className="mx-auto h-16 w-16 text-primary animate-spin mb-4" />
            <CardTitle className="text-2xl font-headline">Processing Payment...</CardTitle>
            <CardDescription className="mt-2">
                Please wait while we securely process your transaction.
            </CardDescription>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Payment Details</CardTitle>
            <CardDescription>Select a job post and your preferred payment method.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="job-select">Job Post to Pay For</Label>
              <Select value={selectedJobId} onValueChange={setSelectedJobId} disabled={isLoading}>
                <SelectTrigger id="job-select">
                  <SelectValue placeholder="Select a job post" />
                </SelectTrigger>
                <SelectContent>
                  {sampleUnpaidJobs.map(job => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title} - ${job.amount.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedJob && (
              <div className="p-4 border rounded-md bg-muted/50">
                <p className="font-medium">Selected: {selectedJob.title}</p>
                <p className="text-2xl font-bold text-primary">${selectedJob.amount.toFixed(2)}</p>
              </div>
            )}

            <div>
              <Label>Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as 'card' | 'cardano')}
                className="grid grid-cols-2 gap-4 mt-2"
                disabled={isLoading}
              >
                <div>
                  <RadioGroupItem value="card" id="card" className="peer sr-only" />
                  <Label
                    htmlFor="card"
                    className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <CreditCard className="mb-3 h-8 w-8" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="cardano" id="cardano" className="peer sr-only" />
                  <Label
                    htmlFor="cardano"
                    className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <CardanoIcon className="mb-3 h-8 w-8 text-blue-500" />
                    Cardano (ADA)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-4 p-4 border rounded-md animate-fadeIn">
                <h3 className="font-semibold">Enter Card Details</h3>
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="•••• •••• •••• ••••" disabled={isLoading}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry-date">Expiry Date</Label>
                    <Input id="expiry-date" placeholder="MM/YY" disabled={isLoading}/>
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="•••" disabled={isLoading}/>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'cardano' && (
              <div className="space-y-4 p-4 border rounded-md text-center animate-fadeIn">
                <h3 className="font-semibold">Pay with Cardano (ADA)</h3>
                <p className="text-sm text-muted-foreground">
                  Scan the QR code or send {selectedJob?.amount ? (selectedJob.amount / 0.40).toFixed(2) : 'N/A'} ADA (approx. based on $0.40/ADA) to the address below.
                </p>
                <Image
                  src="https://placehold.co/200x200.png?text=Cardano+QR" // Placeholder QR Code
                  alt="Cardano Payment QR Code"
                  width={150}
                  height={150}
                  className="mx-auto my-2 rounded-md border"
                  data-ai-hint="QR code payment"
                />
                <Input
                  readOnly
                  value="addr1qx2k...example...cardano...address...k9x0z" // Placeholder Cardano Address
                  className="text-center text-xs"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-2">Ensure you send the exact amount. Transactions are irreversible.</p>
              </div>
            )}
            {paymentStatus === 'error' && (
                <div className="flex items-center p-3 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                    <AlertTriangle className="h-5 w-5 mr-2"/>
                    <p className="text-sm">Payment failed. Please check your details or try another method.</p>
                </div>
            )}

          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSubmitPayment}
              disabled={!selectedJobId || isLoading || paymentStatus === 'processing'}
              className="w-full hover:opacity-80 active:scale-95 transition-all"
            >
              {isLoading ? 'Processing...' : `Pay $${selectedJob?.amount.toFixed(2) || '0.00'}`}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { services } from '@/app/data';
import type { Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

function ContractContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [agreed, setAgreed] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<{
    service: Service | null;
    serviceType: string;
    date: Date | null;
    time: string;
    price: number;
    location?: string;
  } | null>(null);

  useEffect(() => {
    const serviceId = searchParams.get('serviceId');
    const service = services.find(s => s.id === serviceId) || null;
    
    setBookingDetails({
      service,
      serviceType: searchParams.get('serviceType') || '',
      date: searchParams.get('date') ? new Date(searchParams.get('date')!) : null,
      time: searchParams.get('time') || '',
      price: Number(searchParams.get('price')) || 0,
      location: searchParams.get('location') || undefined,
    });
  }, [searchParams]);

  const handleProceedToPayment = () => {
    const query = new URLSearchParams(searchParams.toString());
    router.push(`/booking/payment?${query.toString()}`);
  };

  if (!bookingDetails || !bookingDetails.service || !bookingDetails.date) {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const { service, serviceType, date, time, price, location } = bookingDetails;
  
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-4xl text-primary">Booking Agreement</CardTitle>
          <CardDescription className="text-lg">Please review your booking details and agree to the terms below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Your Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Service:</strong> {service.name}</p>
              <p><strong>Date:</strong> {format(date, 'MMMM dd, yyyy')}</p>
              <p><strong>Time:</strong> {time}</p>
              <p><strong>Type:</strong> {serviceType === 'mobile' ? 'Mobile Service' : 'In-Studio'}</p>
              {serviceType === 'mobile' && location && <p><strong>Location:</strong> {location}</p>}
              <p className="text-lg font-bold pt-2"><strong>Total:</strong> ${price.toFixed(2)}</p>
            </CardContent>
          </Card>

          <div>
            <Label className="font-headline text-xl">Service Contract</Label>
            <ScrollArea className="mt-2 h-64 w-full rounded-md border p-4 text-sm">
              <h3 className="font-bold mb-2">Terms and Conditions</h3>
              <p className="mb-2">This agreement is between you ("the Client") and FaniaBook ("the Artist") for makeup services.</p>
              
              <h4 className="font-semibold mt-4 mb-1">1. Booking & Payment:</h4>
              <p className="mb-2">For 'Mobile Services', a non-refundable advance payment of 50% is required to secure your booking. The remaining balance is due on the day of the appointment. For 'In-Studio' services, full payment is due at the time of your appointment.</p>
              
              <h4 className="font-semibold mt-4 mb-1">2. Cancellations:</h4>
              <p className="mb-2">Cancellations must be made at least 48 hours in advance. The advance payment for mobile services is non-refundable. For in-studio services, a cancellation fee may apply if notice is not given within 48 hours.</p>

              <h4 className="font-semibold mt-4 mb-1">3. Artist's Obligations:</h4>
              <p className="mb-2">The Artist will provide the agreed-upon makeup services at the specified time and location. The Artist will use professional-grade products and maintain high standards of hygiene.</p>

              <h4 className="font-semibold mt-4 mb-1">4. Client's Obligations:</h4>
              <p>The Client must be ready at the scheduled time. For mobile services, the Client must provide a suitable space with adequate lighting and a power source. The Client agrees to inform the artist of any skin conditions or allergies prior to application.</p>
            </ScrollArea>
          </div>

          <div className="flex items-center space-x-2 pt-4">
            <Checkbox id="terms" onCheckedChange={(checked) => setAgreed(checked as boolean)} />
            <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              I have read and agree to the terms and conditions.
            </Label>
          </div>

          <Button 
            onClick={handleProceedToPayment} 
            disabled={!agreed} 
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90" 
            size="lg"
          >
            Proceed to Payment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


export default function ContractPage() {
  return (
    <Suspense fallback={<div>Loading contract...</div>}>
      <ContractContent />
    </Suspense>
  );
}

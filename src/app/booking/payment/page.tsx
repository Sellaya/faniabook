'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { services } from '@/app/data';
import type { Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { CreditCard, Info } from 'lucide-react';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [bookingDetails, setBookingDetails] = useState<{
    service: Service | null;
    serviceType: string;
    date: Date | null;
    price: number;
    advancePayment: number;
  } | null>(null);

  useEffect(() => {
    const serviceId = searchParams.get('serviceId');
    const service = services.find(s => s.id === serviceId) || null;
    const price = Number(searchParams.get('price')) || 0;
    const serviceType = searchParams.get('serviceType') || '';
    
    setBookingDetails({
      service,
      serviceType,
      date: searchParams.get('date') ? new Date(searchParams.get('date')!) : null,
      price,
      advancePayment: serviceType === 'mobile' ? price * 0.5 : 0,
    });
  }, [searchParams]);

  const handleConfirm = () => {
    const query = new URLSearchParams(searchParams.toString());
    router.push(`/booking/success?${query.toString()}`);
  };

  if (!bookingDetails || !bookingDetails.service || !bookingDetails.date) {
    return (
      <div className="container mx-auto max-w-2xl py-12 px-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
           <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  const { service, serviceType, date, price, advancePayment } = bookingDetails;
  
  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-4xl text-primary">Finalize Your Payment</CardTitle>
          <CardDescription className="text-lg">Confirm your booking by completing the payment step below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border bg-primary/5 p-4">
            <h3 className="font-semibold">Booking Summary</h3>
            <p className="text-sm">{service.name} on {format(date, 'MMMM dd, yyyy')}</p>
            <p className="text-2xl font-bold mt-2">${price.toFixed(2)}</p>
          </div>

          {serviceType === 'mobile' && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Mobile Service Payment</AlertTitle>
              <AlertDescription>
                A <strong>50% advance payment of ${advancePayment.toFixed(2)}</strong> is required to confirm your booking. The remaining balance is due on the day of service.
              </AlertDescription>
            </Alert>
          )}

          {serviceType === 'in-studio' && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>In-Studio Payment</AlertTitle>
              <AlertDescription>
                No advance payment is needed. You can pay the full amount in person on the day of your appointment.
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-background">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><CreditCard/> Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground">
                    This is a mock payment form. In a real application, a secure payment gateway like Stripe would be integrated here.
                </p>
                <div className="mt-4 space-y-4">
                    {/* Mock Stripe Elements */}
                    <div className="h-10 w-full rounded-md border border-input px-3 py-2">Card Number</div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-10 w-full rounded-md border border-input px-3 py-2">MM / YY</div>
                        <div className="h-10 w-full rounded-md border border-input px-3 py-2">CVC</div>
                    </div>
                </div>
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter>
            <Button onClick={handleConfirm} className="w-full bg-primary hover:bg-primary/90" size="lg">
                {serviceType === 'mobile' ? `Pay $${advancePayment.toFixed(2)} & Confirm` : 'Confirm Booking'}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div>Loading payment details...</div>}>
            <PaymentContent />
        </Suspense>
    )
}

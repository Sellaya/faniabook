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
import { CreditCard, Info, Store } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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
  
  const [inStudioPaymentOption, setInStudioPaymentOption] = useState('pay-in-studio');

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
      advancePayment: Math.round(price * 0.5),
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
  
  const showPaymentForm = serviceType === 'mobile' || (serviceType === 'in-studio' && inStudioPaymentOption === 'pay-deposit');
  const buttonText = () => {
      if (serviceType === 'mobile') return `Pay CAD $${advancePayment} & Confirm`;
      if (serviceType === 'in-studio' && inStudioPaymentOption === 'pay-deposit') return `Pay CAD $${advancePayment} & Confirm`;
      return 'Confirm Booking';
  }

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
            <p className="text-2xl font-bold mt-2">CAD ${price}</p>
          </div>

          {serviceType === 'mobile' && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Mobile Service Payment</AlertTitle>
              <AlertDescription>
                A <strong>50% advance payment of CAD ${advancePayment}</strong> is required to confirm your booking. The remaining balance is due on the day of service.
              </AlertDescription>
            </Alert>
          )}

          {serviceType === 'in-studio' && (
            <div>
              <Label className="font-headline text-xl">Payment Option</Label>
                <RadioGroup
                    value={inStudioPaymentOption}
                    onValueChange={setInStudioPaymentOption}
                    className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                    <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-sm hover:bg-accent/50 [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="pay-in-studio" className="sr-only" />
                        <Store className="mb-2 h-6 w-6" />
                        <span className="font-semibold">Pay In-Studio</span>
                        <span className="text-xs text-muted-foreground text-center mt-1">Pay the full amount in person on the day of your appointment.</span>
                    </Label>
                    <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-sm hover:bg-accent/50 [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="pay-deposit" className="sr-only" />
                        <CreditCard className="mb-2 h-6 w-6" />
                        <span className="font-semibold">Pay 50% Deposit Now</span>
                        <span className="text-xs text-muted-foreground text-center mt-1">Secure your spot by paying CAD ${advancePayment} today.</span>
                    </Label>
              </RadioGroup>
            </div>
          )}

          {showPaymentForm && (
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
          )}
        </CardContent>
        <CardFooter>
            <Button onClick={handleConfirm} className="w-full bg-primary hover:bg-primary/90" size="lg">
              {buttonText()}
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

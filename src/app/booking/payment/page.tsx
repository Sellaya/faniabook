'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { services } from '@/app/data';
import type { Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { CreditCard, Info, Store, Mail } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const InteracIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-6 w-6"
  >
    <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm.22 13.54L8.47 11a.5.5 0 010-.71l3.75-4.54a.5.5 0 01.81.58L10.32 11l2.71 3.26a.5.5 0 01-.81.68z"></path>
  </svg>
);


function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [bookingDetails, setBookingDetails] = useState<{
    service: Service | null;
    serviceType: string;
    date: Date | null;
    price: number;
    advancePayment: number;
  } | null>(null);
  
  const [paymentOption, setPaymentOption] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotError, setScreenshotError] = useState('');

  useEffect(() => {
    const serviceId = searchParams.get('serviceId');
    const service = services.find(s => s.id === serviceId) || null;
    const price = parseFloat(searchParams.get('price') || '0');
    const serviceType = searchParams.get('serviceType') || '';
    
    setBookingDetails({
      service,
      serviceType,
      date: searchParams.get('date') ? new Date(searchParams.get('date')!) : null,
      price,
      advancePayment: parseFloat((price * 0.5).toFixed(2)),
    });

    if (serviceType === 'in-studio') {
        setPaymentOption('pay-in-studio');
    } else {
        setPaymentOption('interac'); // Default for mobile
    }
  }, [searchParams]);

  const handleConfirm = () => {
    // For Interac, ensure screenshot is provided
    if (paymentOption === 'interac' && !screenshot) {
      setScreenshotError('Please upload a payment screenshot to confirm your booking.');
      return;
    }
    setScreenshotError('');
    
    const query = new URLSearchParams(searchParams.toString());
    // In a real app, you would handle the screenshot upload here.
    // For now, we just proceed.
    router.push(`/booking/success?${query.toString()}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
      setScreenshotError('');
    }
  }

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
  
  const requiresDeposit = serviceType === 'mobile' || (serviceType === 'in-studio' && paymentOption !== 'pay-in-studio');

  const buttonText = () => {
      if (paymentOption === 'pay-in-studio') return 'Confirm Booking';
      return `Pay CAD $${advancePayment.toFixed(2)} & Confirm`;
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
            <p className="text-2xl font-bold mt-2">CAD ${price.toFixed(2)}</p>
          </div>

          <div>
            <Label className="font-headline text-xl">Payment Option</Label>
              <RadioGroup
                  value={paymentOption}
                  onValueChange={setPaymentOption}
                  className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                  {serviceType === 'in-studio' && (
                    <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-sm hover:bg-accent/50 [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="pay-in-studio" className="sr-only" />
                        <Store className="mb-2 h-6 w-6" />
                        <span className="font-semibold">Pay In-Studio</span>
                        <span className="text-xs text-muted-foreground text-center mt-1">Pay the full amount on your appointment day.</span>
                    </Label>
                  )}
                  <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-sm hover:bg-accent/50 [&:has([data-state=checked])]:border-primary">
                      <RadioGroupItem value="interac" className="sr-only" />
                      <InteracIcon />
                      <span className="font-semibold mt-2">Interac e-Transfer</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">Pay 50% deposit (CAD ${advancePayment.toFixed(2)}) via Interac.</span>
                  </Label>
                  <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 text-sm hover:bg-accent/50 [&:has([data-state=checked])]:border-primary">
                      <RadioGroupItem value="stripe" className="sr-only" />
                      <CreditCard className="mb-2 h-6 w-6" />
                      <span className="font-semibold">Credit Card</span>
                      <span className="text-xs text-muted-foreground text-center mt-1">Pay 50% deposit (CAD ${advancePayment.toFixed(2)}) via Stripe.</span>
                  </Label>
            </RadioGroup>
          </div>

          {requiresDeposit && (
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>50% Deposit Required</AlertTitle>
                <AlertDescription>
                  A non-refundable deposit of <strong>CAD ${advancePayment.toFixed(2)}</strong> is required to secure your booking. The remaining balance is due on the day of service.
                </AlertDescription>
              </Alert>
          )}

          {paymentOption === 'interac' && requiresDeposit && (
            <Card className="bg-background">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><InteracIcon /> Interac e-Transfer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm">Please send <strong>CAD ${advancePayment.toFixed(2)}</strong> to the following email address:</p>
                    <div className="flex items-center gap-2 rounded-md border bg-muted p-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">contact@faniabook.com</span>
                    </div>
                    <p className="text-sm">After sending, please upload a screenshot of the confirmation below.</p>
                    <div>
                        <Label htmlFor="screenshot">Payment Screenshot</Label>
                        <Input id="screenshot" type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="mt-1"/>
                         {screenshot && <p className="text-sm text-green-600 mt-2">File selected: {screenshot.name}</p>}
                         {screenshotError && <p className="text-sm text-destructive mt-2">{screenshotError}</p>}
                    </div>
                </CardContent>
            </Card>
          )}


          {paymentOption === 'stripe' && requiresDeposit && (
            <Card className="bg-background">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-headline"><CreditCard/> Pay with Credit Card</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-center text-muted-foreground">
                      You will be redirected to Stripe to complete your payment securely.
                  </p>
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

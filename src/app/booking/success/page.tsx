'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { services } from '@/app/data';
import type { Service } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { CheckCircle, Home, Copy } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

function SuccessContent() {
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<{
    service: Service | null;
    serviceType: string;
    date: Date | null;
    time: string;
    price: number;
    location?: string;
    bookingId: string;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const serviceId = searchParams.get('serviceId');
    const service = services.find(s => s.id === serviceId) || null;
    
    // Generate a mock 4-digit booking ID
    const mockBookingId = Math.floor(1000 + Math.random() * 9000).toString();

    setBookingDetails({
      service,
      serviceType: searchParams.get('serviceType') || '',
      date: searchParams.get('date') ? new Date(searchParams.get('date')!) : null,
      time: searchParams.get('time') || '',
      price: Number(searchParams.get('price')) || 0,
      location: searchParams.get('location') || undefined,
      bookingId: mockBookingId,
    });
  }, [searchParams]);

  const handleCopyToClipboard = () => {
    if (bookingDetails?.bookingId) {
      navigator.clipboard.writeText(bookingDetails.bookingId);
      toast({
        title: "Booking ID Copied!",
        description: "You can use this ID to check your booking status later.",
      });
    }
  };

  if (!bookingDetails || !bookingDetails.service || !bookingDetails.date) {
    return (
      <div className="container mx-auto max-w-2xl py-12 px-4">
        <Card>
          <CardHeader className="items-center">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-8 w-3/4 mt-4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const { service, serviceType, date, time, price, location, bookingId } = bookingDetails;
  
  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card className="shadow-lg text-center">
        <CardHeader className="items-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <CardTitle className="font-headline text-4xl text-primary mt-4">Booking Confirmed!</CardTitle>
          <CardDescription className="text-lg">Your appointment has been successfully scheduled. You will receive a confirmation email shortly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-left">
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="font-headline text-xl">Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <p><strong>Your Booking ID:</strong> <span className="font-mono text-primary">{bookingId}</span></p>
                <Button variant="ghost" size="icon" onClick={handleCopyToClipboard}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy Booking ID</span>
                </Button>
              </div>
              <p><strong>Service:</strong> {service.name}</p>
              <p><strong>Date:</strong> {format(date, 'MMMM dd, yyyy')}</p>
              <p><strong>Time:</strong> {time}</p>
              <p><strong>Type:</strong> {serviceType === 'mobile' ? 'Mobile Service' : 'In-Studio'}</p>
              {serviceType === 'mobile' && location && <p><strong>Location:</strong> {location}</p>}
              <p className="text-lg font-bold pt-2"><strong>Total Amount:</strong> ${price.toFixed(2)}</p>
            </CardContent>
          </Card>
          <div className="flex justify-center gap-4 pt-4">
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Go to Homepage
              </Link>
            </Button>
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/booking/status">
                <Search className="mr-2 h-4 w-4" /> Check Booking Status
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
    return (
      <Suspense fallback={<div>Loading confirmation...</div>}>
        <SuccessContent />
      </Suspense>
    )
}

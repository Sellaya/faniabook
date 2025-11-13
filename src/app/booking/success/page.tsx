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
import { CheckCircle, Home, Copy, Search } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';

// A simple SVG for the WhatsApp icon
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);


function SuccessContent() {
  const searchParams = useSearchParams();
  const firestore = useFirestore();
  const [bookingDetails, setBookingDetails] = useState<{
    service: Service | null;
    serviceType: string;
    date: Date | null;
    time: string;
    price: number;
    location?: string;
    bookingId: string;
    phone: string;
    name: string;
    email: string;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!firestore) return;

    const serviceId = searchParams.get('serviceId');
    const service = services.find(s => s.id === serviceId) || null;
    const name = searchParams.get('name') || '';
    const email = searchParams.get('email') || '';
    const phone = searchParams.get('phone') || '';
    const date = searchParams.get('date') ? new Date(searchParams.get('date')!) : null;
    const time = searchParams.get('time') || '';
    
    if (service && name && email && phone && date && time) {
        const bookingsColRef = collection(firestore, 'bookings');
        const bookingData = {
            serviceId: service.id,
            serviceName: service.name,
            serviceType: searchParams.get('serviceType') || '',
            date: date.toISOString(),
            time: time,
            price: Number(searchParams.get('price')) || 0,
            location: searchParams.get('location') || undefined,
            clientName: name,
            email: email,
            phone: phone,
            status: 'Confirmed'
        };

        addDocumentNonBlocking(bookingsColRef, bookingData).then(docRef => {
            if (docRef) {
                 setBookingDetails({
                    service,
                    serviceType: bookingData.serviceType,
                    date: date,
                    time: time,
                    price: bookingData.price,
                    location: bookingData.location,
                    bookingId: docRef.id,
                    phone: phone,
                    name: name,
                    email: email,
                });
            }
        });
    }
  }, [searchParams, firestore]);

  const handleCopyToClipboard = () => {
    if (bookingDetails?.bookingId) {
      navigator.clipboard.writeText(bookingDetails.bookingId);
      toast({
        title: "Booking ID Copied!",
        description: "You can use this ID to check your booking status later.",
      });
    }
  };

  const createWhatsAppLink = () => {
    if (!bookingDetails || !bookingDetails.service || !bookingDetails.date) return '';

    const { service, date, time, bookingId, phone } = bookingDetails;
    const bookingStatusUrl = `${window.location.origin}/booking/status`;
    const message = `Hello! Here are my booking details:\n\n*Service:* ${service.name}\n*Date:* ${format(date, 'MMMM dd, yyyy')}\n*Time:* ${time}\n*Booking ID:* ${bookingId}\n\nCheck status here: ${bookingStatusUrl}`;
    
    // Basic phone number cleaning - assumes North American format if it's 10 digits.
    let formattedPhone = phone.replace(/\D/g, '');
    if(formattedPhone.length === 10) {
        formattedPhone = `1${formattedPhone}`;
    }

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  }

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
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-20 w-full mt-4" />
            <p className='text-center mt-4 text-muted-foreground'>Finalizing your booking...</p>
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
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Go to Homepage
              </Link>
            </Button>
            <Button asChild>
              <Link href="/booking/status">
                <Search className="mr-2 h-4 w-4" /> Check Booking Status
              </Link>
            </Button>
            <Button asChild variant="secondary" className="bg-green-500 text-white hover:bg-green-600">
                <a href={createWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                    <WhatsAppIcon className="mr-2 h-4 w-4" /> Send to WhatsApp
                </a>
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

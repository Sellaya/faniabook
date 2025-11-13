'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Search, Info, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useFirestore } from '@/firebase';
import { doc, getDoc, DocumentData } from 'firebase/firestore';

export default function BookingStatusPage() {
  const firestore = useFirestore();
  const [bookingId, setBookingId] = useState('');
  const [bookingDetails, setBookingDetails] = useState<DocumentData | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) {
        setError('Failed to connect to the database. Please try again later.');
        return;
    }
    setIsLoading(true);
    setError('');
    setBookingDetails(null);

    try {
        const docRef = doc(firestore, 'bookings', bookingId.trim());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setBookingDetails({ id: docSnap.id, ...data });
        } else {
            setError('No booking found with this ID. Please check the number and try again.');
        }
    } catch (e) {
        console.error("Error fetching booking:", e);
        setError('An error occurred while fetching your booking. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
              <Search className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="font-headline text-3xl">Check Your Booking</CardTitle>
              <CardDescription>
                Enter your booking ID to view the status and details of your appointment.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <form onSubmit={handleSearch}>
          <CardContent>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="booking-id" className="font-bold">Booking ID</Label>
              <Input
                id="booking-id"
                type="text"
                placeholder="Enter your booking ID"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !bookingId}>
              {isLoading ? 'Searching...' : 'Find My Booking'}
            </Button>
          </CardFooter>
        </form>

        {(bookingDetails || error) && (
          <CardContent>
            <div className="mt-6">
              {bookingDetails && (
                <Card className="bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline">
                      Booking Found
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p><strong>Client:</strong> {bookingDetails.clientName}</p>
                    <p><strong>Service:</strong> {bookingDetails.serviceName}</p>
                    <p><strong>Date:</strong> {new Date(bookingDetails.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><strong>Time:</strong> {bookingDetails.time}</p>
                    <div className="flex items-center gap-2">
                      <strong>Status:</strong> 
                       <Badge variant={bookingDetails.status === 'Confirmed' ? 'default' : 'secondary'} className={bookingDetails.status === 'Confirmed' ? 'bg-green-600' : ''}>
                          {bookingDetails.status}
                        </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                     <Button asChild variant="outline">
                        <Link href={`mailto:contact@faniabook.com?subject=Inquiry about Booking ID: ${bookingDetails.id}`}>
                            <Mail className="mr-2 h-4 w-4"/> Contact Admin
                        </Link>
                    </Button>
                  </CardFooter>
                </Card>
              )}
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

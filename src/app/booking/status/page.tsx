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
import { Search, Info, CheckCircle, Clock } from 'lucide-react';
import { detailedMockBookings } from '@/app/data';
import type { DetailedMockBooking } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export default function BookingStatusPage() {
  const [bookingId, setBookingId] = useState('');
  const [bookingDetails, setBookingDetails] = useState<DetailedMockBooking | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setBookingDetails(null);

    // Simulate API call
    setTimeout(() => {
      if (!/^\d{4}$/.test(bookingId)) {
        setError('Please enter a valid 4-digit booking ID.');
        setIsLoading(false);
        return;
      }

      const foundBooking = detailedMockBookings.find(b => b.id === bookingId);
      if (foundBooking) {
        setBookingDetails(foundBooking);
      } else {
        setError('No booking found with this ID. Please check the number and try again.');
      }
      setIsLoading(false);
    }, 1000);
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
                Enter your 4-digit booking ID to view the status and details of your appointment.
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
                placeholder="e.g., 1234"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                maxLength={4}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
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
